# nwstep summary

kit: 3136d8ff64b46f92076ab9374de051a2a8db966dcdc5b460d9bec9bfa2edd282 commit: none

## Request coverage

- S1: implement adding an expense by name and amount
  - promises: P1, P2
  - tests P1: show_the_expense_with_its_name_and_amount_when_it_is_added
  - tests P2: show_every_added_expense_in_the_order_entered_for_any_entries

## Edge matrix

- I1.empty: the name and the amount are both left blank and Add expense is selected => nothing is recorded, the list still holds 0 expenses, and 2 problems are reported in one pass, one per blank field | self-probe: not probed | pre-feature not probed
- I1.unknown: n/a (challenge this): the form has two fields and one button and takes no identifier, code or selector from the user, so there is nothing unknown it could be given
- I1.malformed: the amount is 'abc', '-5', '0', '1.234' or '99999999999999999999.99' with the name 'Coffee', or the name is 3 spaces => nothing is recorded and 1 problem names the refused value and what an accepted one looks like; each of these cases is driven by its own scenario at the page | self-probe: not probed | pre-feature not probed
- I1.dependency-gone: n/a (challenge this): the form reaches no service, file, network or clock; it records into the state of the running page only
- I1.repeated: 'Coffee' with '4.50' is added twice => both are recorded and the list holds 2 expenses with the same name and amount | self-probe: not probed | pre-feature not probed
- I1.concurrent: n/a (challenge this): one user drives one form in one page, and a second writer of this state cannot be reached from the public port
- I1.crash: n/a (challenge this): nothing is written outside the running page, so no half-written record can exist; after a reload the page starts again from 0 expenses
- I2.empty: the page is opened and nothing has been added => the list is present and holds 0 expenses, which a test tells apart from the list being absent altogether | self-probe: not probed | pre-feature not probed
- I2.unknown: n/a (challenge this): the list shows the expenses recorded in this page and takes no query, filter or identifier from the user
- I2.malformed: n/a (challenge this): only values the entry form has already accepted reach the list, so a malformed name or amount cannot appear in a row
- I2.dependency-gone: n/a (challenge this): the list reads the state of the running page only and has no other source to lose
- I2.repeated: the same name and amount are recorded twice => 2 rows are shown, one per recorded expense, and neither hides the other | self-probe: not probed | pre-feature not probed
- I2.concurrent: n/a (challenge this): one user reads one page; no second writer can change the list while it is read
- I2.crash: n/a (challenge this): nothing is persisted, so there is no partial state to show; after a reload the list holds 0 expenses, which is the stated limit of DEC5

## Definition of done

- SC1 (P1): not-held (no held self-probe case)
  - GIVEN the expense tracker page is opened and 0 expenses have been added to it
  - WHEN the user looks at the list of recorded expenses
  - THEN the list is there and holds 0 expenses, which differs from no list at all
  - test: start_with_no_recorded_expenses_before_anything_is_added
- SC2 (P1): not-held (no held self-probe case)
  - GIVEN 0 expenses are recorded
  - WHEN the user enters the name 'Coffee' and the amount '4.50' and selects Add expense
  - THEN the list holds 1 expense, 'Coffee' with the amount '4.50'
  - test: show_the_expense_with_its_name_and_amount_when_it_is_added
- SC3 (P2): not-held (no held self-probe case)
  - GIVEN the user has recorded 'Coffee' for '4.50'
  - WHEN the user enters the name 'Rent' and the amount '1200' and selects Add expense
  - THEN the list holds 2 expenses in the order entered, 'Coffee' with '4.50' then 'Rent' with '1200.00'
  - test: show_every_expense_when_several_are_added_one_after_another
- SC4 (P2): not-held (no held self-probe case)
  - GIVEN 0 expenses are recorded
  - WHEN the user enters 'Coffee' with '4.50' and selects Add expense twice
  - THEN the list holds 2 expenses, both 'Coffee' with the amount '4.50'
  - test: record_both_when_the_same_name_and_amount_are_added_twice
- SC5 (P3): not-held (no held self-probe case)
  - GIVEN 0 expenses are recorded
  - WHEN the user leaves the name blank, enters the amount '4.50' and selects Add expense
  - THEN the list still holds 0 expenses and 1 problem names the name and the example 'Coffee'
  - test: refuse_the_entry_and_record_nothing_when_the_name_is_blank
- SC6 (P4): not-held (no held self-probe case)
  - GIVEN 0 expenses are recorded
  - WHEN the user enters the name 'Coffee' with the amount 'abc' and selects Add expense
  - THEN the list still holds 0 expenses and 1 problem names 'abc' and the example amount '4.50'
  - test: refuse_the_entry_and_record_nothing_when_the_amount_is_not_a_number
- SC7 (P3): not-held (no held self-probe case)
  - GIVEN 0 expenses are recorded
  - WHEN the user leaves the name blank, enters the amount '-5' and selects Add expense
  - THEN the list still holds 0 expenses and 2 problems are shown in one pass, one for the name and one for the amount
  - test: report_both_problems_in_one_pass_when_the_name_and_the_amount_are_invalid
