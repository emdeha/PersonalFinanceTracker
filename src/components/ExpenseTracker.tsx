import React, { useState, useRef } from 'react'
import type { FormEvent } from 'react'

interface Expense {
  id: string
  name: string
  amount: string
}

interface FormData {
  name: string
  amount: string
}

export const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [formData, setFormData] = useState<FormData>({ name: '', amount: '' })
  const [error, setError] = useState<string>('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  const validateForm = (): string => {
    const { name, amount } = formData

    if (!name.trim() && !amount.trim()) {
      return 'Both expense name and amount are required'
    }

    if (!name.trim()) {
      return 'Expense name is required'
    }

    if (!amount.trim()) {
      return 'Amount is required'
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return 'Please enter a valid amount'
    }

    return ''
  }

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      amount: formData.amount
    }

    setExpenses(prevExpenses => [...prevExpenses, newExpense])
    setFormData({ name: '', amount: '' })
    setError('')

    nameInputRef.current?.focus()
  }

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (error) {
      setError('')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Expense Tracker</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="expense-name">Expense Name</label>
          <input
            id="expense-name"
            ref={nameInputRef}
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            aria-label="Expense Name"
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="text"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            aria-label="Amount"
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {error && (
          <div style={{
            color: 'red',
            marginBottom: '15px',
            padding: '8px',
            border: '1px solid red',
            borderRadius: '4px',
            backgroundColor: '#ffebee'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          role="button"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </form>

      <table role="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{expense.name}</td>
              <td style={{ padding: '12px' }}>{expense.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {expenses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No expenses added yet. Add your first expense above!
        </div>
      )}
    </div>
  )
}