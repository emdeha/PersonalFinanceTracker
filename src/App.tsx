import { useEffect, useState } from "react";
import "./App.css";
import {
  type Expense,
  type Expenses,
  createExpenses,
  addExpense,
} from "./domain/expenses";

function App() {
  const [expenses, setExpenses] = useState<Expenses>(createExpenses());
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data: Expense[]) => setExpenses(createExpenses(data)));
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount: parseFloat(amount) }),
    })
      .then((res) => res.json())
      .then((expense: Expense) => {
        setExpenses((prev) => addExpense(prev, expense));
        setName("");
        setAmount("");
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add expense</button>
      </form>
      {expenses.items.length === 0 ? (
        <p>No expenses</p>
      ) : (
        <ul>
          {expenses.items.map((expense) => (
            <li key={expense.id}>
              <span>{expense.name}</span>
              <span>£{expense.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