- SC8 (P4): not-held (no held self-probe case)
  - GIVEN the user has recorded 'Coffee' for '4.50', so the list holds 1 expense
  - WHEN the user enters the name 'Rent' with the amount 'free' and selects Add expense
  - THEN the list still holds exactly that 1 expense, 'Coffee' with '4.50', and 1 problem names 'free'
  - test: keep_the_expenses_already_recorded_when_a_later_entry_is_refused
- SC9 (P3): not-held (no held self-probe case)
  - GIVEN 0 expenses are recorded
  - WHEN the user types 3 spaces as the name, enters the amount '4.50' and selects Add expense
  - THEN the list still holds 0 expenses and 1 problem names the name and the example 'Coffee'
  - test: refuse_the_entry_and_record_nothing_when_the_name_is_only_spaces
- SC10 (P4): not-held (no held self-probe case)
  - GIVEN 0 expenses are recorded
  - WHEN the user enters the name 'Coffee' with the amount '0' and selects Add expense
  - THEN the list still holds 0 expenses and 1 problem names '0' and the example amount '4.50'
  - test: refuse_the_entry_and_record_nothing_when_the_amount_is_zero
- SC11 (P4): not-held (no held self-probe case)
  - GIVEN 0 expenses are recorded
  - WHEN the user enters the name 'Coffee' with the amount '1.234' and selects Add expense
  - THEN the list still holds 0 expenses and 1 problem names '1.234' and the example amount '4.50'
  - test: refuse_the_entry_and_record_nothing_when_the_amount_has_more_than_two_decimals
- SC12 (P5): not-held (no held self-probe case)
  - GIVEN 0 expenses are recorded
  - WHEN the user enters the name 'Mansion' with the amount '99999999999999999999.99' and selects Add expense
  - THEN the list still holds 0 expenses and 1 problem names that amount and the largest recordable amount '90071992547409.91'
  - test: refuse_the_entry_and_record_nothing_when_the_amount_is_beyond_the_largest_one_recordable
- SC13 (P1): not-held (no held self-probe case)
  - GIVEN the user entered 'Rent' with the amount 'free' and was told of 1 problem
  - WHEN the user enters 'Rent' with the amount '1200.00' and selects Add expense
  - THEN the list holds that 1 expense and 0 problems are reported
  - test: stop_reporting_the_problem_once_the_corrected_entry_is_recorded

## Questions for the owner

- none

## Observed side effects (git, BASE to HEAD)

- M .gitignore (+2 -0 lines)
- M src/App.tsx (+2 -0 lines)
- A src/application/expense-entry.ts (+36 -0 lines)
- A src/domain/expense/entry-problem.ts (+11 -0 lines)
- A src/domain/expense/expense-amount.ts (+52 -0 lines)
- A src/domain/expense/expense-draft.ts (+6 -0 lines)
- A src/domain/expense/expense-ledger.ts (+15 -0 lines)
- A src/domain/expense/expense-name.ts (+24 -0 lines)
- A src/domain/expense/expense.ts (+21 -0 lines)
- A src/domain/result.ts (+26 -0 lines)
- A src/record-expense.properties.test.tsx (+112 -0 lines)
- A src/record-expense.steps.tsx (+92 -0 lines)
- A src/record-expense.test.tsx (+136 -0 lines)
- A src/ui/expense-entry-form.tsx (+75 -0 lines)
- A src/ui/expense-tracker.tsx (+29 -0 lines)
- A src/ui/recorded-expenses.tsx (+29 -0 lines)

## Commits (git log, BASE to HEAD)

- 087a3b9 test: state adding an expense by name and amount through the page (RED)
- 70fefd1 feat: record an expense by its name and its amount (GREEN)
- 4330caa test: give every declared refusal an executable falsifier (RED)
- 12ae950 fix: refuse an amount beyond the one the tracker can record exactly (GREEN)

## Review

- candidate frozen: tree:3d09bdd5743815536bcec8cfcf07b3c11316b23627323fe142f61c540d313a6c (recorded 2026-11-15T11:50:34+00:00)

## 5. oracle: Frame the work and write the oracle (revision 2)

- **request**:
  - /Users/tsvetan/.cache/nwave/nwstep-runs/expense-entry-20261115-132356/request.md
- **promises**:
  - P1: The user records an expense by entering its name and its amount, and sees that expense listed with the name and the amount entered.
  - P2: The user records several expenses one after another and sees every one of them listed, in the order entered.
  - P3: An entry whose name is blank is refused, nothing is recorded, and the user is told what name to enter.
  - P4: An entry whose amount is not a positive amount of money is refused, nothing already recorded changes, and the user is told what amount to enter.
  - P5: An amount beyond the largest one the tracker can record exactly is refused, nothing is recorded, and the user is told the largest amount that can be recorded.
- **sentence_map**:
  - S1 => P1,P2
