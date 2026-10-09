import { describe, expect, it } from "vitest";
import {
  collectSpecs,
  isImplementationFile,
  judgeGreenTest,
  judgeRedTest,
  verifyNoImplementationBeforeRed,
  verifyOnlyImplementationChanged,
  verifySingleUnskip,
  type PlaywrightReport,
} from "./rules.ts";

const baselineSource = [
  'test("first", () => {});',
  'test.skip("second", () => {});',
  'test.skip("third", () => {});',
].join("\n");

const unskip = (source: string, title: string) =>
  source.replace(`test.skip("${title}"`, `test("${title}"`);

const getMockReport = (overrides?: Partial<PlaywrightReport>): PlaywrightReport => ({
  errors: [],
  suites: [
    {
      title: "file.ct.tsx",
      specs: [],
      suites: [
        {
          title: "feature",
          specs: [
            { title: "first", line: 1, tests: [{ status: "expected" }] },
            { title: "second", line: 2, tests: [{ status: "unexpected" }] },
            { title: "third", line: 3, tests: [{ status: "skipped" }] },
          ],
        },
      ],
    },
  ],
  ...overrides,
});

describe("verifying that exactly one test was unskipped", () => {
  it("accepts a change that unskips one test and touches nothing else", () => {
    const current = unskip(baselineSource, "second");

    expect(verifySingleUnskip({ baseline: baselineSource, current })).toEqual({
      ok: true,
      line: 2,
    });
  });

  it("rejects a file that is unchanged", () => {
    const result = verifySingleUnskip({ baseline: baselineSource, current: baselineSource });

    expect(result).toEqual({
      ok: false,
      reason: expect.stringContaining("Unskip exactly one test"),
    });
  });

  it("rejects a change that unskips two tests", () => {
    const current = unskip(unskip(baselineSource, "second"), "third");

    const result = verifySingleUnskip({ baseline: baselineSource, current });

    expect(result.ok).toBe(false);
  });

  it("rejects an unskip that is mixed with another edit", () => {
    const current = `${unskip(baselineSource, "second")}\nconst extra = 1;`;

    const result = verifySingleUnskip({ baseline: baselineSource, current });

    expect(result.ok).toBe(false);
  });

  it("rejects a test that was edited instead of unskipped", () => {
    const current = baselineSource.replace('"first"', '"renamed"');

    const result = verifySingleUnskip({ baseline: baselineSource, current });

    expect(result.ok).toBe(false);
  });
});

describe("collecting specs from a Playwright report", () => {
  it("finds specs in nested suites", () => {
    expect(collectSpecs(getMockReport()).map((spec) => spec.title)).toEqual([
      "first",
      "second",
      "third",
    ]);
  });
});

describe("judging that the unskipped test is red", () => {
  it("accepts when the unskipped test fails and nothing else fails", () => {
    expect(judgeRedTest({ report: getMockReport(), line: 2 })).toEqual({ ok: true, title: "second" });
  });

  it("rejects when the unskipped test passes", () => {
    const report = getMockReport({
      suites: [
        {
          title: "feature",
          specs: [{ title: "second", line: 2, tests: [{ status: "expected" }] }],
        },
      ],
    });

    const result = judgeRedTest({ report, line: 2 });

    expect(result).toEqual({ ok: false, reason: expect.stringContaining("already passes") });
  });

  it("rejects when a different test fails", () => {
    const result = judgeRedTest({ report: getMockReport(), line: 1 });

    expect(result.ok).toBe(false);
  });

  it("rejects when the run had errors, such as a test file that does not compile", () => {
    const report = getMockReport({ errors: [{ message: "SyntaxError" }] });

    const result = judgeRedTest({ report, line: 2 });

    expect(result).toEqual({ ok: false, reason: expect.stringContaining("SyntaxError") });
  });

  it("rejects when the test did not run at all", () => {
    const result = judgeRedTest({ report: getMockReport({ suites: [] }), line: 2 });

    expect(result.ok).toBe(false);
  });
});

