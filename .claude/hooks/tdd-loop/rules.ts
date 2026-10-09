export type PlaywrightSpec = {
  readonly title: string;
  readonly line: number;
  readonly tests: ReadonlyArray<{ readonly status: string }>;
};

export type PlaywrightSuite = {
  readonly title: string;
  readonly specs?: ReadonlyArray<PlaywrightSpec>;
  readonly suites?: ReadonlyArray<PlaywrightSuite>;
};

export type PlaywrightReport = {
  readonly errors: ReadonlyArray<{ readonly message: string }>;
  readonly suites: ReadonlyArray<PlaywrightSuite>;
};

type Verdict<T> = ({ readonly ok: true } & T) | { readonly ok: false; readonly reason: string };

const SKIPPED_TEST = "test.skip(";
const ACTIVE_TEST = "test(";

const indexesOf = ({ source, token }: { source: string; token: string }): ReadonlyArray<number> =>
  Array.from(source.matchAll(new RegExp(token.replace(/[().]/g, "\\$&"), "g")), (match) => match.index);

const lineAt = ({ source, index }: { source: string; index: number }): number =>
  source.slice(0, index).split("\n").length;

const unskipAt = ({ source, index }: { source: string; index: number }): string =>
  source.slice(0, index) + ACTIVE_TEST + source.slice(index + SKIPPED_TEST.length);

export const verifySingleUnskip = ({
  baseline,
  current,
}: {
  baseline: string;
  current: string;
}): Verdict<{ line: number }> => {
  const matchingIndex = indexesOf({ source: baseline, token: SKIPPED_TEST }).find(
    (index) => unskipAt({ source: baseline, index }) === current,
  );

  if (matchingIndex === undefined) {
    return {
      ok: false,
      reason:
        "Unskip exactly one test: change a single `test.skip(` to `test(` and make no other change to the test file.",
    };
  }

  return { ok: true, line: lineAt({ source: current, index: matchingIndex }) };
};

export const SCRATCH_TEST_FILE = "src/tmp-all.ct.tsx";

const COMPONENT_TEST_FILE = /\.ct\.tsx$/;
const IMPLEMENTATION_FILE = /^src\/.+\.(ts|tsx|css)$/;
const VITEST_FILE = /\.(test|spec)\./;

const isComponentTestFile = (path: string): boolean => COMPONENT_TEST_FILE.test(path);

export const isImplementationFile = (path: string): boolean =>
  IMPLEMENTATION_FILE.test(path) && !isComponentTestFile(path) && !VITEST_FILE.test(path);

const listFiles = (paths: ReadonlyArray<string>): string => paths.join(", ");

export const verifyOnlyImplementationChanged = ({
  changed,
}: {
  changed: ReadonlyArray<string>;
}): Verdict<object> => {
  const offenders = changed.filter(
    (path) => !isComponentTestFile(path) && !isImplementationFile(path),
  );

  return offenders.length === 0
    ? { ok: true }
    : {
        ok: false,
        reason: `Only implementation source (src/**/*.ts, tsx, css; not tests) may change in this step. Revert: ${listFiles(offenders)}.`,
      };
};

export const verifyNoImplementationBeforeRed = ({
  changed,
}: {
  changed: ReadonlyArray<string>;
}): Verdict<object> => {
  const offenders = changed.filter((path) => !isComponentTestFile(path));

  return offenders.length === 0
    ? { ok: true }
    : {
        ok: false,
        reason: `${listFiles(offenders)} changed before the chosen test was verified red. Revert it, then unskip one test and watch it fail first.`,
      };
};

const specsOf =(suite: PlaywrightSuite): ReadonlyArray<PlaywrightSpec> => [
  ...(suite.specs ?? []),
  ...(suite.suites ?? []).flatMap(specsOf),
];

export const collectSpecs = (report: PlaywrightReport): ReadonlyArray<PlaywrightSpec> =>
  report.suites.flatMap(specsOf);

const hasStatus = ({ spec, status }: { spec: PlaywrightSpec; status: string }): boolean =>
  spec.tests.some((test) => test.status === status);

