import { useState, type FormEvent } from 'react'
import './App.css'

type Expense = { readonly name: string; readonly amount: string }

function App() {
  return <Home />
}

function Home() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [expense, setExpense] = useState<Expense | null>(null)

  const addExpense = (event: FormEvent) => {
    event.preventDefault()
    setExpense({ name, amount })
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
        {expense && (
          <li>
            {expense.name} {Number(expense.amount)}
          </li>
        )}
      </ul>
    </>
  )
}

export default App
