---
name: review-implementation
description: Review implemented code and its tests against XP design practice. Checks that tests are behavioral and structure-insensitive, the code is refactored and well named, it follows hexagonal architecture and DDD in proportion to its size, and it is not over-engineered. Reports findings and a verdict, never edits. Use when a piece of work is finished, or when asked to review, critique or audit the implementation, the refactoring, naming or architecture.
---

# Review implementation

Code that passes its tests is not yet code that is good to build on. This skill is the design review of finished work, done by a second pair of eyes: is the code in a shape you would be happy to build the next feature on? It does not depend on how the code was written, so it works on any change.

XP has no review meeting. Pairing is review while the code is written, collective ownership means anyone may change it, and the tests are the machine reviewer. This skill stands in for the missing pair. So it reviews the way a navigator would: small steps, concrete, about the code in front of you, with a direction to take.

Review only. Do not edit `src/`, `features/` or any config, and do not commit. Report findings and let the author fix them.

The reasoning and sources for each check are in [references/sources.md](references/sources.md). Read it when a finding needs justifying.

## Stance

- Judge the code as the next developer finds it. Do not credit the author's intentions or the size of the diff.
- **The order of values is Beck's: passes the tests, reveals intention, no duplication, fewest elements.** When two findings conflict, the earlier rule wins. Never trade clarity for less duplication, and never trade fewest elements for a speculative abstraction.
- **Proportion decides everything.** The app is small. Hexagonal architecture and DDD are tools for keeping business rules free of technology, not shapes to be present on day one. Ask of every structure: what current behavior or current test needs it? Structure with no current need is a finding, and so is a business rule stuck inside a UI component, because that rule now has a current need to live elsewhere.
- Every finding needs evidence: file and line, the quoted code, the rule it breaks, and a concrete rewrite or the smallest next move. Drop a finding you cannot ground in the code.
- Rank by consequence. A business rule that only the UI can reach is worse than a variable name. A name nit is never blocking.
- **A claim about runtime behavior is a hypothesis until you have run it.** That covers "this mutation survives", "this test would catch it", and "this matcher normalizes whitespace". Reading the code is not evidence of what a test framework does. Verify it with the mutation protocol in Pass F, or label the claim "unverified" and keep it out of Blocking.
- Do not invent business rules. If the code reveals a rule the scenarios do not state, report it as an open question, not a defect.
- Do not ask for new behavior. Missing behavior is not a finding unless an existing test or scenario in `features/` already requires it. Scenarios that are not implemented yet are the future: use them only to judge whether the structure will absorb them (Pass D, direction of change).

## 1. Gather the evidence

- Decide the scope. Use what the prompt names: files, a feature, a commit range or a branch. If it names none, review the uncommitted changes, and if there are none, the changes on the current branch since it left the main branch. Say what you picked.
- Run `git status`, `git diff` and `git log` for that scope. Review the diff in full, and the files it touches in full, since a clean diff can still sit in a messy file.
- Read every changed file under `src/`, plus its neighbors, to learn the existing structure and vocabulary. Read `features/*.feature` for the ubiquitous language: the nouns and verbs the scenarios use are the names the code should use.
- Read `CLAUDE.md` and `~/.claude/CLAUDE.md` for house style: no comments, immutable data, early returns, `type` over `interface`, options objects, kebab-case files, strict TypeScript, no `any` and no assertions. A breach is a finding.
- Run `npx tsc -b`, `npm run lint` and `npx vitest run`. Report failures. Run the Playwright tests (`npm run test:ct`) only for the mutation protocol in Pass F, and only on the scratch copy it describes.

## 2. Passes

Run all passes and record findings as you go. A pass that finds nothing gets one line under "What I checked".

### Pass A: Tests are behavioral and structure-insensitive (Beck's Test Desiderata, Freeman and Pryce)

The acceptance tests in `src/*.ct.tsx` are the contract. Read them as the code under review sees them.

