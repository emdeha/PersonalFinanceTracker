import type { EntryProblem } from '../domain/expense/entry-problem.ts';
import { blankDraft, type ExpenseDraft } from '../domain/expense/expense-draft.ts';
import { addExpense, emptyLedger, type ExpenseLedger } from '../domain/expense/expense-ledger.ts';
import { expenseFrom } from '../domain/expense/expense.ts';

export type ExpenseEntry = {
  readonly ledger: ExpenseLedger;
  readonly draft: ExpenseDraft;
  readonly problems: readonly EntryProblem[];
};

export const newExpenseEntry: ExpenseEntry = {
  ledger: emptyLedger,
  draft: blankDraft,
  problems: [],
};

export const drafted = ({
  entry,
  draft,
}: {
  readonly entry: ExpenseEntry;
  readonly draft: ExpenseDraft;
}): ExpenseEntry => ({ ...entry, draft });

export const recorded = (entry: ExpenseEntry): ExpenseEntry => {
  const expense = expenseFrom(entry.draft);

  return expense.ok
    ? {
        ledger: addExpense({ ledger: entry.ledger, expense: expense.value }),
        draft: blankDraft,
        problems: [],
      }
    : { ...entry, problems: expense.reason };
};
