import { useState } from 'react'
import styles from './App.module.css'
import { ExpenseHeader } from './components/ExpenseHeader/ExpenseHeader'
import { ExpenseForm } from './components/ExpenseForm/ExpenseForm'
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage'
import { ExpenseList } from './components/ExpenseList/ExpenseList'
import type { Expense } from './types/expense.types'

function App() {
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

  const handleAddExpense = (options: { name: string; amount: string }) => {
    const nameError = validateExpenseName(options.name)
    if (nameError) {
      setErrorMessage(nameError)
      return
    }

    const amountError = validateExpenseAmount(options.amount)
    if (amountError) {
      setErrorMessage(amountError)
      return
    }

    const newExpense: Expense = {
      name: options.name,
      amount: parseFloat(options.amount),
    }

    setExpenses([...expenses, newExpense])
    setErrorMessage('')
  }

  return (
    <div className={styles.container}>
      <ExpenseHeader title="Personal Finance Tracker" />

      <ExpenseForm onAddExpense={handleAddExpense} />

      {errorMessage && (
        <ErrorMessage message={errorMessage} testId="error-message" />
      )}

      <ExpenseList expenses={expenses} testId="expense-list" />
    </div>
  )
}

export default App
