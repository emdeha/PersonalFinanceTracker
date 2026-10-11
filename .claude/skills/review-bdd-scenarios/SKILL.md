---
name: review-bdd-scenarios
description: Adversarially review the Gherkin scenarios in features/*.feature and the skipped Playwright component tests in src/*.ct.tsx that write-bdd-scenarios produced. Reports findings and a verdict, never edits. Use after write-bdd-scenarios has run, or when asked to review, critique, audit or challenge BDD scenarios or acceptance tests.
---

# Review BDD scenarios

You are the sceptic. `write-bdd-scenarios` has just produced a feature file and skipped acceptance tests, and its author already believes they are good. Your job is to find what is wrong with them before `red-green-step` builds on top of them. A scenario that slips through here becomes a wrong implementation later.

Review only. Do not edit `features/` or `src/`, and do not write production code. Report findings and let the author fix them.

The reasoning and sources for each check are in [references/sources.md](references/sources.md). Read it when a finding needs justifying.

## Stance

- Assume there are defects and look for them. "No findings" is a claim you must earn by running every pass below.
- Do not give credit for effort or good intentions. Judge the text of the scenarios and tests as they are.
- Do not re-derive the author's reasoning. Read the files cold, as the next developer would.
- Every finding needs evidence: the scenario title or test name, the offending line, and why it fails the check. Drop a finding you cannot ground in the text.
- Rank by consequence. A missing rule that lets a wrong implementation pass is worse than a phrasing nit.
- Opinion-level limits (step counts, row counts) are heuristics. Flag a breach as a smell, not as an error, unless it causes a real problem.

## 1. Gather the evidence

- Read every `features/*.feature` and `src/*.ct.tsx`, and `src/App.tsx` to learn what the app currently does. Reviewing against the code is only to learn the existing vocabulary and spot duplicated scenarios, never to excuse a weak scenario.
- Read `CLAUDE.md` for the project's test conventions.
- Use `git status` and `git diff` to see which scenarios are new in this change. Review the new ones in full and the old ones only for interaction with the new ones. If the prompt names a feature file, review that one.
- If the author left a story, rules list or "Not now" list in the conversation, use it. If not, reconstruct the story from the Feature header. A missing or valueless story is itself a finding.

## 2. Passes

Run all passes. Record findings as you go.

### Pass A: Is it specification, or a test script? (Adzic, Rose and Nagy)

- Would a non-programmer read each scenario and be able to say "yes, that is how it should work"?
- Does each scenario illustrate exactly one business rule? Can you state in one sentence what it verifies? If you need "and", it has two purposes.
- Does it read like a user session or a checklist of actions? That is a manual test script automated, not a specification.
- Is the title a rule or an outcome, or is it "Test 3", "Validation" or a restatement of the steps?
- Does the scenario say why the behaviour matters, or only that a path exists? A scenario with no business reason, written to cover a branch, is a finding.

### Pass B: Formulation (Rose and Nagy BRIEF, Adzic Given-When-Then, Cucumber)

Check each scenario against these. A single failure is a finding.

- **One When.** More than one When, or Given and When interleaved, is a smell.
- **Then is only an outcome.** An action in Then ("Then I click ...") is a defect. An assertion in Given is a defect.
- **Tense and voice.** Given is past or state ("I have entered", "no expenses have been added"), When is present and active, Then is a passive observable result. Given steps that are actions ("Given I type ...") are imperative.
- **Declarative.** Apply the wording test: would this step need to change if the UI changed? Keystroke and click steps fail it. Allow the exceptions the repo needs: the UI contract vocabulary ("Name" and "Amount" fields, "Add" button, expense rows, error text), and cases where the field state is itself the behaviour (for example "the category field is empty" after adding).
- **Not so abstract it cannot be automated.** A step that names no observable thing ("Then it works", "Then the data is valid") is a defect.
- **Business language.** No "state", "component", "DOM", "render", selectors, or CSS.
- **Real data.** Values should make the rule visible ("Coffee", "4.50"). "valid input", "some name" or interchangeable values that add nothing (banana and apple) are smells.
- **Essential only.** Remove steps that do not change the outcome. Each Given must matter to the Then.
- **Atomic steps.** Conjunction steps ("Given I have a Coffee and a Groceries expense") must be split.
- **Brief.** More than 5 steps is a smell, more than 10 is a defect. A Background longer than 4 lines is a smell. Background lines that only some scenarios need are a defect.
- **Scenario Outline.** Rows must differ by data only and share one outcome shape. Rows exercising different rules are a defect. Rows that are near duplicates add no information.
- **Reuse.** The same thing phrased two ways across features is a defect.

### Pass C: Independence and coupling (Adzic, Keogh)

- Does any scenario depend on another having run, or on shared state?
- Does any pair of scenarios always pass or fail together? Name the pair. This matters because `red-green-step` stops when a chosen test is not the only one that newly passes, so coupled scenarios block the TDD loop.
- Is any scenario a strict subset of another (same When, weaker Then)? Say which to drop or merge.
- Is a Then assertion duplicated across scenarios for no reason? It should live in the scenario for the rule that owns it.

### Pass D: Discovery gaps (Keogh, Wynne, Adzic key examples)

For every rule in the feature, ask the two Keogh questions and answer them yourself from the scenarios:

- **Context:** is there another context where the same event gives a different outcome? Check empty, zero, negative, whitespace-only, duplicate, very long, decimals, special characters, and an empty list.
- **Outcome:** is there another outcome that matters? Check what the form shows afterwards, what is kept, what is not changed, what other rows show, and what must not happen.

Then check boundaries. For each rule with a limit or threshold, are there examples on both sides and at the edge? Name every boundary that has no example.

Then check balance (Adzic, "Focus on key examples"):

- Too few: a rule with a single happy example and no counterexample.
- Too many: a rule illustrated by many near-identical examples, or a feature covering many unrelated rules. That story is too big and should be split.
- Rules that exist only as special cases, with no named business concept, are a smell that a concept is missing.

Check that no scenario encodes an invented business rule. If the scenario states a rule the user never gave (a limit, a format, a default), flag it as an assumption that needs the user's answer.

### Pass E: The adversarial probe (mutation thinking)

For each Rule, invent one or two plausible wrong implementations and ask whether any current scenario would catch them. Examples of the kind of mutation to try:

- the check is applied to only one field, or trims in the wrong place
- the validation fires but the error is shown for the wrong field, or stays visible after a later success
- the rule is hard-coded to the example value
- an off-by-one at a boundary
- state leaks: the form keeps old input, a failed add still changes the list
- a rule is satisfied by accident because of the order or the data chosen

If a wrong implementation passes every scenario, that is a missing-scenario finding. State the mutation and the scenario that would catch it. This is the most valuable pass, so do not skip it.

Also run the reverse check: if a scenario could be satisfied by a trivial or hard-coded implementation, say so. That is how the next red-green step will go wrong.

### Pass F: Fidelity of the derived tests

Compare `src/*.ct.tsx` to the feature file, scenario by scenario.

- One test per Scenario, and one per Examples row for an Outline. Report every scenario with no test and every test with no scenario.
- Test names match the scenario titles in plain words.
- Each test does what its scenario says: the same data, the same single action, and assertions for every Then and And step, with no extra assertions the scenario does not state.
- Setup, action and assertion appear in order with a blank line before the assertion, and there are no comments.
- Locators use `getByLabel`, `getByRole` and `getByText` only. No CSS classes, test ids, or reaching into component internals. No mocks of the app's own code.
- New tests are `test.skip(`, unless the user asked to start with the first one. Anything not skipped is a finding.
- Shared mutable state between tests (`let`, `beforeEach` that holds data) is a finding. Helpers should be small and named after domain phrases.
- Assertions that cannot fail, such as `toBeVisible` on something always present, or a negative assertion that passes before the feature exists in a way that does not prove the behaviour, are a finding. A skipped test must be able to fail for the missing behaviour once unskipped.
- If it is cheap, run `npx tsc -b` and `npm run lint` and report the result. Do not run `npm run test:ct` unless asked: it needs the sandbox disabled.

### Pass G: Repo conventions

- File location and name: `features/<kebab-case>.feature`, tests in `src/*.ct.tsx`.
- Feature has the three-line story with a value clause.
- Scenarios are ordered walking skeleton first, then variations, then edges and errors, because that is the TDD order.

## 3. Report

Do not soften the report. Use this shape and keep it scannable.

```
Verdict: APPROVE | REVISE | REJECT
One-line reason.

Blocking (must fix before red-green-step)
1. [Scenario "title" | test "name"] Smell or defect. Evidence: <quoted line>. Why it matters. Fix: <concrete rewrite or action>.

Should fix
...

Nitpicks
...

Missing scenarios
- Rule "...": <context or outcome or boundary>. Wrong implementation that would pass today: <mutation>. Suggested scenario: <title>.

Scenarios to drop or merge
- "A" and "B" are coupled because ...

Open questions for the user
- Anything the scenarios assume that only the user can answer.

What I checked
- Passes A-G run, files read, commands run and their results.
```

Verdict rules:

- **APPROVE**: no blocking findings, and the adversarial probe found no mutation that survives. Nitpicks may remain.
- **REVISE**: blocking findings exist but the feature is fundamentally sound. List them so the author can fix and re-run.
- **REJECT**: the feature is built on a wrong or valueless story, the scenarios are scripts, or most scenarios fail formulation. Say what to redo.

Blocking means: coupled scenarios, a mutation that survives, a missing test or an unskipped test, an action in Then, multiple rules in one scenario, an invented business rule, a test that cannot fail, or tests that do not match their scenarios. Style nits are never blocking.

Be specific enough that the author can act without asking you what you meant. Quote the exact line and give the exact rewrite. Do not pad with praise. If a pass found nothing, say so in one line under "What I checked".

## After the review

Hand the report back. The author fixes the blocking findings and runs this review again on the changed scenarios. Stop re-running once a pass returns no blocking findings. Never fix findings yourself, so that the reviewer stays independent of the writer.
