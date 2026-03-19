export type Expense = {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
};

export type Expenses = {
  readonly items: readonly Expense[];
};

export const createExpenses = (initial: readonly Expense[] = []): Expenses => ({
  items: initial,
});

export const addExpense = (expenses: Expenses, expense: Expense): Expenses => ({
  items: [...expenses.items, expense],
});
