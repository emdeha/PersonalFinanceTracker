# Personal Finance Tracker

## Gherkin specs

- Store all Gherkin `.feature` files in the root `features/` directory, not under `docs/`.
- Name files in kebab-case after the feature, e.g. `features/add-expense.feature`.

## Playwright component tests

- Write acceptance tests as Playwright component tests (`@playwright/experimental-ct-react`), mounting `<App />` with `mount`. Do not spin up the dev server for them.
- Name files `*.ct.tsx` and keep them in `src/`. Never use `*.test.*` or `*.spec.*`, which Vitest would pick up.
- Run them with `npm run test:ct` (config: `playwright-ct.config.ts`).
- Keep `@playwright/test` pinned to the exact version of `@playwright/experimental-ct-react` (currently 1.62.1). A mismatch breaks the browser lookup.
- Keep timeouts tight (test 5s, expect 2s, action 2s) so failing tests fail fast. Raise them only for a test that genuinely needs longer.
- Derive one test per scenario in `features/*.feature`; a Scenario Outline becomes one test per Examples row.
- Locate elements by label, role and visible text (`getByLabel`, `getByRole`, `getByText`), never by CSS class or test id. The form must expose the labels "Name" and "Amount", an "Add" button, expense rows as `listitem`, and validation errors as visible text.
- Install the browser once with `npx playwright install chromium`. If `~/.npm` has permission errors, pass `--cache "$TMPDIR/npm-cache"` to npm.

## One test at a time

- Work on a single acceptance test per step. Mark every other test in the file `test.skip` so the pipeline stays fast.
- Write the minimum production code for the chosen test, and no more. Only that test may pass. Any other test that passes by accident means the implementation is doing too much, so remove the code that makes it pass.
- Check this by temporarily running a copy of the file with `test.skip(` replaced by `test(`, then delete the copy. Only the chosen test should pass.
- If a test can't be made to fail without contradicting the chosen one (e.g. "keeps entered values" vs "clears the fields"), note it and leave it skipped. Don't add contrived code to force it red.
