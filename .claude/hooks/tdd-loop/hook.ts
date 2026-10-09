import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import {
  SCRATCH_TEST_FILE,
  classifyTestLines,
  judgeFullSuite,
  judgeGreenTest,
  judgeRedTest,
  planRevert,
  verifyNoImplementationBeforeRed,
  verifyOnlyImplementationChanged,
  verifySingleUnskip,
  type PlaywrightReport,
  type RevertAction,
} from "./rules.ts";

type HookInput = {
  readonly hook_event_name: string;
  readonly session_id: string;
  readonly agent_id?: string;
  readonly stop_hook_active?: boolean;
  readonly tool_name?: string;
  readonly tool_input?: { readonly file_path?: string; readonly command?: string };
};

type Fingerprints = Readonly<Record<string, string>>;

type Unfinished = { readonly reason: string; readonly coupledOnly: boolean };

type StartContents = Readonly<Record<string, string | null>>;

type ChoosingState = {
  readonly phase: "choosing";
  readonly baselines: Fingerprints;
  readonly tree: Fingerprints;
  readonly startContents: StartContents;
};

type LockedState = {
  readonly phase: "red" | "green";
  readonly startContents: StartContents;
  readonly title: string;
  readonly line: number;
  readonly baseline: string;
  readonly locked: Fingerprints;
  readonly tree: Fingerprints;
};

type StepState = ChoosingState | LockedState;

const PROJECT_DIR = resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd());
const COMPONENT_TEST_PATTERN = /\.ct\.tsx$/;
const FILE_EDIT_TOOLS = ["Edit", "Write", "MultiEdit"];
const HANDBACK_TOOL = "SubagentHandback";

const input: HookInput = JSON.parse(readFileSync(0, "utf8"));
const stateFile = join(tmpdir(), `tdd-loop-${input.agent_id ?? input.session_id}.json`);

const loadState = (): StepState | undefined =>
  existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, "utf8")) : undefined;

const saveState = (state: StepState): void => writeFileSync(stateFile, JSON.stringify(state));

const componentTestFiles = (): ReadonlyArray<string> =>
  readdirSync(join(PROJECT_DIR, "src"), { recursive: true, encoding: "utf8" })
    .filter((path) => COMPONENT_TEST_PATTERN.test(path))
    .map((path) => join("src", path))
    .filter((path) => path !== SCRATCH_TEST_FILE);

const snapshot = (): Readonly<Record<string, string>> =>
  Object.fromEntries(
    componentTestFiles().map((path) => [path, readFileSync(join(PROJECT_DIR, path), "utf8")]),
  );

const differingPaths = ({
  before,
  after,
}: {
  before: Fingerprints;
  after: Fingerprints;
}): ReadonlyArray<string> =>
  [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(
    (path) => before[path] !== after[path],
  );

const changedFiles = (before: Fingerprints): ReadonlyArray<string> =>
  differingPaths({ before, after: snapshot() });

const fingerprint = (path: string): string => {
  const absolute = join(PROJECT_DIR, path);
  return existsSync(absolute)
    ? createHash("sha1").update(readFileSync(absolute)).digest("hex")
    : "deleted";
};

const dirtyPaths = (): ReadonlyArray<string> => {
  const status = spawnSync("git", ["status", "--porcelain", "-z", "--untracked-files=all"], {
    cwd: PROJECT_DIR,
    encoding: "utf8",
  }).stdout;
  return status
    .split("\0")
    .filter((entry) => entry.length > 3)
    .map((entry) => entry.slice(3));
};

const workingTree = (): Fingerprints =>
  Object.fromEntries(dirtyPaths().map((path) => [path, fingerprint(path)]));

const changedInWorkingTree = (before: Fingerprints): ReadonlyArray<string> =>
  differingPaths({ before, after: workingTree() });

const dirtyContents = (): StartContents =>
  Object.fromEntries(
    dirtyPaths().map((path) => [
      path,
      existsSync(join(PROJECT_DIR, path)) ? readFileSync(join(PROJECT_DIR, path), "utf8") : null,
    ]),
  );

const trackedAmong = (paths: ReadonlyArray<string>): ReadonlyArray<string> =>
  paths.length === 0
    ? []
    : spawnSync("git", ["ls-files", "-z", "--", ...paths], {
        cwd: PROJECT_DIR,
        encoding: "utf8",
      })
        .stdout.split("\0")
        .filter((path) => path.length > 0);

const applyRevertAction = (action: RevertAction): void => {
  const absolute = join(PROJECT_DIR, action.path);
  if (action.action === "write") {
    writeFileSync(absolute, action.content);
    return;
  }
  if (action.action === "delete") {
    rmSync(absolute, { force: true });
    return;
  }
  spawnSync("git", ["checkout", "HEAD", "--", action.path], { cwd: PROJECT_DIR });
};

const revertStep = (state: StepState): ReadonlyArray<string> => {
  const changed = changedInWorkingTree(state.tree);
  planRevert({
    changed,
    startContents: state.startContents,
    tracked: trackedAmong(changed),
  }).forEach(applyRevertAction);
  rmSync(stateFile, { force: true });
  return changed;
};

const isReport = (value: unknown): value is PlaywrightReport =>
  typeof value === "object" &&
  value !== null &&
  "errors" in value &&
  Array.isArray(value.errors) &&
  "suites" in value &&
  Array.isArray(value.suites);

const runTestFile = (path: string): PlaywrightReport | undefined => {
  const outputDir = mkdtempSync(join(tmpdir(), "tdd-loop-report-"));
  const outputFile = join(outputDir, "report.json");
  spawnSync(
    "npx",
    ["playwright", "test", "-c", "playwright-ct.config.ts", "--reporter=json", path],
    {
      cwd: PROJECT_DIR,
      env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: outputFile },
      timeout: 60_000,
    },
  );
  const report: unknown = existsSync(outputFile)
    ? JSON.parse(readFileSync(outputFile, "utf8"))
    : undefined;
  rmSync(outputDir, { recursive: true, force: true });
  return isReport(report) ? report : undefined;
};

