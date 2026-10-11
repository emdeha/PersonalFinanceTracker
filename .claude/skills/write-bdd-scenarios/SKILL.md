---
name: write-bdd-scenarios
description: Discover and write high-quality Gherkin scenarios in features/*.feature and derive skipped Playwright component tests in src/*.ct.tsx from them, ready for outside-in TDD with red-green-step. Use when asked to specify, plan, or write the next feature, scenarios, acceptance criteria, or BDD tests.
---

# Write BDD scenarios

Turn a feature idea into a Gherkin spec and a matching set of skipped acceptance tests. Implementation is out of scope: hand off to `red-green-step`.

The reasoning and sources behind each rule are in [references/sources.md](references/sources.md). Read it when a rule needs justifying or you are unsure how to apply one.

## 1. Understand before writing

BDD is a conversation first and a file second. Do not jump to scenarios.

- Read `features/*.feature`, `src/*.ct.tsx` and `src/App.tsx` so the new work reuses the existing vocabulary and does not duplicate scenarios.
- State the story: "As a [role], I want [capability], so that [value]." If you cannot name the value, ask the user. A story with no value is a candidate to drop.
- Run an Example Mapping pass in text, then show it to the user before writing files:
  - **Rules**: the acceptance criteria, one line each.
  - **Examples**: concrete cases under each rule, using real values ("Coffee", "4.50"), not "valid input".
  - **Questions**: anything you cannot answer from the repo or the story.
- Probe each rule with Liz Keogh's two questions:
  - Context: is there another context in which the same event gives a different outcome? (empty list, zero, duplicates, whitespace, very large values, decimals)
  - Outcome: is there another outcome that matters? (what the form shows afterwards, what is kept, what is not changed)
- Ask the user about the open questions with `AskUserQuestion`. Do not invent business rules. Stories discovered along the way that are out of scope go in a "Not now" list, not in the feature.
- Too many rules or examples means the story is too big. Propose a split.

## 2. Write the feature file

Location and naming come from CLAUDE.md: `features/<kebab-case-feature>.feature`.

Structure:

- `Feature:` title, then the story in the three-line "As a / I want / So that" form.
- `Background:` only for context every scenario needs, at most 4 lines.
- `Rule:` blocks when a feature has several distinct business rules, each grouping the examples that illustrate it.
- `Scenario:` for each example. Use `Scenario Outline` with `Examples` only when rows differ by data alone and the same outcome shape holds.

Rules for every scenario:

1. **One behaviour per scenario.** One When, and Then steps that all describe the same outcome.
2. **3-5 steps.** Longer means it is testing more than one thing or leaking mechanics.
3. **Declarative, not imperative.** Describe what the user achieves, not keystrokes. Apply Cucumber's test: would the wording change if the UI changed? If yes, rewrite it. "When I add an expense named "Coffee" with amount "5"" beats three steps filling fields and clicking.
4. **Not too declarative either.** Keep the vocabulary the UI contract needs (the "Name" and "Amount" fields, the "Add" button, expense rows, error text) so a test can be derived. Where a precise UI fact is the behaviour itself, as with "the name field is empty", state it.
5. **Concrete values.** Use realistic data that makes the rule visible. Pick values on both sides of every boundary.
6. **Context, event, outcome.** Given is a state, When is one event, Then is an observable result. Never put an action in Then, never put an assertion in Given.
7. **Observable outcomes only.** Then steps describe what the user sees, not internal state, function calls or storage.
8. **Atomic steps.** No conjunction steps such as "Given I have a Coffee and a Groceries expense". Split into `And` steps.
9. **Titles state the rule.** "Cannot add an expense without a name", not "Test 3" or "Validation".
10. **Domain language.** Use the words the user would use. Reuse existing phrasing from `features/` so steps stay consistent. No technical terms such as "state", "component" or "DOM".
11. **Independent scenarios.** None may rely on another scenario having run.
12. **No coupled scenarios.** If one scenario is necessarily true whenever another one is, merge them or drop the weaker one. The `red-green-step` skill stops on this, so catch it here.

Order scenarios from the walking skeleton outwards: the simplest end-to-end happy path first, then variations, then edge cases and errors. This order is the order of the TDD steps.

## 3. Review before showing the user

Check each scenario against the list below and fix failures silently:

- Does it have a business reason to exist, not just a code path to cover?
- Could a non-programmer read it and say whether it is right?
- Is any step a UI mechanic that belongs in the test code instead?
- Does any pair of scenarios pass or fail together?
- Is there a missing context or outcome from the Keogh questions?

Then present the feature file and the list of open questions or "Not now" items. Wait for the user's approval before deriving tests.

## 4. Derive the acceptance tests

After approval, write one Playwright component test per scenario. Follow the "Playwright component tests" section of CLAUDE.md exactly (file naming, locators, timeouts, one test per Scenario or Examples row). In addition:

- Mount `<App />` and drive only the public surface: labels, roles and visible text. No component internals, no mocks of the app's own code.
- Name each test after its scenario title, in plain words.
- Put the three Gherkin phases in the test body in order, with a blank line before the assertion: setup, action, assertion. Do not add comments.
- Extract the existing small helpers (field locators, `addExpense`, `expectExpenseRow`) and add new ones for new domain phrases, so a test reads like its scenario. Reuse helpers that already exist in the file.
- Each test builds its own data inline. Share nothing mutable between tests.
- Write every new test as `test.skip(`. The only exception is when the user says to start with the first one.
- Run `npx tsc -b` and `npm run lint`. The tests must compile and mount. Running `npm run test:ct` needs the sandbox disabled, see `red-green-step`.

## 5. Hand off to outside-in TDD

Finish by reporting:

- the scenarios written, grouped by rule, in implementation order
- the open questions and "Not now" items
- the first test to drive, which should be the walking-skeleton scenario

Before any implementation, suggest an independent review of the result with the `bdd-reviewer` agent (skill `review-bdd-scenarios`). Fix its blocking findings first.

Then suggest running `red-green-step`, or the `red-green-implementer` agent, one scenario at a time. Do not write production code in this skill. A scenario must fail for a missing behaviour before anyone implements it.

## Anti-patterns to refuse

- Scenarios written from the code instead of from the user's goal.
- Test-per-function or test-per-branch scenarios.
- Imperative click-by-click scenarios.
- Scenarios asserting implementation details (CSS classes, state, storage).
- A huge Background.
- Scenario Outlines whose rows exercise different rules.
- Writing tests before the user has seen the scenarios.