- **Behavioral.** If the behavior breaks, does a test fail? Try mutations: drop a trim, flip a comparison, skip clearing the form, apply a check to one field only. For each, name the test that would fail. If none would, report a missing or weak test.
- **Structure-insensitive.** Could you extract a module, rename a function, split a component or swap `useState` for a reducer without touching a single test? If a test would break, it is coupled to structure. Look for locators by CSS class, test id or DOM position, assertions on internal state, and mocks of the app's own code.
- **Through the public door.** Tests mount `<App />` and use `getByLabel`, `getByRole` and `getByText`. There must be no test of internals. In particular there must be no new `*.test.ts` file whose only reason to exist is one extracted function. This project's rule, from the user's guidelines, is no 1:1 file mapping: extracted domain code is covered through the behavior that uses it. Vitest tests for extracted code are allowed only when a rule has many cases that would make the acceptance tests slow or repetitive, and they must test through the module's exported API only.
- **Readable and specific.** Test names state a rule in business words. When one fails, the name alone tells you what broke. Helpers (such as `expense-page.ts`) are named after domain phrases, not after clicks.
- **Isolated and deterministic.** No shared mutable state (`let`, `beforeEach` holding data), no order dependence, no timers or random values.
- **No test for the sake of coverage.** A test that no scenario in `features/` asks for is a finding.
- **Tests were not weakened.** In the diff, look for tests whose assertions were loosened, removed, skipped or deleted to make the code pass. Unless a scenario in `features/` changed with it, that is blocking.

### Pass B: Refactoring (Beck, Fowler, Kerievsky)

Judge the code as it stands now, with the tests green.

- **Reveals intention.** Can you read each function top to bottom and say what business thing it does without reading its body twice? Mixed levels of abstraction in one function (parsing text, deciding a rule, and setting UI state in one block) are the commonest finding.
- **Long function, long parameter list, nesting deeper than two levels, boolean flag parameters.** House style: small functions, early returns, options objects.
- **Duplication of knowledge.** The same business rule stated twice, such as a limit or a message. Apply the rule of three to structural duplication: two similar blocks are a note, three are a finding. Say which, and never flag duplication that merely looks alike but means different things (Metz).
- **Smells with a named fix.** Name the smell (Feature Envy, Primitive Obsession, Shotgun Surgery, Data Clump, Long Method, Temporary Field) and the refactoring (Extract Function, Replace Primitive with Value Object, Move Function, Introduce Parameter Object).
- **Dead code and leftovers.** Unused exports, commented-out code, `console.log`, leftover `tmp-all.ct.tsx` files, unused state, props or parameters.
- **Comments.** The house style bans them. Each comment is a name that has not been found yet. Report the comment and the name that would replace it.
- **Immutability.** Any mutation of arrays or objects, `push`, `splice`, assignment to a field, `let` that is reassigned.
- **Do not demand refactoring without a reason.** One line is fine as it is. A refactoring is a finding only if you can state what is hard to read or change today, or what the next scenario in `features/` will make hard.
- **Separate commits.** Refactoring goes in its own commit, apart from behavior changes. If a commit in scope mixes the two, say so.
- **Duplication that grew by accretion.** Check `git log` for a check, branch or message added once per commit in the same shape. Count them. Three in the same shape is the signal to extract.

### Pass C: Naming (Evans' ubiquitous language, Beck's "reveals intention")

- Every name in the code that stands for a business concept must be the word the scenarios and the user use: if the feature file says "expense" and "category", the code must not say `item`, `entry` or `tag`.
- Names say what, not how and not type: `validatedExpense` over `data`, `isBlank` over `check`, no `Manager`, `Handler`, `Helper`, `Util`, `Data`, `Info`, `Thing`.
- Booleans read as questions (`hasCategory`, `isAmountPositive`). Functions are verbs. Types are nouns.
- Length should match scope. `i` in a two-line map is fine. `e` for an event across 20 lines is not. A 40-character name usually means the function does too much.
- One concept, one name. The same idea called two things in two files, or two ideas sharing one name, is a finding.
- Error and message strings that carry a business rule belong with that rule, with the wording the scenarios use.
- Files are `kebab-case.ts`, named after the concept they hold, not after the pattern (`expense.ts`, not `expense-service.ts`).

### Pass D: Hexagonal architecture and DDD, in proportion (Cockburn, Evans, Vernon, Fowler)

First decide what the code is today. Then judge it against the smallest shape that is justified now.

**Where things live.** Check each piece of code and put it in one of three places:

- **Domain** (the inside): business rules and the vocabulary of the problem, written as plain TypeScript with no React, no DOM, no `fetch`, no storage, no `Date.now()` or random values called directly. It is pure, so it is testable without a browser.
- **Application** (use cases): coordinates one user intention, such as "add an expense", by calling domain code and driven ports. It holds no business rule of its own.
- **Adapters** (the outside): React components and hooks (driving), and storage, network and clocks (driven). They translate between the technology and the domain. They hold no business rules.

