import { useState, type FormEvent } from 'react'
import './App.css'
import { parseExpense, type Expense } from './expense'

function App() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [expenses, setExpenses] = useState<readonly Expense[]>([])

  const addExpense = (event: FormEvent) => {
    event.preventDefault()
    const result = parseExpense({ name, amount, category })
    if (!result.ok) {
      setError(result.error)
      return
    }
    setExpenses((current) => [...current, result.expense])
    setName('')
    setAmount('')
    setCategory('')
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
          Category
          <input value={category} onChange={(event) => setCategory(event.target.value)} />
        </label>
        <button type="submit">Add</button>
      </form>
      {error && <p>{error}</p>}
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.name} {expense.amount}
            {expense.category !== '' && ` (${expense.category})`}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
