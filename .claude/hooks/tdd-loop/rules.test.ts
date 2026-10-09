import { describe, expect, it } from "vitest";
import {
  collectSpecs,
  judgeRedTest,
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