- **scenarios**:
  - SC1 | P1 | GIVEN the expense tracker page is opened and 0 expenses have been added to it | WHEN the user looks at the list of recorded expenses | THEN the list is there and holds 0 expenses, which differs from no list at all
  - SC2 | P1 | GIVEN 0 expenses are recorded | WHEN the user enters the name 'Coffee' and the amount '4.50' and selects Add expense | THEN the list holds 1 expense, 'Coffee' with the amount '4.50'
  - SC3 | P2 | GIVEN the user has recorded 'Coffee' for '4.50' | WHEN the user enters the name 'Rent' and the amount '1200' and selects Add expense | THEN the list holds 2 expenses in the order entered, 'Coffee' with '4.50' then 'Rent' with '1200.00'
  - SC4 | P2 | GIVEN 0 expenses are recorded | WHEN the user enters 'Coffee' with '4.50' and selects Add expense twice | THEN the list holds 2 expenses, both 'Coffee' with the amount '4.50'
  - SC5 | P3 | GIVEN 0 expenses are recorded | WHEN the user leaves the name blank, enters the amount '4.50' and selects Add expense | THEN the list still holds 0 expenses and 1 problem names the name and the example 'Coffee'
  - SC6 | P4 | GIVEN 0 expenses are recorded | WHEN the user enters the name 'Coffee' with the amount 'abc' and selects Add expense | THEN the list still holds 0 expenses and 1 problem names 'abc' and the example amount '4.50'
  - SC7 | P3 | GIVEN 0 expenses are recorded | WHEN the user leaves the name blank, enters the amount '-5' and selects Add expense | THEN the list still holds 0 expenses and 2 problems are shown in one pass, one for the name and one for the amount
  - SC8 | P4 | GIVEN the user has recorded 'Coffee' for '4.50', so the list holds 1 expense | WHEN the user enters the name 'Rent' with the amount 'free' and selects Add expense | THEN the list still holds exactly that 1 expense, 'Coffee' with '4.50', and 1 problem names 'free'
  - SC9 | P3 | GIVEN 0 expenses are recorded | WHEN the user types 3 spaces as the name, enters the amount '4.50' and selects Add expense | THEN the list still holds 0 expenses and 1 problem names the name and the example 'Coffee'
  - SC10 | P4 | GIVEN 0 expenses are recorded | WHEN the user enters the name 'Coffee' with the amount '0' and selects Add expense | THEN the list still holds 0 expenses and 1 problem names '0' and the example amount '4.50'
  - SC11 | P4 | GIVEN 0 expenses are recorded | WHEN the user enters the name 'Coffee' with the amount '1.234' and selects Add expense | THEN the list still holds 0 expenses and 1 problem names '1.234' and the example amount '4.50'
  - SC12 | P5 | GIVEN 0 expenses are recorded | WHEN the user enters the name 'Mansion' with the amount '99999999999999999999.99' and selects Add expense | THEN the list still holds 0 expenses and 1 problem names that amount and the largest recordable amount '90071992547409.91'
  - SC13 | P1 | GIVEN the user entered 'Rent' with the amount 'free' and was told of 1 problem | WHEN the user enters 'Rent' with the amount '1200.00' and selects Add expense | THEN the list holds that 1 expense and 0 problems are reported
- **conflicts**:
  - S1 | NONE | Read the committed behaviour only for contradictions: src/App.tsx renders the single word Home, src/App.test.tsx asserts that text is on the page and cypress/e2e/routing.cy.ts asserts the page at / contains Home. Nothing committed names an expense, a name field, an amount or a list, and the entry form is added beside the kept Home text, so no behaviour the system already has is contradicted by this sentence.
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
- **mapping**:
  - P1 => show_the_expense_with_its_name_and_amount_when_it_is_added
  - P2 => show_every_added_expense_in_the_order_entered_for_any_entries
  - P3 => refuse_the_entry_and_record_nothing_when_the_name_is_blank
  - P4 => refuse_the_entry_and_record_nothing_when_the_amount_is_not_a_number
  - P5 => refuse_the_entry_and_record_nothing_when_the_amount_is_beyond_the_largest_one_recordable
- **covers_scenarios**:
  - SC1 => start_with_no_recorded_expenses_before_anything_is_added
  - SC2 => show_the_expense_with_its_name_and_amount_when_it_is_added
  - SC3 => show_every_expense_when_several_are_added_one_after_another
  - SC4 => record_both_when_the_same_name_and_amount_are_added_twice
  - SC5 => refuse_the_entry_and_record_nothing_when_the_name_is_blank
  - SC6 => refuse_the_entry_and_record_nothing_when_the_amount_is_not_a_number
  - SC7 => report_both_problems_in_one_pass_when_the_name_and_the_amount_are_invalid
  - SC8 => keep_the_expenses_already_recorded_when_a_later_entry_is_refused
  - SC9 => refuse_the_entry_and_record_nothing_when_the_name_is_only_spaces
  - SC10 => refuse_the_entry_and_record_nothing_when_the_amount_is_zero
  - SC11 => refuse_the_entry_and_record_nothing_when_the_amount_has_more_than_two_decimals
  - SC12 => refuse_the_entry_and_record_nothing_when_the_amount_is_beyond_the_largest_one_recordable
  - SC13 => stop_reporting_the_problem_once_the_corrected_entry_is_recorded