const runWithEverythingUnskipped = (path: string): PlaywrightReport | undefined => {
  const source = readFileSync(join(PROJECT_DIR, path), "utf8");
  const scratch = join(PROJECT_DIR, SCRATCH_TEST_FILE);
  writeFileSync(scratch, source.replaceAll("test.skip(", "test("));
  try {
    return runTestFile(SCRATCH_TEST_FILE);
  } finally {
    rmSync(scratch, { force: true });
  }
};

const emit = (output: object): never => {
  process.stdout.write(JSON.stringify(output));
  return process.exit(0);
};

const deny = (reason: string): never =>
  emit({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  });

const block = (reason: string): never => emit({ decision: "block", reason });

const inform = (additionalContext: string): never =>
  emit({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext } });

const editedPath = (): string => input.tool_input?.file_path ?? "";

const isFileEdit = (): boolean => FILE_EDIT_TOOLS.includes(input.tool_name ?? "");

const isProductionEdit = (): boolean => isFileEdit() && !COMPONENT_TEST_PATTERN.test(editedPath());

const isTestEdit = (): boolean => isFileEdit() && COMPONENT_TEST_PATTERN.test(editedPath());

const beforeTool = (): never => {
  if (input.tool_name === HANDBACK_TOOL) {
    return beforeHandback();
  }

  const state: StepState = loadState() ?? {
    phase: "choosing",
    baselines: snapshot(),
    tree: workingTree(),
    startContents: dirtyContents(),
  };
  saveState(state);

  if (state.phase === "choosing" && isProductionEdit()) {
    return deny(
      "Red first: unskip exactly one test in src/*.ct.tsx and watch it fail before touching any other file.",
    );
  }

  if (state.phase !== "choosing" && isTestEdit()) {
    return deny("The chosen test is locked. Implement the code, not the test.");
  }

  if (state.phase !== "choosing" && isProductionEdit()) {
    const edited = relative(PROJECT_DIR, resolve(PROJECT_DIR, editedPath()));
    const verdict = verifyOnlyImplementationChanged({ changed: [edited] });
    return verdict.ok ? emit({}) : deny(verdict.reason);
  }

  return emit({});
};

const verifyChoosing = (state: ChoosingState): never => {
  const premature = verifyNoImplementationBeforeRed({
    changed: changedInWorkingTree(state.tree),
  });
  if (!premature.ok) {
    return block(premature.reason);
  }

  const changed = changedFiles(state.baselines);
  if (changed.length === 0) {
    return emit({});
  }

  const [path] = changed;
  if (changed.length > 1 || path === undefined) {
    return block(`Only one test file may change in this step, but these changed: ${changed.join(", ")}.`);
  }

  const baseline = state.baselines[path] ?? "";
  const current = readFileSync(join(PROJECT_DIR, path), "utf8");
  const unskip = verifySingleUnskip({ baseline, current });
  if (!unskip.ok) {
    return block(unskip.reason);
  }

  const report = runTestFile(relative(PROJECT_DIR, join(PROJECT_DIR, path)));
  if (!report) {
    return block("The test run produced no report, so the chosen test is not validly red.");
  }

  const red = judgeRedTest({ report, line: unskip.line });
  if (!red.ok) {
    return block(red.reason);
  }

  saveState({
    phase: "red",
    title: red.title,
    line: unskip.line,
    baseline,
    locked: { [path]: current },
    tree: state.tree,
    startContents: state.startContents,
  });
  return inform(`Red verified: "${red.title}" fails. You may now implement the minimum code to make it pass.`);
};

