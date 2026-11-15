# nwstep decisions

kit: 3136d8ff64b46f92076ab9374de051a2a8db966dcdc5b460d9bec9bfa2edd282 commit: none

## oracle (revision 2)

- **decisions**:
  - DEC1: The request states no sad path and the owner is absent, so I decided a blank expense name refuses the entry, records nothing and reports the problem; this decision adds promise P3.
  - DEC2: Likewise an amount that is not a positive number of money with at most two decimals refuses the entry, leaves what is already recorded unchanged and reports the problem; this decision adds promise P4.
  - DEC3: An amount is kept as whole cents and shown with two decimals, so '1200' is listed as '1200.00', and no currency symbol is shown because the request names no currency.
  - DEC4: The entry form and the list are added beside the kept Home text on the existing page, so src/App.test.tsx and cypress/e2e/routing.cy.ts keep passing unchanged.
  - DEC5: Expenses live only in the running page; nothing is stored beyond it, because the request asks for no storage. The stated limit is that a reload starts again from 0 expenses.
  - DEC6: Expenses are listed in the order they were entered, because the request states no order and the order entered is the only one the user can predict.
  - DEC7: Test names use the mandate form of driving port plus a snake_case outcome, because nwstep matches a reported test by its last whitespace-separated segment and a prose name would be matched by its last word alone.
  - DEC8: Jev was asked for the four open scope questions of this step and answered nothing, so each was decided locally and recorded here; typesafe: unavailable: TYPESAFE_API_KEY is not set in this process, the client exited 3.
  - DEC9: An amount is refused when it needs more cents than can be held exactly, and the message names the largest recordable amount. The independent review showed '99999999999999999999.99' being listed as '100000000000000000000.00', so cents are now computed and shown as exact integers and the range is a stated bound, not a silent rounding; this decision adds promise P5.
  - DEC10: The independent review found four declared refusals with no test that could fail on them, because the property picked the same refusal in all 8 runs. The refusal is now chosen by the run number, so every declared branch runs, and each of those refusals also gained its own scenario at the page.

## design (revision 3)

- **reuse_decision**: Reused: the page src/App.tsx and its Home text, React state for the running page, and the repository's own vitest, jsdom and Testing Library setup, which the tests drive unchanged. Created new: every domain, application and user interface file listed in the owners, because the repository holds no domain code at all - src/App.tsx renders one word, and no committed module owns a money value, a name rule, a list of records or a refusal message, so no existing owner could be extended. Nothing new is generalised beyond the one caller that needs it: there is one entry form, one ledger and one use case.
- **prefactoring_reason**: The only committed file the change touches is src/App.tsx, which renders the single word Home. It holds no rule to move, no primitive standing in for a domain value, no duplication and no decision that belongs on an owner, so there is nothing to prepare before the feature. Everything the feature needs is new code in new files, and the existing Home text stays exactly as it is, which keeps src/App.test.tsx and cypress/e2e/routing.cy.ts passing unchanged.
