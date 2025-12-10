import { useState } from 'react'
import './App.css'

type Expense = {
  readonly name: string
  readonly amount: number
}

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

  const handleRemoveExpense = (indexToRemove: number) => {
    setExpenses(expenses.filter((_, index) => index !== indexToRemove))
    setErrorMessage('')
  }

  return (
    <div>
      <h1>Personal Finance Tracker</h1>

      <div>
        <input
          data-testid="expense-name-input"
          type="text"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          placeholder="Expense name"
        />

        <input
          data-testid="expense-amount-input"
          type="number"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          placeholder="Amount"
        />

        <button
          data-testid="add-expense-button"
          onClick={handleAddExpense}
        >
          Add Expense
        </button>
      </div>

      {errorMessage && (
        <div data-testid="error-message">
          {errorMessage}
        </div>
      )}

      <div data-testid="expense-list">
        {expenses.length === 0 ? (
          <div>No expenses added yet</div>
        ) : (
          expenses.map((expense, index) => (
            <div key={index}>
              <span>{expense.name}: {expense.amount.toFixed(2)}</span>
              <button
                data-testid="remove-expense-button"
                onClick={() => handleRemoveExpense(index)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
