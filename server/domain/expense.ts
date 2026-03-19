export type Expense = {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
};

export interface ExpenseRepository {
  getAll(): Expense[];
  create(expense: Expense): Expense;
}
