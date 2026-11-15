import { accepted, reasonsIn, refused, type Result } from '../result.ts';
import type { EntryProblem } from './entry-problem.ts';
import type { ExpenseDraft } from './expense-draft.ts';
import { expenseAmount, type ExpenseAmount } from './expense-amount.ts';
import { expenseName, type ExpenseName } from './expense-name.ts';

export type Expense = {
  readonly name: ExpenseName;
  readonly amount: ExpenseAmount;
};

export const expenseFrom = (
  draft: ExpenseDraft,
): Result<Expense, readonly EntryProblem[]> => {
  const name = expenseName(draft.name);
  const amount = expenseAmount(draft.amount);

  return name.ok && amount.ok
    ? accepted({ name: name.value, amount: amount.value })
    : refused(reasonsIn([name, amount]));
};