**Findings to look for:**

- A business rule inside a component or hook: validation, trimming, defaults, sums, limits, formatting rules that carry meaning. This is the main smell in this codebase today. Say which rule, and the smallest move that takes it out: for example a pure function that returns a result (success with the expense, or failure with the reason), called by the component. Do not ask for a layer, ask for the one function.
- The domain importing from outside: `react`, `react-dom`, a browser global, or an adapter file. The dependency arrow must point inward, always.
- A driven dependency (storage, clock, id generation, network) reached directly from the domain or from a component. Once such a dependency exists, there must be a port, which is a small interface in the inside's own vocabulary (`ExpenseRepository` with `save` and `list`), and an adapter that implements it. Persistence is the usual first case. Until a driven dependency exists, a port is a finding.
- **Ports without a reason.** A port with one implementation and no test double is a finding only if nothing outside the inside is behind it. A port with a real or in-memory adapter that tests use is justified.
- **Domain modeling.** The domain uses the scenarios' words (Ubiquitous Language). Check for:
  - Primitive obsession on a concept with a rule: `amount: string` that is parsed and validated everywhere, where a value type that is valid by construction would do. Ask for a value object only when the same rule is checked in two or more places or when invalid values can travel.
  - Invalid state that can be represented: a union that allows impossible combinations. Prefer types that make illegal states unrepresentable, and results over thrown exceptions for expected failures.
  - Anemic model: types that only hold fields while every rule lives in a service or a component (Fowler). In functional TypeScript the cure is behavior next to its type, as pure functions in the same module, not classes.
  - Aggregates, repositories, domain events, bounded contexts: do not ask for them until a scenario requires them. An aggregate exists to protect an invariant that spans several objects. If no such invariant is in the scenarios, an aggregate is a finding.
- **Schemas at trust boundaries** (house style): data that crosses in from outside, such as storage or network, is parsed with a schema before it reaches the domain. Component props and internal types do not need one.
- **Direction of change.** Look at the next scenarios in `features/`. If the current structure forces a change in many places to add the next rule (Shotgun Surgery), report it, name the scenario, and show the move that would absorb it.

**The proportion test.** For every layer, port, type or folder you would add, write one sentence naming the current scenario or code that needs it. If you cannot, do not ask for it. This keeps hexagonal and DDD in their role as boundaries around real rules, and out of the role of a ceremony.

### Pass E: Over-engineering and wrong abstraction (Beck's "fewest elements", Fowler's Yagni, Metz, Hickey on simple versus easy)

Pass D asks for separation where a rule leaks. This pass asks for less wherever structure has no current job. Both passes apply together: the right answer is the smallest structure that keeps rules out of the technology.

- **Presumptive features (Yagni).** Code for a case no scenario describes: options, flags, parameters never passed, branches never reached, generic types with one use, configuration, extension points, plugin lists. Name its four costs when it matters: build, delay, carry, repair. Dead branches are caught by coverage: report any uncovered code.
- **Abstraction before the third use.** A helper, hook, component, context, provider, factory, strategy or base type introduced for one or two callers. Report it and suggest inlining unless the abstraction removes duplicated knowledge or separates a real boundary from Pass D.
- **Wrong abstraction (Metz).** A shared function with parameters and conditionals added to serve differing callers. Report the function, list the callers, and recommend inlining it back and re-extracting later. "The fastest way forward is back."
- **Indirection with no payoff.** Wrappers that only forward, a layer that passes data through unchanged, a type that mirrors another type, a one-line function whose name says no more than its body, a class that has one method.
- **Pattern for its own sake.** Redux, reducers, contexts, state machines, dependency injection containers, event buses, CQRS, or a hook library used where `useState` and a pure function would do. A pattern needs a named problem in this code.
- **Folder ceremony.** Directory trees (`domain/`, `application/`, `infrastructure/`, `ports/`) holding one file each. Create a folder when it holds several things that belong together, not before. Keeping rules and adapters apart can be done by file name at first.
- **The three-way test.** For each finding in this pass, state which current test or scenario fails if you delete the code. If none does, it is speculative.

**Under-engineering is a finding too.** Everything crammed into one file, a component that parses, validates, formats and stores, or a function with six reasons to change, is not "simple". Simple means few concepts, not few files. Cross-check each Pass E finding against Pass B and Pass D before you write it down, so you never ask for a removal and an extraction of the same code.