- **interfaces**:
  - I1: The expense entry form on the page: the Expense name field, the Amount field and the Add expense button, with the problems it reports.
  - I2: The list of recorded expenses shown on the page, one row per expense with its name and its amount.
- **matrix**:
  - I1.empty => the name and the amount are both left blank and Add expense is selected => nothing is recorded, the list still holds 0 expenses, and 2 problems are reported in one pass, one per blank field
  - I1.unknown => n/a: the form has two fields and one button and takes no identifier, code or selector from the user, so there is nothing unknown it could be given
  - I1.malformed => the amount is 'abc', '-5', '0', '1.234' or '99999999999999999999.99' with the name 'Coffee', or the name is 3 spaces => nothing is recorded and 1 problem names the refused value and what an accepted one looks like; each of these cases is driven by its own scenario at the page
  - I1.dependency-gone => n/a: the form reaches no service, file, network or clock; it records into the state of the running page only
  - I1.repeated => 'Coffee' with '4.50' is added twice => both are recorded and the list holds 2 expenses with the same name and amount
  - I1.concurrent => n/a: one user drives one form in one page, and a second writer of this state cannot be reached from the public port
  - I1.crash => n/a: nothing is written outside the running page, so no half-written record can exist; after a reload the page starts again from 0 expenses
  - I2.empty => the page is opened and nothing has been added => the list is present and holds 0 expenses, which a test tells apart from the list being absent altogether
  - I2.unknown => n/a: the list shows the expenses recorded in this page and takes no query, filter or identifier from the user
  - I2.malformed => n/a: only values the entry form has already accepted reach the list, so a malformed name or amount cannot appear in a row
  - I2.dependency-gone => n/a: the list reads the state of the running page only and has no other source to lose
  - I2.repeated => the same name and amount are recorded twice => 2 rows are shown, one per recorded expense, and neither hides the other
  - I2.concurrent => n/a: one user reads one page; no second writer can change the list while it is read
  - I2.crash => n/a: nothing is persisted, so there is no partial state to show; after a reload the list holds 0 expenses, which is the stated limit of DEC5
- **laws**:
  - LAW1 | Every accepted entry is listed with the name and the amount the user entered, in the order entered. | generator=show_every_added_expense_in_the_order_entered_for_any_entries | observation=the rows of the recorded expense list read through the page compared with the generated entries, name and amount, in order | mutant=keeping only the last entry, dropping the amount, or listing the entries in reverse makes the rows differ from the generated entries
    - LAW1: could-not-verify: no tool can check, in any language, that the generator 'show_every_added_expense_in_the_order_entered_for_any_entries' generates inputs; the law is recorded as stated, and the review judges it
  - LAW2 | A refused entry leaves the expenses already recorded exactly as they were, and tells the user that it was refused, for every one of the 8 declared refusals. | generator=keep_the_recorded_expenses_unchanged_for_any_refused_entry | observation=the rows of the list after a generated refused entry compared with the accepted entries, and the number of problems reported, with the refusal chosen by the run so that all 8 declared refusals are driven | mutant=recording the refused entry anyway, clearing the list on refusal, refusing it silently with no problem reported, or accepting any one of the 8 refused forms
    - LAW2: could-not-verify: no tool can check, in any language, that the generator 'keep_the_recorded_expenses_unchanged_for_any_refused_entry' generates inputs; the law is recorded as stated, and the review judges it
- **messages**:
  - MSG1 | the name is left blank and the amount is '4.50' | the expense has no name | an expense is listed under its name, so one without a name cannot be told from another | type a name for the expense, such as 'Coffee' | test=refuse_the_entry_and_record_nothing_when_the_name_is_blank
  - MSG2 | the name is 'Coffee' and the amount is 'abc' | 'abc' is not an amount | an expense records how much was spent, so the amount has to be a positive number of money | type the amount as a positive number with at most two decimals, such as '4.50' | test=refuse_the_entry_and_record_nothing_when_the_amount_is_not_a_number
  - MSG3 | the name is 'Mansion' and the amount is '99999999999999999999.99' | that amount is more than this tracker can record | an amount is kept as an exact whole number of cents, and this one needs more cents than can be held exactly, so it would be recorded as a different amount | type an amount of at most 90071992547409.91 | test=refuse_the_entry_and_record_nothing_when_the_amount_is_beyond_the_largest_one_recordable
- **tests**:
  - src/record-expense.test.tsx
  - src/record-expense.properties.test.tsx
  - src/record-expense.steps.tsx
