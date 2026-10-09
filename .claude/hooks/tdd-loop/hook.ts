import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { judgeRedTest, verifySingleUnskip, type PlaywrightReport } from "./rules.ts";

type HookInput = {
  readonly hook_event_name: string;
  readonly session_id: string;
  readonly agent_id?: string;
  readonly tool_name: string;
  readonly tool_input: { readonly file_path?: string; readonly command?: string };
};

type StepState =
  | { readonly phase: "choosing"; readonly baselines: Readonly<Record<string, string>> }
  | {
      readonly phase: "red";
      readonly title: string;
      readonly locked: Readonly<Record<string, string>>;
    };

const PROJECT_DIR = resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd());
const COMPONENT_TEST_PATTERN = /\.ct\.tsx$/;
const FILE_EDIT_TOOLS = ["Edit", "Write", "MultiEdit"];

const input: HookInput = JSON.parse(readFileSync(0, "utf8"));
const stateFile = join(tmpdir(), `tdd-loop-${input.agent_id ?? input.session_id}.json`);

const loadState = (): StepState | undefined =>
  existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, "utf8")) : undefined;

const saveState = (state: StepState): void => writeFileSync(stateFile, JSON.stringify(state));

const componentTestFiles = (): ReadonlyArray<string> =>
  readdirSync(join(PROJECT_DIR, "src"), { recursive: true, encoding: "utf8" })
    .filter((path) => COMPONENT_TEST_PATTERN.test(path))
    .map((path) => join("src", path));

const snapshot = (): Readonly<Record<string, string>> =>
  Object.fromEntries(
    componentTestFiles().map((path) => [path, readFileSync(join(PROJECT_DIR, path), "utf8")]),
  );

const changedFiles = (before: Readonly<Record<string, string>>): ReadonlyArray<string> => {
  const after = snapshot();
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(
    (path) => before[path] !== after[path],
  );
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

const isProductionEdit = (): boolean =>
  FILE_EDIT_TOOLS.includes(input.tool_name) &&
  !COMPONENT_TEST_PATTERN.test(input.tool_input.file_path ?? "");

const isTestEdit = (): boolean =>
  FILE_EDIT_TOOLS.includes(input.tool_name) &&
  COMPONENT_TEST_PATTERN.test(input.tool_input.file_path ?? "");

const beforeTool = (): never => {
  const state: StepState = loadState() ?? { phase: "choosing", baselines: snapshot() };
  saveState(state);

  if (state.phase === "choosing" && isProductionEdit()) {
    return deny(
      "Red first: unskip exactly one test in src/*.ct.tsx and watch it fail before touching any other file.",
    );
  }

  if (state.phase === "red" && isTestEdit()) {
    return deny("The chosen test is locked in its red state. Implement the code, not the test.");
  }

  return emit({});
};

const verifyChoosing = (state: Extract<StepState, { phase: "choosing" }>): never => {
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

  saveState({ phase: "red", title: red.title, locked: { [path]: current } });
  return inform(`Red verified: "${red.title}" fails. You may now implement the minimum code to make it pass.`);
};

const verifyRed = (state: Extract<StepState, { phase: "red" }>): never => {
  const changed = changedFiles(state.locked);
  return changed.length === 0
    ? emit({})
    : block(`The chosen test is locked in its red state, but ${changed.join(", ")} changed. Revert it.`);
};

const afterTool = (): never => {
  const state = loadState();
  if (!state) {
    return emit({});
  }
  return state.phase === "choosing" ? verifyChoosing(state) : verifyRed(state);
};

if (input.hook_event_name === "PreToolUse") {
  beforeTool();
}

afterTool();
