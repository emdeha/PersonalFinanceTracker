import { useState, type FormEvent } from 'react'
import './App.css'
import { parseExpense, type Expense, type ExpenseType } from './expense'

function App() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<ExpenseType>('Expense')
  const [error, setError] = useState('')
  const [expenses, setExpenses] = useState<readonly Expense[]>([])

  const addExpense = (event: FormEvent) => {
    event.preventDefault()
    const result = parseExpense({ name, amount, type })
    if (!result.ok) {
      setError(result.error)
      return
    }
    setExpenses((current) => [...current, result.expense])
    setName('')
    setAmount('')
    setType('Expense')
    setError('')
  }

  return (
    <>
      <form onSubmit={addExpense}>
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Amount
          <input value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label>
          Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value === 'Income' ? 'Income' : 'Expense')}
          >
            <option>Expense</option>
            <option>Income</option>
          </select>
        </label>
        <button type="submit">Add</button>
      </form>
      {error && <p>{error}</p>}
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.name} {expense.amount} {expense.type}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
