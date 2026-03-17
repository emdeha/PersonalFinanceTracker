import { useEffect, useState } from "react";
import "./App.css";

type Expense = {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
};

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data: Expense[]) => setExpenses(data));
  }, []);

  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id}>
          <span>{expense.name}</span>
          <span>£{expense.amount.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
}

export default App;
