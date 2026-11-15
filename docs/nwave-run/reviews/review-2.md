# Review 2 — ACCEPT

Reviewer: `nw-software-crafter-reviewer`. Candidate: `commit:d81677514e86aa3c11cdc7b68ecce6383bef2ac4`.

The verdict was recorded by the host under the reviewer's id: the reviewer's own `nwstep verdict` failed because its sandbox could not write the workspace lock under `~/.cache`. The person approved recording it on the reviewer's behalf.

```
REV2 | reviewer=nw-software-crafter-reviewer | findings=All six findings closed and verified by rerun mutation probes on a fresh copy of d816775: zero guard, excess-decimal regex, name trim, problems-cleared-after-success and the beyond-largest guard are now all KILLED, the LAW2 refusal selector is exhaustive (run % 8 over 16 runs, all eight declared refusals exercised), 4330caa is honest RED before 12ae950 GREEN and removes no assertion, and 16/16 tests, eslint and tsc -b all pass; one new LOW advisory remains, the refusal threshold's own boundary is untested so an off-by-one (>= instead of >) survives | resolution=none needed to accept - the implementation is correct at the boundary (verified through the page: 90071992547409.91 is accepted and listed exactly, 90071992547409.92 is refused with the full message), so the single open item is an oracle-owned LOW advisory to add a boundary pair, not a blocker
```

## Finding status

| # | Finding | Owner | Status | Evidence |
| --- | --- | --- | --- | --- |
| F1 | LAW2 selector degenerate | oracle | CLOSED | `REFUSALS[run % REFUSALS.length]` over 16 runs; all eight refusals exercised twice |
| F2 | zero amount | oracle | CLOSED | new scenario; mutation `cents === 0n → -1n` KILLED |
| F3 | excess decimals | oracle | CLOSED | new scenario; regex widening KILLED |
| F4 | whitespace-only name | oracle | CLOSED | new scenario; `.trim()` removal KILLED |
| F5 | large-amount precision | implementation | CLOSED | exact `bigint` cents; guard removal KILLED; raised threshold KILLED |
| F6 | stale problem after success | oracle | CLOSED | new scenario; mutation KILLED |

## Verification (clean tree, HEAD d816775)

| argv | exit | result |
| --- | --- | --- |
| `npx vitest run` | 0 | 3 files, 16 tests passed |
| `npm run lint` | 0 | no findings |
| `npx tsc -b --force` | 0 | empty |

## RED before GREEN

- `git archive 4330caa` in a clean copy: `vitest run` exit 1, 2 failed / 14 passed (the beyond-largest scenario and the LAW2 property). The other four new scenarios pass at RED because they cover behaviour the code already had right.
- `12ae950` touches only `src/domain/expense/expense-amount.ts`; `d816775` only `docs/record-expense/`.
- Test diff `70fefd1..d816775` is +59 / -2; the two removed lines were replaced by stronger ones.

## New finding (open, LOW)

**F7 (oracle)** `src/domain/expense/expense-amount.ts:46`: no boundary test for the refusal threshold, so `>=` instead of `>` survives. The product is correct at the boundary. Remedy: one boundary pair (largest accepted, one cent over refused).

## Limits

Cypress routing test not run. Jev unavailable.