const lockedViolation = (state: LockedState): string | undefined => {
  const implementationOnly = verifyOnlyImplementationChanged({
    changed: changedInWorkingTree(state.tree),
  });
  if (!implementationOnly.ok) {
    return implementationOnly.reason;
  }

  const changed = changedFiles(state.locked);
  return changed.length === 0
    ? undefined
    : `The chosen test is locked, but ${changed.join(", ")} changed. Revert it.`;
};

const choosingViolation = (state: ChoosingState): string | undefined => {
  const premature = verifyNoImplementationBeforeRed({
    changed: changedInWorkingTree(state.tree),
  });
  if (!premature.ok) {
    return premature.reason;
  }

  const changed = changedFiles(state.baselines);
  return changed.length === 0
    ? undefined
    : `${changed.join(", ")} changed but no test was verified red. Revert it, or unskip exactly one test and watch it fail.`;
};

const verifyLocked = (state: LockedState): never => {
  const violation = lockedViolation(state);
  return violation ? block(violation) : emit({});
};

const afterTool = (): never => {
  const state = loadState();
  if (!state) {
    return emit({});
  }
  return state.phase === "choosing" ? verifyChoosing(state) : verifyLocked(state);
};

const unfinishedStep = (state: StepState): Unfinished | undefined => {
  const hardFailure = (reason: string): Unfinished => ({ reason, coupledOnly: false });

  if (state.phase === "choosing") {
    const leftover = choosingViolation(state);
    return leftover ? hardFailure(leftover) : undefined;
  }

  const violation = lockedViolation(state);
  if (violation) {
    return hardFailure(violation);
  }

  const [path] = Object.keys(state.locked);
  const report = path === undefined ? undefined : runTestFile(path);
  if (!report) {
    return hardFailure("The test run produced no report, so the chosen test is not verified green.");
  }

  const green = judgeGreenTest({ report, line: state.line });
  if (!green.ok) {
    return hardFailure(green.reason);
  }

  const fullReport = path === undefined ? undefined : runWithEverythingUnskipped(path);
  if (!fullReport) {
    return hardFailure("The full-suite run produced no report, so the other tests are not verified.");
  }

  const suite = judgeFullSuite({
    report: fullReport,
    finishedLines: classifyTestLines(state.baseline).finished,
    chosenLine: state.line,
  });
  if (!suite.ok) {
    return { reason: suite.reason, coupledOnly: suite.coupledOnly };
  }

  saveState({ ...state, phase: "green" });
  return undefined;
};

const describeRevert = (paths: ReadonlyArray<string>): string =>
  paths.length === 0 ? "nothing needed reverting" : `reverted: ${paths.join(", ")}`;

const beforeStop = (): never => {
  const state = loadState();
  const unfinished = state ? unfinishedStep(state) : undefined;
  if (!state || !unfinished) {
    return emit({});
  }

  if (unfinished.coupledOnly) {
    const reverted = revertStep(state);
    return emit({
      systemMessage: `Step incomplete because of coupled tests, all changes reverted (${describeRevert(reverted)}): ${unfinished.reason}`,
    });
  }

  return input.stop_hook_active
    ? emit({ systemMessage: `Stopped with the red-green step incomplete: ${unfinished.reason}` })
    : block(unfinished.reason);
};

const coupledTestsInstructions = (reverted: ReadonlyArray<string>): string =>
  `Coupled tests: ${describeRevert(reverted)}. The working tree is back to where this step started. Do not retry or work around it; a human will resolve it. Call SubagentHandback again with a report that starts with "STEP INCOMPLETE", names the chosen test, lists the coupled tests that passed, and says all changes were reverted.`;

const beforeHandback = (): never => {
  const state = loadState();
  const unfinished = state ? unfinishedStep(state) : undefined;
  if (!state || !unfinished) {
    return emit({});
  }

  return unfinished.coupledOnly
    ? deny(`${unfinished.reason} ${coupledTestsInstructions(revertStep(state))}`)
    : deny(`${unfinished.reason} Fix this before handing back.`);
};

const isStopEvent = (): boolean => ["Stop", "SubagentStop"].includes(input.hook_event_name);

if (isStopEvent()) {
  beforeStop();
}

if (input.hook_event_name === "PreToolUse") {
  beforeTool();
}

afterTool();