### Pass F: Adversarial probe

For each business rule in the changed code, write one plausible wrong implementation and see if the tests would catch it.

- The rule applies to one of two fields, or on one path only.
- Off-by-one at a boundary.
- The rule works for the example value because it is hard-coded.
- State leaks after a failed attempt: stale error, stale input, partly saved data.
- A refactoring changed behavior and the tests did not notice.

**Verify every mutation by running it, on a scratch copy, never in the working tree.** Do this for each mutation you intend to report as surviving or as caught:

1. Copy the project without heavy or private parts, and link the dependencies:
   `D="$TMPDIR/mutation-check" && rm -rf "$D" && mkdir -p "$D" && rsync -a --exclude node_modules --exclude .git --exclude playwright/.cache --exclude test-results --exclude .claude ./ "$D/" && ln -s "$PWD/node_modules" "$D/node_modules"`
2. Apply one mutation in the copy only, with a small script that asserts the original text is present before replacing it. Do one mutation per run, so a result points at one cause.
3. In the copy, run `npm run test:ct -- <the ct file>`. It needs a local port, so it fails with `listen EPERM` inside the sandbox. That is the sandbox, not a test result: re-run that one command with the sandbox disabled, and never the other commands.
4. Record the result. Any failing test means the mutation is **caught**: name the test and quote the failure line. All tests passing means it **survives**: that is a missing-scenario finding.
5. Start each mutation from a fresh copy. Do not edit the real `src/` or `features/` for any reason, and delete nothing outside `$TMPDIR/mutation-check`.

A survivor you have run is a real finding. A mutation you have not run, because the run was refused or failed for another reason, goes under "Unverified" in the report with the reason, and is never blocking. Report caught mutations briefly under "What I checked", with the test that caught each.

Do not write the missing test yourself.

Reverse check: is there a trivial or hard-coded implementation that satisfies the tests while the real rule is unimplemented? If so, the next change built on it will go wrong, so report it.

## 3. Report

Use this shape. Keep it scannable, and quote exact code.

```
Verdict: APPROVE | REVISE | REJECT
One-line reason.

Blocking (fix before building on this code)
1. [file:line] Rule broken (Pass X). Evidence: `<quoted code>`. Why it matters. Fix: <concrete rewrite or the smallest next move>.

Should fix
...

Nitpicks
...

Too much (over-engineering)
- [file:line] What is speculative, the test that would fail if it were deleted (none), and the simpler form.

Missing structure
- [file:line] The business rule stuck in the adapter, and the smallest move that frees it.

Missing tests (each mutation was run: quote the command result)
- Rule "...": mutation `<exact change>` survived all tests. Suggested scenario: <title>.

Unverified (not run, never blocking)
- <claim>, and why it was not run.

Open questions for the user
- Anything the code assumes that only the user can answer.

What I checked
- Passes A-F run, files read, commands run and their results.
```

Verdict rules:

- **APPROVE**: no blocking findings and no surviving mutation among those you ran. Nitpicks and unverified claims may remain, and you list the unverified ones.
- **REVISE**: blocking findings exist but the change is basically sound. List them so the author can fix and re-run.
- **REJECT**: tests were weakened or coupled to structure, the change altered unrelated behavior, or the design needs redoing. Say what to redo.

Blocking means: a modified test (beyond unskipping), a test coupled to structure, a mutation that you ran and that survived, a failing gate (`tsc`, lint, `vitest`), a business rule in an adapter that the next scenario will need to change, a domain module importing a framework, a mutation of data, an `any` or unjustified assertion, or code that no test demands. Naming and style nits are never blocking, except a name that contradicts the ubiquitous language.

Give each finding a smallest-next-move, not a redesign. A reviewer who says "introduce a domain layer" has not helped. A reviewer who says "move the four checks in `addExpense` to `validateExpense({ name, amount })` in `src/expense.ts`, returning `{ ok: true, expense } | { ok: false, reason }`" has.

No praise and no padding. If a pass found nothing, say so in one line.

## After the review

Hand the report back. The author fixes the blocking findings, as separate refactoring commits with the tests green, and runs this review again on the changed code. Stop re-running once a pass returns no blocking findings. Never fix findings yourself, so that the reviewer stays independent of the writer.