- **red**: `bash -c 'mkdir -p reports && ln -sfn /Users/tsvetan/Projects/webinars/oct-2026-ai-fundamentals/PersonalFinanceTracker/.claude/worktrees/nw-dynamic-expense-entry-557a3f/node_modules node_modules && ./node_modules/.bin/vitest run --reporter=junit --outputFile=reports/red.xml'` exited 1 in 0.983s
  - failing on the pre-feature tree (14): ExpenseTrackerShould > show_the_expense_with_its_name_and_amount_when_it_is_added, ExpenseTrackerShould > show_every_added_expense_in_the_order_entered_for_any_entries, ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_name_is_blank, ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_amount_is_not_a_number, ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_amount_is_beyond_the_largest_one_recordable, ExpenseTrackerShould > start_with_no_recorded_expenses_before_anything_is_added, ExpenseTrackerShould > show_every_expense_when_several_are_added_one_after_another, ExpenseTrackerShould > record_both_when_the_same_name_and_amount_are_added_twice, ExpenseTrackerShould > report_both_problems_in_one_pass_when_the_name_and_the_amount_are_invalid, ExpenseTrackerShould > keep_the_expenses_already_recorded_when_a_later_entry_is_refused, ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_name_is_only_spaces, ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_amount_is_zero, ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_amount_has_more_than_two_decimals, ExpenseTrackerShould > stop_reporting_the_problem_once_the_corrected_entry_is_recorded
  - tests (read from the run): 0 errors, 15 failures, 1 passed, 0 skipped, 16 tests in 0.12s
  - slowest: 0.08s call ExpenseTrackerShould > start_with_no_recorded_expenses_before_anything_is_added
  - slowest: 0.02s call ExpenseTrackerShould > show_every_added_expense_in_the_order_entered_for_any_entries
  - slowest: 0.01s call App > renders Home
  - slowest: 0.00s call ExpenseTrackerShould > show_the_expense_with_its_name_and_amount_when_it_is_added
  - slowest: 0.00s call ExpenseTrackerShould > keep_the_recorded_expenses_unchanged_for_any_refused_entry
  - slowest: 0.00s call ExpenseTrackerShould > show_every_expense_when_several_are_added_one_after_another
  - slowest: 0.00s call ExpenseTrackerShould > record_both_when_the_same_name_and_amount_are_added_twice
  - slowest: 0.00s call ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_name_is_blank
  - slowest: 0.00s call ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_amount_is_beyond_the_largest_one_recordable
  - slowest: 0.00s call ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_name_is_only_spaces
  ```text
  JUNIT report written to /Users/tsvetan/.cache/nwave/nwstep-runs/expense-entry-20261115-132356/red-tree/reports/red.xml
  ```
- **red_bound**: 600
- **results**:
  - reports/red.xml

## 6. design: Find the owners and design the change (revision 3)

- **owners**:
  - what a valid expense name is => new: src/domain/expense/expense-name.ts, because no committed file holds any domain rule; src/App.tsx only renders the word Home
  - what a valid amount of money is and how it is shown => new: src/domain/expense/expense-amount.ts
  - what an expense is, a name together with an amount => new: src/domain/expense/expense.ts
  - what the user typed before it is an expense => new: src/domain/expense/expense-draft.ts
  - how a refusal says what failed, why it matters and how to fix it => new: src/domain/expense/entry-problem.ts
  - which expenses are recorded and in which order => new: src/domain/expense/expense-ledger.ts
  - the two outcomes of any step, a value or a reason => new: src/domain/result.ts
  - the entry in progress: the recorded expenses, what the user has typed and the problems last reported, and the two moves that change it => new: src/application/expense-entry.ts
  - holding the recorded expenses of the running page and driving the use case => new: src/ui/expense-tracker.tsx
  - the entry fields, the Add expense button and the problems shown => new: src/ui/expense-entry-form.tsx
  - showing the recorded expenses, one row per expense => new: src/ui/recorded-expenses.tsx
  - the page the user opens => src/App.tsx, the existing owner, which keeps its Home text and composes the expense tracker beside it
- **reuse_decision**: Reused: the page src/App.tsx and its Home text, React state for the running page, and the repository's own vitest, jsdom and Testing Library setup, which the tests drive unchanged. Created new: every domain, application and user interface file listed in the owners, because the repository holds no domain code at all - src/App.tsx renders one word, and no committed module owns a money value, a name rule, a list of records or a refusal message, so no existing owner could be extended. Nothing new is generalised beyond the one caller that needs it: there is one entry form, one ledger and one use case.
- **paradigm**: fp
- **boundaries**:
  - The driving boundary, the browser page: owned by src/ui/expense-tracker.tsx and the two components it composes. Raw strings the user typed stop here; they cross into the domain only through the smart constructors, and domain values come back as text to render.
  - The domain boundary, src/domain/expense and src/domain/result.ts: pure values and total functions only. It imports no React, no DOM, no storage, no clock and no randomness, and it is the only place a rule about a name or an amount is decided.
  - The application boundary, src/application/expense-entry.ts: owns the entry in progress as one value and the two pure moves over it, typing and submitting; it owns no rule about a name or an amount and renders nothing, so the page holds one state and no glue decision.
  - No driven port is crossed: nothing is stored, fetched, timed or randomised, so the change has no adapter on the driven side (decision DEC5 of the oracle).
