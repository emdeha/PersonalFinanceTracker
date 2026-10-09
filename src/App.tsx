import { useState, type FormEvent } from 'react'
import './App.css'

type Expense = { readonly name: string; readonly amount: string }

function App() {
  return <Home />
}

function Home() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [expenses, setExpenses] = useState<readonly Expense[]>([])

  const addExpense = (event: FormEvent) => {
    event.preventDefault()
    setExpenses((current) => [...current, { name, amount }])
    setName('')
    setAmount('')
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
