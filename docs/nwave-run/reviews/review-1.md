# Review 1 — REJECT

Reviewer: `nw-software-crafter-reviewer`. Candidate: commits `30a58fc..70fefd1` plus untracked `docs/record-expense/` (`tree:3d09bdd5…`). No verdict recorded (candidate was not a commit).

```
REV1 | reviewer=nw-software-crafter-reviewer | findings=Implementation is correct on every behaviour I could exercise and tests/lint/types all pass, but four declared behaviours have no executable falsifier (the LAW2 property generator is degenerate and picks the same refusal in all 8 runs; zero amount, excess decimals and whitespace-only name are unexercised — mutations that break them survive the full suite), and the shipped LAW1 is falsifiable through the page at large amounts: "99999999999999999999.99" is accepted and listed as "100000000000000000000.00" | resolution=Oracle owner must fix the degenerate refusal selector so all five declared refusal branches run, and add page-level stimuli for amount = 0 and for an excess-decimal amount (both named in matrix I1.malformed) and for a whitespace-only name (design INV1); implementation owner must refuse an amount beyond the exactly representable cent range in expenseAmount with a WHAT/WHY/HOW message, or parse cents without float arithmetic. No production code needs removing and no test may be weakened.
```

## Verification run by the reviewer (HEAD 70fefd1)

| argv | exit | result |
| --- | --- | --- |
| `npx vitest run` | 0 | 3 files, 11 tests passed |
| `npm run lint` | 0 | no findings |
| `npx tsc -b` | 0 | empty |

Oracle files byte-identical to the recorded RED tree; the GREEN commit touches no test path.

## Mutation probes (isolated copy)

| Mutation | Result |
| --- | --- |
| ledger prepends instead of appends | KILLED |
| `cents === 0` check disabled | **SURVIVED** |
| regex allows a leading `-` | KILLED |
| regex allows unlimited decimals | **SURVIVED** |
| name `trim()` removed | **SURVIVED** |
| only the first problem reported | KILLED |
| amount rendered as raw cents | KILLED |
| `recorded` records nothing | KILLED |
| problems kept after a later success | **SURVIVED** |
| draft not cleared after recording | SURVIVED (not a declared promise) |

## Findings

- **F1 (oracle, HIGH)** `src/record-expense.properties.test.tsx:84-86`: `pick(seed, 5)` over the LCG `seed*1664525 + 1013904223` is degenerate (1664525 ≡ 0 mod 5); all 8 runs pick the same refusal.
- **F2 (oracle, HIGH)** no stimulus for an amount of exactly zero.
- **F3 (oracle, MEDIUM)** no stimulus for an excess-decimal amount (`1.234`).
- **F4 (oracle, MEDIUM)** no stimulus for a whitespace-only name.
- **F5 (implementation, MEDIUM)** `src/domain/expense/expense-amount.ts:19-22`: `Number(whole) * 100` loses precision above 2^53 cents; `Mansion` / `99999999999999999999.99` is listed as `100000000000000000000.00`.
- **F6 (oracle, LOW)** clearing problems after a later accepted entry is untested.
- Doc: `DECISIONS.md` INV3 witness cited the rev 1 path `src/application/record-expense.ts`.

## Limits

Cypress `cypress/e2e/routing.cy.ts` not run (needs a browser). Jev unavailable (`TYPESAFE_API_KEY` absent; one attempt denied by the host permission system).
