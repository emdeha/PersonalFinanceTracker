import { describe, it, expect } from 'vitest'
import { createExpense, createExpenseList } from './expense'

describe('Expense', () => {
  it('should create an expense with valid name and amount', () => {
    const expense = createExpense('Coffee', 4.50)

    expect(expense.name).toBe('Coffee')
    expect(expense.amount).toBe(4.50)
  })

  it('should list expenses when they are added', () => {
    const expenseList = createExpenseList()

    const coffee = createExpense('Coffee', 4.50)
    const lunch = createExpense('Lunch', 12.75)

    expenseList.add(coffee)
    expenseList.add(lunch)

    const expenses = expenseList.getAll()

    expect(expenses).toHaveLength(2)
    expect(expenses[0].name).toBe('Coffee')
    expect(expenses[0].amount).toBe(4.50)
    expect(expenses[1].name).toBe('Lunch')
    expect(expenses[1].amount).toBe(12.75)
  })

  it('should return empty list when no expenses added', () => {
    const expenseList = createExpenseList()

    const expenses = expenseList.getAll()

    expect(expenses).toHaveLength(0)
  })

  it('should throw error when creating expense with empty name', () => {
    expect(() => createExpense('', 4.50))
      .toThrow('Name is required')
  })

  it('should throw error when creating expense with zero amount', () => {
    expect(() => createExpense('Coffee', 0))
      .toThrow('Amount must be greater than 0')
  })

  it('should throw error when creating expense with negative amount', () => {
    expect(() => createExpense('Coffee', -5))
      .toThrow('Amount must be greater than 0')
  })
})