const TEST_CALL = /\btest(\.skip)?\(/;

export const classifyTestLines = (
  source: string,
): { finished: ReadonlyArray<number>; pending: ReadonlyArray<number> } => {
  const calls = source.split("\n").flatMap((text, index) => {
    const match = text.match(TEST_CALL);
    return match ? [{ line: index + 1, skipped: match[1] !== undefined }] : [];
  });

  return {
    finished: calls.filter((call) => !call.skipped).map((call) => call.line),
    pending: calls.filter((call) => call.skipped).map((call) => call.line),
  };
};

const allPass = (spec: PlaywrightSpec): boolean =>
  spec.tests.every((test) => test.status === "expected");

export const judgeFullSuite = ({
  report,
  finishedLines,
  chosenLine,
}: {
  report: PlaywrightReport;
  finishedLines: ReadonlyArray<number>;
  chosenLine: number;
}): Verdict<object> => {
  if (report.errors.length > 0) {
    return {
      ok: false,
      reason: `The full-suite run reported errors: ${report.errors.map((error) => error.message).join("; ")}`,
    };
  }

  const specs = collectSpecs(report);
  const isFinished = (spec: PlaywrightSpec): boolean => finishedLines.includes(spec.line);

  const problems = [
    ...finishedLines
      .filter((line) => !specs.some((spec) => spec.line === line))
      .map((line) => `The finished test at line ${line} did not run.`),
    ...specs
      .filter((spec) => isFinished(spec) && !allPass(spec))
      .map((spec) => `"${spec.title}" used to pass and now fails. Do not break finished tests.`),
    ...specs
      .filter((spec) => spec.line === chosenLine && !allPass(spec))
      .map((spec) => `"${spec.title}" is the chosen test and does not pass.`),
    ...specs
      .filter((spec) => !isFinished(spec) && spec.line !== chosenLine && hasStatus({ spec, status: "expected" }))
      .map(
        (spec) =>
          `"${spec.title}" passes but it was not the chosen test. Remove the code that makes it pass.`,
      ),
  ];

  return problems.length === 0 ? { ok: true } : { ok: false, reason: problems.join(" ") };
};

export const judgeGreenTest =({
  report,
  line,
}: {
  report: PlaywrightReport;
  line: number;
}): Verdict<{ title: string }> => {
  if (report.errors.length > 0) {
    return {
      ok: false,
      reason: `The test run reported errors: ${report.errors.map((error) => error.message).join("; ")}`,
    };
  }

  const chosen = collectSpecs(report).find((spec) => spec.line === line);

  if (!chosen) {
    return { ok: false, reason: `The chosen test (line ${line}) did not run.` };
  }

  if (hasStatus({ spec: chosen, status: "unexpected" })) {
    return {
      ok: false,
      reason: `"${chosen.title}" still fails. Keep implementing until it passes, then finish.`,
    };
  }

  return chosen.tests.every((test) => test.status === "expected")
    ? { ok: true, title: chosen.title }
    : { ok: false, reason: `"${chosen.title}" did not pass. Keep it unskipped and make it pass.` };
};

export const judgeRedTest =({
  report,
  line,
}: {
  report: PlaywrightReport;
  line: number;
}): Verdict<{ title: string }> => {
  if (report.errors.length > 0) {
    return {
      ok: false,
      reason: `The test run reported errors, so the test is not validly red: ${report.errors
        .map((error) => error.message)
        .join("; ")}`,
    };
  }

  const specs = collectSpecs(report);
  const unskipped = specs.find((spec) => spec.line === line);

  if (!unskipped) {
    return { ok: false, reason: `The unskipped test (line ${line}) did not run.` };
  }

  if (!hasStatus({ spec: unskipped, status: "unexpected" })) {
    return {
      ok: false,
      reason: `"${unskipped.title}" already passes, so there is nothing to implement. Stop and report this.`,
    };
  }

  const otherFailure = specs.find(
    (spec) => spec.line !== line && hasStatus({ spec, status: "unexpected" }),
  );

  if (otherFailure) {
    return {
      ok: false,
      reason: `"${otherFailure.title}" fails, but it is not the test chosen for this step. Stop and report this.`,
    };
  }

  return { ok: true, title: unskipped.title };
};