- **domain_types**:
  - Result<TValue, TReason>: a sum type of accepted with a value, or refused with a reason; the single shape every refusal in this change travels in (src/domain/result.ts).
  - ExpenseName: an opaque name built only by its smart constructor, which refuses text that is blank once trimmed (src/domain/expense/expense-name.ts).
  - ExpenseAmount: an opaque whole number of cents greater than zero, built from the text the user typed and shown with two decimals; it is never a bare number in the domain (src/domain/expense/expense-amount.ts).
  - ExpenseDraft: the pair of raw strings the user typed, the only primitive-carrying type the domain accepts, and only at its smart constructor (src/domain/expense/expense-draft.ts).
  - Expense: a name together with an amount, built only from a draft that both fields accepted (src/domain/expense/expense.ts).
  - ExpenseEntry: the entry in progress - the ledger, the draft and the problems last reported - changed only by the two pure moves of src/application/expense-entry.ts (src/application/expense-entry.ts).
  - ExpenseLedger: the expenses recorded so far, in the order entered; adding returns a new ledger and never changes the old one (src/domain/expense/expense-ledger.ts).
  - EntryProblem: the field it refused, and what failed, why it matters and how to fix it as three separate parts, so no refusal can be built that leaves one of the three out (src/domain/expense/entry-problem.ts).
- **invariants**:
  - INV1 | An expense name is never blank: no value of ExpenseName can be built from text that is empty once trimmed. | witness=src/domain/expense/expense-name.ts:expenseName | bypass=a cast to the branded type inside its own module would build one; no exported path does, and the type is opaque to every other module
  - INV2 | An expense amount is always a whole number of cents greater than zero, so no expense carries a negative, a zero or a fractional cent amount. | witness=src/domain/expense/expense-amount.ts:expenseAmount | bypass=a cast to the branded type inside its own module would build one; no exported path does
  - INV3 | A refused entry yields no new ledger at all: submitting returns the entry with the same ledger value it already held, so the recorded expenses cannot change on a refusal. | witness=src/application/expense-entry.ts:recorded | bypass=none
  - INV4 | The name and the amount are checked independently, so one entry reports every problem it has in one pass, never only the first. | witness=src/domain/expense/expense.ts:expenseFrom | bypass=none
  - INV5 | The recorded expenses are immutable: adding an expense returns a new ledger and the value held before the call still lists exactly what it listed. | witness=src/domain/expense/expense-ledger.ts:addExpense | bypass=none
- **prefactoring**: no
- **prefactoring_reason**: The only committed file the change touches is src/App.tsx, which renders the single word Home. It holds no rule to move, no primitive standing in for a domain value, no duplication and no decision that belongs on an owner, so there is nothing to prepare before the feature. Everything the feature needs is new code in new files, and the existing Home text stays exactly as it is, which keeps src/App.test.tsx and cypress/e2e/routing.cy.ts passing unchanged.

## 7. craft: Craft the change (revision 2)

- **green**: `bash -c 'test -e node_modules || ln -sfn /Users/tsvetan/Projects/webinars/oct-2026-ai-fundamentals/PersonalFinanceTracker/.claude/worktrees/nw-dynamic-expense-entry-557a3f/node_modules node_modules; mkdir -p reports; ./node_modules/.bin/vitest run --reporter=junit --outputFile=reports/green.xml'` exited 0 in 4.901s
  - tests (read from the run): 0 errors, 0 failures, 16 passed, 0 skipped, 16 tests in 5.19s
  - slowest: 2.82s call ExpenseTrackerShould > keep_the_recorded_expenses_unchanged_for_any_refused_entry
  - slowest: 1.27s call ExpenseTrackerShould > show_every_added_expense_in_the_order_entered_for_any_entries
  - slowest: 0.13s call ExpenseTrackerShould > show_every_expense_when_several_are_added_one_after_another
  - slowest: 0.12s call ExpenseTrackerShould > keep_the_expenses_already_recorded_when_a_later_entry_is_refused
  - slowest: 0.12s call ExpenseTrackerShould > record_both_when_the_same_name_and_amount_are_added_twice
  - slowest: 0.11s call ExpenseTrackerShould > stop_reporting_the_problem_once_the_corrected_entry_is_recorded
  - slowest: 0.10s call ExpenseTrackerShould > show_the_expense_with_its_name_and_amount_when_it_is_added
  - slowest: 0.10s call ExpenseTrackerShould > start_with_no_recorded_expenses_before_anything_is_added
  - slowest: 0.07s call ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_amount_is_beyond_the_largest_one_recordable
  - slowest: 0.06s call ExpenseTrackerShould > refuse_the_entry_and_record_nothing_when_the_amount_is_zero
  ```text
  JUNIT report written to /Users/tsvetan/Projects/webinars/oct-2026-ai-fundamentals/PersonalFinanceTracker/.claude/worktrees/nw-dynamic-expense-entry-557a3f/reports/green.xml
  ```
