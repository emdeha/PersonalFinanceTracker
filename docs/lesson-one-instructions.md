# Instructions

1. Instruct Claude to write Gherkin spec - adding an expense by Name and Amount
   1. It'll add it under docs/features -> first improvement to CLAUDE.md
2. Instruct Claude to write Playwright tests based on the Gherkin spec
   1. First it'll create an e2e test. Instruct it to create component tests instead and encode that knowledge in CLAUDE.md
   2. Rewrite the tests to be component-based
   3. Make sure that these tests fail
   4. Make sure that there are no linter/type errors
3. Review the specs by hand
4. Go through the Gherkin scenarios one by one and implement them
    1. In the first scenario it'll probably make other tests pass as well. With the prompt:
        > 'let's implement the first failing test in @src/add-expense.ct.tsx. Mark all others as skipped so our pipeline runs fast'
    2. After you see the test pass, ask it to verify if others pass as well
    3. Encode that in CLAUDE.md as well
    4. After each step, review code
    5. Encode that in a loop
        1. Skill
        2. Agent that uses the skill to preserve context
        3. Hooks that control the loop - when a part of the hook has been implemented, I test it out in a separate claude session by skipping a test that already passes
        4. We start to work in 2 Claude sessions. One implements the code, the other improves our harness
        5. Notice that when "adds multiple expenses" is implemented the hooks might decide not to be called
        6. Notice that the state doesn't get cleaned between agent invocations
5. Continue until all is implemented and observe how well does Claude keep the flow. Add modifications to CLAUDE.md
6. Next step - add category. But before you start it out - encode the BDD workflow into a skill and start using it (steps 1 to 4)
7. Add a Gherkin review agent (based on some good resource on BDD) + a code review agent (based on a good resource on code review). Do the reviews and resolve issues.
    1. Make sure the code reviewer catches a mutation that's an invalid finding and then rewrite the skill (see the saved Claude Code run)
8. Start the category adding after the tests have been written.
	1. In a separate worktree
	2. Talk a bit about Supacode and other similar tools
	3. Until the red-green agent does them, spin up a separate worktree to work on the next functionality
9. Draw the graphs and loops that are resulting from this
10. Once the first is done, show how you'll approach merging the two diverging implementations

# Snapshots

Every recorded session in `sessions/` has a git tag, `snap/NN-...`, on the last commit of that session. Each commit message starts with `[NN session-name]`, so `git log --oneline` reads like the demo script. If a step goes wrong or runs too slow, jump to the snapshot of the previous session and carry on from there.

## Use a snapshot

Tags belong to the repository, not to a branch, so any snapshot can be reached from any branch. `master` is `snap/00-clean-slate`, so a demo started from `master` begins at snapshot 00.

1. Start the demo on a scratch branch and keep `master` untouched: `git switch master`, then `git switch -c demo`
2. List the snapshots: `git tag -l 'snap/*'`
3. Jump the demo to a snapshot, discarding what is on `demo`: `git switch -C demo snap/08-part-1-agent-follows-properly`. Git refuses if uncommitted changes would be overwritten. Add `-f` to discard them.
4. Keep the current attempt and still jump: `git switch -c demo-attempt-1`, then `git switch -C demo snap/08-part-1-agent-follows-properly`
5. Move forward or back in any order: `git switch -C demo snap/03-part-1-first-red-green-loop`. Each tag is a full state of the project.
6. Look without changing anything: `git diff snap/05-part-1-first-red-green-loop-test-1 snap/06-part-1-agent-bypasses-hooks --stat`
7. Keep a second folder at a snapshot while the live demo runs: `git worktree add ../pft-snap08 snap/08-part-1-agent-follows-properly`

Commit or `git stash` demo work before jumping. `-f` and `git reset --hard` discard uncommitted work.

The full history, with every snapshot and merge, is on the `ai-native-workflows-snapshots` branch.

## Which snapshot for which step

| Step | Starting snapshot | State |
|---|---|---|
| 1 | `snap/00-clean-slate` | Empty project |
| 2 | `snap/01-gherkin-spec-for-adding-expense` | Gherkin spec for adding an expense |
| 3 | `snap/02-add-expense-playwright-test-suite` | Failing Playwright component tests |
| 4 | `snap/03-part-1-first-red-green-loop` | First tests green, skill and red-green-implementer agent added |
| 4.5.3 | `snap/04-part-1-first-red-green-loop-test-1` | Hook part 1: loop must start with an unskipped, red test |
| 4.5.3 | `snap/05-part-1-first-red-green-loop-test-1` | Instructions for verifying the hooks |
| 4.5.3 | `snap/06-part-1-agent-bypasses-hooks` | Hooks check green and a failing count after the agent bypassed them |
| 4.5.5 | `snap/07-part-1-agent-reports-but-doesnt-revert` | Hook enforces that only a single test passes |
| 4.5.5 | `snap/08-part-1-agent-follows-properly` | "adds multiple expenses" implemented |
| 5 | `snap/09-part-1-full-loop-until-all-green` | All expense scenarios implemented, session-tracker agent added |
| 6 | `snap/10-part-2-extracting-bdd` | write-bdd-scenarios skill and the category scenarios |
| 7 | `snap/11-part-2-bdd-review-agent` | Adversarial BDD review skill and agent |
| 7 | `snap/12-part-2-code-review-agent` | Code review skill and agent, refactored logic |
| 8 | `snap/13-part-3-add-category-review` | Category review done, sessions updated |
| 8 | `snap/14-part-3-add-category` | Categories implemented (add-category worktree) |
| 8 | `snap/15-part-3-add-type` | Type implemented (add-type worktree) |
| 8 | `snap/16-part-3-add-type-review` | Type refactored after review |
| 10 | `snap/17-part-3-merge-changes` | Both branches merged into `ai-native-workflows-snapshots` |

Snapshots 13 to 16 sit on the parallel add-category and add-type work. Jump to them with `git switch -C demo snap/NN-...` like any other snapshot. Never switch the `add-category` or `add-type` branches themselves, because they are checked out in their own worktrees.

## Backups

- `run-1-backup` holds the history as it was before the commit messages were rewritten. `git reset --hard run-1-backup` restores it.
- The tags are pushed with the branch. If they are missing after a clone, fetch them with `git fetch origin 'refs/tags/snap/*:refs/tags/snap/*'`.
