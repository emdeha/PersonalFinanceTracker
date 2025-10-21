import React, { useState } from 'react'
import { createExpense, createExpenseList, ExpenseList } from '../features/expense/expense'

export function ExpenseTracker() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [expenses, setExpenses] = useState<ExpenseList>(createExpenseList())
  const [nameError, setNameError] = useState('')
  const [amountError, setAmountError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setNameError('')
    setAmountError('')

    try {
      const expense = createExpense(name, Number(amount))
      const updatedExpenses = expenses.add(expense)
      setExpenses(updatedExpenses)

      // Clear form
      setName('')
      setAmount('')
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Name')) {
          setNameError(error.message)
        }
        if (error.message.includes('Amount')) {
          setAmountError(error.message)
        }
      }
    }
  }

  const expenseList = expenses.getAll()

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            data-cy="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Expense name"
          />
          {nameError && (
            <div data-cy="name-error" style={{ color: 'red' }}>
              {nameError}
            </div>
          )}
        </div>

        <div>
          <input
            data-cy="amount-input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            step="0.01"
          />
          {amountError && (
            <div data-cy="amount-error" style={{ color: 'red' }}>
              {amountError}
            </div>
          )}
        </div>

        <button data-cy="add-expense-button" type="submit">
          Add Expense
        </button>
      </form>

      <table data-cy="expense-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenseList.map((expense: { name: string; amount: number }, index) => (
            <tr key={index} data-cy="expense-row">
              <td data-cy="expense-name">{expense.name}</td>
              <td data-cy="expense-amount">{expense.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}