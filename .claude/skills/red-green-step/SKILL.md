---
name: red-green-step
description: Drive one red-green TDD step on the Playwright component tests in src/*.ct.tsx. Unskip the next test, confirm it fails, write the minimum code to pass it, and prove no other test passes by accident. Use when asked to implement, handle, or make the next test pass.
---

# Red-green step

One acceptance test per step. Only the test chosen for this step may newly pass.

## 1. Choose the test

- Use the test the user names. If none is named, take the first `test.skip` in the file, in file order.
- If "the other test" or similar is ambiguous, say which one you picked.
- Tests finished in earlier steps stay unskipped. Every other test stays `test.skip` so the pipeline stays fast.

## 2. Red

- Change `test.skip(` to `test(` for the chosen test only. Edit with Python or the Edit tool, since BSD `sed -i` needs a backup suffix on macOS.
- Run `npm run test:ct`. The chosen test must fail, and it must fail for the expected reason (missing behavior, not a typo or a mount error). Report the failure reason.
- If it passes already, stop and tell the user. There is nothing to implement.

## 3. Green

- Write the minimum production code that passes the chosen test. No validation, trimming, lists or formatting unless this test demands it.
- Keep to the user's code style in `~/.claude/CLAUDE.md`: no comments, immutable updates, early returns.

## 4. Prove only the chosen test newly passes

- Copy the test file to `src/tmp-all.ct.tsx` with every `test.skip(` replaced by `test(`.
- Run `npm run test:ct -- src/tmp-all.ct.tsx`, then delete the copy.
- Passing tests must be exactly the earlier finished ones plus the chosen one.
- If any other test passes by accident, the implementation does too much. Remove the code that makes it pass, then repeat this step.
- If another test can't be kept red without contradicting the chosen one (for example, "lists expenses in the order they were added" necessarily passes once "adds multiple expenses" passes), do not add contrived code to force it red and do not edit any test. Revert your changes for the step (the unskip and the implementation), then report the chosen test and the coupled tests by name, starting the report with "STEP INCOMPLETE". A human resolves it: reworks the tests, or deletes one that adds no new insight.
- In an agent run, the hooks enforce this check when you hand back or stop, and they revert the step for you. Report the coupling instead of working around it.

## 5. Quality gates

Run all of these, and report any failure instead of hiding it:

- `npm run test:ct` (chosen test plus earlier ones pass, the rest skipped)
- `npx vitest run`
- `npx tsc -b`
- `npm run lint`

Then assess refactoring. Only refactor if it adds value, and never at the cost of making another test pass.

## 6. Report, then commit on request

Report in this shape:

- the failing reason you saw in red
- what code changed
- how many tests pass in the full-file check, and which
- any test that is red only because of a contradiction with the chosen one

Do not commit until the user asks. When they do:

- Commit the `App.tsx` change and the unskip together as `feat: <behavior in plain words>`, ending with the attribution line from the session's system reminder.
- Push with `git push`.
- Don't stage unrelated files, such as docs the user is editing.

## Sandbox notes

- `npm run test:ct` needs to bind a local port and `git push` needs SSH. Both are blocked in the sandbox, so run them with the sandbox disabled.
- Playwright config, timeouts and locator rules live in CLAUDE.md. Don't repeat them here.
