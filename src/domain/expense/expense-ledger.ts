import type { Expense } from './expense.ts';

export type ExpenseLedger = {
  readonly expenses: readonly Expense[];
};

export const emptyLedger: ExpenseLedger = { expenses: [] };

export const addExpense = ({
  ledger,
  expense,
}: {
  readonly ledger: ExpenseLedger;
  readonly expense: Expense;
}): ExpenseLedger => ({ expenses: [...ledger.expenses, expense] });
