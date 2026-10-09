import { useState, type FormEvent } from 'react'
import './App.css'

type Expense = { readonly name: string; readonly amount: string }

function App() {
  return <Home />
}

function Home() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [expenses, setExpenses] = useState<readonly Expense[]>([])

  const addExpense = (event: FormEvent) => {
    event.preventDefault()
    if (name.trim() === '') {
      setError('Name is required')
      return
    }
    if (amount === '') {
      setError('Amount is required')
      return
    }
    if (Number.isNaN(Number(amount))) {
      setError('Amount must be a number')
      return
    }
    if (Number(amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    setExpenses((current) => [...current, { name: name.trim(), amount }])
    setName('')
    setAmount('')
    setError('')
  }

  return (
    <>
      <div>Home</div>
      <form onSubmit={addExpense}>
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          Amount
          <input value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <button type="submit">Add</button>
      </form>
      {error && <p>{error}</p>}
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            {expense.name} {expense.amount}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