- **green_bound**: 600
- **results**:
  - reports/green.xml
- **scorecard**: `bash -c 'test -e node_modules || ln -sfn /Users/tsvetan/Projects/webinars/oct-2026-ai-fundamentals/PersonalFinanceTracker/.claude/worktrees/nw-dynamic-expense-entry-557a3f/node_modules node_modules; ./node_modules/.bin/tsc -b --force && ./node_modules/.bin/eslint .'` exited 0 in 1.716s
- **scorecard_bound**: 600
- **typesafe**: unavailable: TYPESAFE_API_KEY is not set in this process, so the client refused to send the four open scope questions of the oracle step and exited 3; each was decided locally and recorded as DEC1 to DEC6.

## 9. selfreview: Self-review (revision 2)

- **answers**:
  - D1: pass - the committed files are exactly the owners of design revision 3: domain in src/domain, the one use case in src/application/expense-entry.ts, the page in src/ui, and src/App.tsx keeps its Home text as decision DEC4 states.
  - D2: pass - each rule has one owner: what an amount is lives only in src/domain/expense/expense-amount.ts, what a name is only in expense-name.ts, and the order of the recorded expenses only in expense-ledger.ts; no second place decides any of them.
  - D3: pass - dependencies point inward only: grep shows no import of react, react-dom or the DOM in src/domain or src/application, and the domain imports nothing from src/ui or src/application.
  - D4: pass - src/domain/expense/expense-name.ts:4 and src/domain/expense/expense-amount.ts:5 are opaque branded types built only by their smart constructors, so a blank name, a zero amount and an amount beyond the exact cent range cannot be carried by an Expense at all; the only primitives are the two strings of ExpenseDraft at the boundary.
  - D5: pass - every unit is small, total and single-purpose on the functional track: src/application/expense-entry.ts:26 recorded() is one expression with one reason to change, the largest changed file is the form adapter at 75 lines and the largest domain file is 52 lines, each holding one type and its own rule.
  - D6: pass - smart constructor plus a Result sum type, and nothing more; no framework, factory or extension point was added for a single caller.
  - D7: pass - the names are the ones the user uses: Expense, ExpenseName, ExpenseAmount, ExpenseLedger, ExpenseDraft, EntryProblem, and the two moves of the entry in progress, drafted and recorded.
  - D8: n/a: the change has no infrastructure at all - nothing is stored, fetched, timed or randomised (DEC5), so there is no adapter that could leak into the domain.
  - D9: pass - src/record-expense.steps.tsx:25 renders the real App and every stimulus goes through the label, the button and the table the user sees; no test imports a domain or application module.
  - D10: pass - each test name reads as one sentence of the user's outcome, such as refuse_the_entry_and_record_nothing_when_the_amount_is_zero, and the only production name in them is the driving port in ExpenseTrackerShould.
  - D11: pass - one shared steps file, src/record-expense.steps.tsx, is called by both test files; the step DSL is not re-implemented per test and each test builds its own context.
  - D12: fixed: src/record-expense.properties.test.tsx:87 now takes the refusal from the run instead of the seed. The review showed the seed selector was degenerate, so all 8 runs drove the same refusal; probes PB9 to PB12 now fail the property as well as the example for a whitespace-only name, a zero amount, a third decimal and an amount beyond the largest.
  - D13: pass - measured, not guessed: the added files ran 9 times out of 9 green, median 5.01s and slowest 5.55s for the pair of files; the slowest single test is the refusal property at 2.94s and the slowest example is 0.13s. Every test is integration level, driving real React DOM through the page, so the seconds budget applies and no test claims the 10 ms unit budget.
  - D14: pass - each test states a distinct observation: no two share a stimulus and an assertion pair, and neither property repeats a finite example, since the examples pin named values and the properties pin the two laws over generated sequences.
  - D15: pass - src/domain/expense/entry-problem.ts:3 makes what, why and how three separate required parts, so no refusal can be built that leaves one out, and src/record-expense.steps.tsx:65 words every assertion failure as what failed, why it matters and how to fix it; probe PB8 showed the tests fail when the how is dropped.
  - D16: pass - no model for this change: there is no second actor over the same state, no multi-step protocol, no retry, no crash or restart window, since nothing is persisted (DEC5), and no liveness claim. quint is installed at /opt/homebrew/bin/quint, so the decision is not a tool limitation. The two stated laws are checked instead by generated properties over multi-entry sequences at the real page; that samples 8 accepted sequences and 16 refusal runs and is evidence, not exhaustive proof.
  - D17: fixed: the design record named src/application/record-expense.ts for INV3 while the code uses src/application/expense-entry.ts, so design was recorded again before craft and the witness now matches the code; SUMMARY.md prints every revision in order, so the superseded revision 1 text stays visible as history and the latest revision is the one in force. The documents are generated by brief from these records, never hand written, and are regenerated after this record and committed.