describe("judging that the chosen test is green", () => {
  const getGreenReport = (status: string): PlaywrightReport =>
    getMockReport({
      suites: [
        {
          title: "feature",
          specs: [{ title: "second", line: 2, tests: [{ status }] }],
        },
      ],
    });

  it("accepts when the chosen test passes", () => {
    expect(judgeGreenTest({ report: getGreenReport("expected"), line: 2 })).toEqual({
      ok: true,
      title: "second",
    });
  });

  it("rejects when the chosen test still fails", () => {
    const result = judgeGreenTest({ report: getGreenReport("unexpected"), line: 2 });

    expect(result).toEqual({
      ok: false,
      reason: expect.stringContaining('"second" still fails'),
    });
  });

  it("rejects when the chosen test is skipped again", () => {
    const result = judgeGreenTest({ report: getGreenReport("skipped"), line: 2 });

    expect(result.ok).toBe(false);
  });

  it("rejects when the run had errors", () => {
    const report = getMockReport({ errors: [{ message: "Build failed" }] });

    const result = judgeGreenTest({ report, line: 2 });

    expect(result).toEqual({ ok: false, reason: expect.stringContaining("Build failed") });
  });

  it("rejects when the chosen test did not run at all", () => {
    const result = judgeGreenTest({ report: getMockReport({ suites: [] }), line: 2 });

    expect(result.ok).toBe(false);
  });
});

describe("recognising implementation files", () => {
  it.each(["src/App.tsx", "src/components/expense-list.tsx", "src/lib/money.ts", "src/App.css"])(
    "treats %s as implementation",
    (path) => {
      expect(isImplementationFile(path)).toBe(true);
    },
  );

  it.each([
    "src/add-expense.ct.tsx",
    "src/App.test.tsx",
    "src/money.spec.ts",
    "features/add-expense.feature",
    "docs/lesson-one-instructions.md",
    "package.json",
    "playwright-ct.config.ts",
    "CLAUDE.md",
    ".claude/agents/red-green-implementer.md",
    "vitest.setup.ts",
    "src/tmp-all.ct.tsx",
  ])("does not treat %s as implementation", (path) => {
    expect(isImplementationFile(path)).toBe(false);
  });
});

describe("verifying that only implementation changed after red", () => {
  it("accepts changes to implementation files", () => {
    expect(verifyOnlyImplementationChanged({ changed: ["src/App.tsx", "src/App.css"] })).toEqual({
      ok: true,
    });
  });

  it("accepts no changes yet", () => {
    expect(verifyOnlyImplementationChanged({ changed: [] })).toEqual({ ok: true });
  });

  it("ignores the component test files and the scratch copy, which are checked separately", () => {
    const changed = ["src/App.tsx", "src/add-expense.ct.tsx", "src/tmp-all.ct.tsx"];

    expect(verifyOnlyImplementationChanged({ changed })).toEqual({ ok: true });
  });

  it("rejects changes to anything else and names the files", () => {
    const result = verifyOnlyImplementationChanged({
      changed: ["src/App.tsx", "package.json", "docs/notes.md"],
    });

    expect(result).toEqual({
      ok: false,
      reason: expect.stringMatching(/package\.json.*docs\/notes\.md/),
    });
  });

  it("rejects an edit to a Vitest test", () => {
    const result = verifyOnlyImplementationChanged({ changed: ["src/App.test.tsx"] });

    expect(result.ok).toBe(false);
  });
});

describe("verifying that nothing but the chosen test changed before red", () => {
  it("accepts changes to component test files and the scratch copy only", () => {
    const changed = ["src/add-expense.ct.tsx", "src/tmp-all.ct.tsx"];

    expect(verifyNoImplementationBeforeRed({ changed })).toEqual({ ok: true });
  });

  it("rejects any other file and says red comes first", () => {
    const result = verifyNoImplementationBeforeRed({ changed: ["src/App.tsx"] });

    expect(result).toEqual({
      ok: false,
      reason: expect.stringContaining("before the chosen test was verified red"),
    });
  });
});
