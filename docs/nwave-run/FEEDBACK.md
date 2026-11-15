# Feedback on the nw-dynamic run

Written by the host (Claude Code, Opus 5.5) after the run. Each item says what happened, its effect and a possible fix.

## Problems

### 1. The skill names a schema the installed tool does not ship

- **What:** the skill (both `~/.claude/skills/nw-dynamic/SKILL.md` and the copy in the package, `nWave/tasks/nw/dynamic.md`) says to run `nwstep init --schema dynamic-v11` and that "`dynamic-v11` is a schema name nwstep ships". The installed package ships only `scripts/dev/nwstep/schemas/dynamic-v12.toml`. Its header says "The v11 schema is retired: init refuses its bytes."
- **Effect:** `init` failed. It treated `dynamic-v11` as a relative path and printed a TOML read error for `<project>/dynamic-v11`. The host had to find the schema folder and choose v12 by itself.
- **Fix:** update the skill to `dynamic-v12`. Also, when the `--schema` value is a retired or unknown name, print the shipped names instead of a file-read error.

### 2. The `HOW` command in refusals and packets does not work

- **What:** refusals and the review packet print `.../nwave-ai/bin/python -m nwstep ...`. The reviewer agent ran it and got `No module named nwstep`. The executor prompt's `tool:` line sets `PYTHONPATH=.../scripts/dev/nwstep/src`, which the `HOW` lines leave out.
- **Effect:** someone who follows the printed `HOW` gets a failure. The working entry point is `~/.local/bin/nwstep`.
- **Fix:** print the entry point that is on the PATH, or include the `PYTHONPATH` the prompt uses.

### 3. The executor ran out of turns three times

- **What:** the crafter agent stopped at its 40-turn limit three times and never gave a final report. The host resumed it each time. On the first stop it had written test files but had declared no size and recorded no step.
- **Effect:** more host work, and no executor report. The host built the final summary from `nwstep status`, `brief` and git.
- **Fix:** tell the host to expect resumes. Or ask the executor to record each step as soon as it can and to send a short progress note before a long tool sequence.

### 4. The executor cannot get its own independent review

- **What:** in every size, selfreview needs an `independent_review` item from a reviewer other than the executor. The executor agent has no tool to start another agent. The skill does not say who starts that reviewer.
- **Effect:** the run stopped at selfreview until the host started `nw-software-crafter-reviewer`, sent the findings back to the executor and gave it the `REV1` line.
- **Fix:** add a host step to the skill. When status shows selfreview pending, run `packet`, start the reviewer and relay its `REV` line. Or let the prompt tell the executor to stop and ask the host.

### 5. The workspace location conflicts with sandboxed hosts

- **What:** the skill requires the workspace under `$HOME/.cache/nwave/nwstep-runs/`. The Claude Code sandbox allows writes only in the project and temp folders, so `mkdir`, `init`, `prompt`, `status`, `packet` and `verdict` all failed with `Operation not permitted`.
- **Effect:** the host ran each `nwstep` command outside the sandbox, with the person's approval. The reviewer agent could not record its verdict (`.lock` permission error). The host recorded it for the reviewer, after the person agreed.
- **Fix:** allow a configured workspace root such as `$TMPDIR`, or document the sandbox allowance a host needs.

### 6. Any untracked file blocks a verdict

- **What:** after the review, the host added an untracked `.claude/launch.json` (a dev-server config, not part of the change). `verdict` refused, because the candidate became a `tree:` digest. The host moved the file aside, recorded the verdict, then put the file back.
- **Effect:** correct, but surprising. A local tool file can block the verdict for a commit that is otherwise clean.
- **Fix:** document this. Or let the candidate identity come from `HEAD` when every tracked file is unchanged, with a warning that untracked files exist.

### 7. Design documents were left uncommitted

- **What:** the executor generated `docs/record-expense/` with `brief` but did not commit it. Handoff still went through, and the candidate stayed a `tree:` identity.
- **Fix:** refuse handoff, or warn, when generated documents are untracked. Or let the executor commit them as part of handoff.

## What worked well

- The RED-before-GREEN commits and the oracle's byte check worked. The reviewer could show that no test was weakened between commits.
- The independent review found real gaps: a degenerate property generator, three refusals no test covered, and a precision bug with large amounts. All were fixed and checked again with mutation probes.
- A verdict holds for one identity only, and the tool enforced that. It stopped a verdict from being applied to a different tree.
- The size gate (M) removed model, probe, refactor and examine, which fit a change of this scope.

## Open items

- The reviewer reported F7 (LOW): there is no test at the exact boundary of the largest accepted amount (`90071992547409.91` accepted, `.92` refused). The code is correct; only the test is missing.
- Nobody ran the Cypress routing test; it needs a browser.
- Jev was not available (`TYPESAFE_API_KEY` not set). One attempt by the reviewer was blocked by the host's permission system.
