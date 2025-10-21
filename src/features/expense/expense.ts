export interface Expense {
  readonly name: string
  readonly amount: number
}

export interface ExpenseList {
  readonly add: (expense: Expense) => ExpenseList
  readonly getAll: () => readonly Expense[]
}

export function createExpense(name: string, amount: number): Expense {
  if (!name || name.trim() === '') {
    throw new Error('Name is required')
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  return {
    name: name.trim(),
    amount
  }
}

export function createExpenseList(): ExpenseList {
  const expenses: Expense[] = []

  return {
    add(expense: Expense): ExpenseList {
      expenses.push(expense)
      return this
    },

    getAll(): readonly Expense[] {
      return [...expenses]
    }
  }
}