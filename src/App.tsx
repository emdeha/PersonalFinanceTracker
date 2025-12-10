import { useState } from 'react'
import './App.css'
import { Button } from './components/Button/Button'
import { Input } from './components/Input/Input'
import { ExpenseHeader } from './components/ExpenseHeader/ExpenseHeader'
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage'
import { ExpenseList } from './components/ExpenseList/ExpenseList'
import type { Expense } from './types/expense.types'

function App() {
  const [expenseName, setExpenseName] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  const validateExpenseName = (name: string): string | null => {
    if (name.trim() === '') {
      return 'Expense name is required'
    }
    return null
  }

  const validateExpenseAmount = (amount: string): string | null => {
    if (amount.trim() === '') {
      return 'Amount is required'
    }

    const numericAmount = parseFloat(amount)
    if (numericAmount <= 0) {
      return 'Amount must be greater than zero'
    }

    return null
  }

  const handleAddExpense = () => {
    const nameError = validateExpenseName(expenseName)
    if (nameError) {
      setErrorMessage(nameError)
      return
    }

    const amountError = validateExpenseAmount(expenseAmount)
    if (amountError) {
      setErrorMessage(amountError)
      return
    }

    const newExpense: Expense = {
      name: expenseName,
      amount: parseFloat(expenseAmount),
    }

    setExpenses([...expenses, newExpense])
    setExpenseName('')
    setExpenseAmount('')
    setErrorMessage('')
  }

  return (
    <div>
      <ExpenseHeader title="Personal Finance Tracker" />

      <div>
        <Input
          testId="expense-name-input"
          type="text"
          value={expenseName}
          onChange={setExpenseName}
          placeholder="Expense name"
        />

        <Input
          testId="expense-amount-input"
          type="number"
          value={expenseAmount}
          onChange={setExpenseAmount}
          placeholder="Amount"
        />

        <Button testId="add-expense-button" onClick={handleAddExpense}>
          Add Expense
        </Button>
      </div>

      {errorMessage && (
        <ErrorMessage message={errorMessage} testId="error-message" />
      )}

      <ExpenseList expenses={expenses} testId="expense-list" />
    </div>
  )
}

export default App