- **independent_review**:
  - REV1 | reviewer=nw-software-crafter-reviewer | findings=Implementation is correct on every behaviour I could exercise and tests/lint/types all pass, but four declared behaviours have no executable falsifier (the LAW2 property generator is degenerate and picks the same refusal in all 8 runs; zero amount, excess decimals and whitespace-only name are unexercised - mutations that break them survive the full suite), and the shipped LAW1 is falsifiable through the page at large amounts: 99999999999999999999.99 is accepted and listed as 100000000000000000000.00. Cypress routing.cy.ts was not run, as it needs a browser. | resolution=All findings corrected at their source and re-verified. F1: the refusal is now chosen by the run number, not the seed, and the declared refusals grew from 5 to 8. F2, F3, F4: amount 0, amount 1.234 and a name of 3 spaces each gained a scenario at the page. F5: cents are computed and shown as exact integers with no floating point, and an amount needing more cents than can be held exactly is refused with the largest recordable amount named. F6: a scenario now states that the problem stops being reported once the corrected entry is recorded. Probes PB9 to PB13 confirm each of the five mutations the review named now fails the suite; no test was weakened and no production code removed. The stale INV3 witness path was corrected in design revision 2 and the documents are committed.

## 11. handoff: Hand off (revision 2)

- **summary** (sentences the diff backs):
  - The page the user opens now takes an expense name and an amount and lists the expense with the name and the amount entered, as show_the_expense_with_its_name_and_amount_when_it_is_added states, and lists every expense recorded so far in the order entered, as show_every_added_expense_in_the_order_entered_for_any_entries states over generated sequences.
  - A name that is blank or only spaces is refused with nothing recorded, as refuse_the_entry_and_record_nothing_when_the_name_is_blank and refuse_the_entry_and_record_nothing_when_the_name_is_only_spaces state.
  - An amount that is not a positive number with at most two decimals is refused, as refuse_the_entry_and_record_nothing_when_the_amount_is_not_a_number, refuse_the_entry_and_record_nothing_when_the_amount_is_zero and refuse_the_entry_and_record_nothing_when_the_amount_has_more_than_two_decimals state, and an amount needing more cents than can be held exactly is refused with the largest recordable amount named, as refuse_the_entry_and_record_nothing_when_the_amount_is_beyond_the_largest_one_recordable states.
  - A refused entry leaves what is already recorded untouched, as keep_the_expenses_already_recorded_when_a_later_entry_is_refused and keep_the_recorded_expenses_unchanged_for_any_refused_entry state, and the problem stops being reported once the corrected entry is recorded, as stop_reporting_the_problem_once_the_corrected_entry_is_recorded states.
  - Everything was driven through the page the user sees: the oracle failed on the pre-feature tree before any code existed, and the tool ran the suite, the types and the lint itself.
  - What is not verified is listed below, and nothing is stored beyond the running page.
- **not_verified**:
  - The Cypress end to end suite, cypress/e2e/routing.cy.ts, was not run, because it needs a browser and a dev server; the page text it asserts, Home, is unchanged and is still asserted by src/App.test.tsx in the suite that did run.
  - No formal model was written. The two laws are checked by generated properties over 8 accepted sequences and 16 refusal runs at the real page, which is evidence over sampled sequences and not an exhaustive proof; quint is installed, so this is a decision and not a tool limit.
  - The amount range was checked at its two stated edges only, the largest recordable amount and one value beyond it; no test walks the cents between them.
  - Nothing is stored beyond the running page, and nothing about storage, reload, concurrency or crash was verified; that a reload starts again from no expenses is a stated limit, not a tested one.
  - No measurement of how the page behaves with many recorded expenses was taken; the largest list any test builds holds 4 expenses.
  - The accessibility links the form sets, aria-invalid and aria-describedby, are not observed by any test; only the label, the button, the table and the alert role are.
  - The generated properties sample seeded sequences rather than shrink; the repository has no property based testing library, so a failing case is replayed from the seed printed in the failure message instead of being shrunk to a minimal one.
- **pre-review receipt** (run by the tool when this record was written):
  - candidate: commit 12ae950ae60f7b9b1fba515f8b289656f81d7089 with uncommitted changes
  - no checks declared

## Not backed by the diff

- The name and the amount are checked independently, so one entry reports both problems in one pass, as report_both_problems_in_one_pass_when_the_name_and_the_amount_are_invalid states, and each problem says what failed, why it matters and how to fix it.: a guarantee names no test of the change
- The page keeps the Home text it had, which the unchanged src/App.test.tsx still asserts.: a guarantee names no test of the change
- The rules live in the domain as opaque types built only by their smart constructors, the one use case composes them, and the page is the only place raw strings exist.: a guarantee names no test of the change
- An independent review rejected the first candidate for four declared refusals that no test could fail on and for an amount above 2^53 cents being listed as a different amount; each was corrected at its source, and each of the five mutations the review named was re-injected and fails the suite.: a guarantee names no test of the change
