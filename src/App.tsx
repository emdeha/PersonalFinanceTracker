import { useState, useEffect } from "react";
import "./App.css";

type Expense = {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
};

type FormErrors = {
  readonly name: boolean;
  readonly amount: boolean;
};

const formatAmount = (amount: number): string => `£${amount.toFixed(2)}`;

const isValidName = (name: string): boolean => name.trim().length > 0;

const isValidAmount = (amount: string): boolean => {
  const parsed = parseFloat(amount);
  return !isNaN(parsed) && parsed > 0;
};

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<FormErrors>({
    name: false,
    amount: false,
  });

  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data: Expense[]) => setExpenses(data));
  }, []);

  const handleSubmit = () => {
    const nameError = !isValidName(name);
    const amountError = !isValidAmount(amount);

    if (nameError || amountError) {
      setErrors({ name: nameError, amount: amountError });
      return;
    }

    fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), amount: parseFloat(amount) }),
    })
      .then((res) => res.json())
      .then((expense: Expense) => {
        setExpenses((prev) => [...prev, expense]);
        setName("");
        setAmount("");
        setErrors({ name: false, amount: false });
      });
  };

  const removeExpense = (id: string) => {
    fetch(`/api/expenses/${id}`, { method: "DELETE" }).then(() => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name ? "true" : undefined}
        />
      </div>
      <div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-invalid={errors.amount ? "true" : undefined}
        />
      </div>
      <button onClick={handleSubmit}>Add expense</button>
      {expenses.length === 0 ? (
        <p>No expenses</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <span>{expense.name}</span>
              <span>{formatAmount(expense.amount)}</span>
              <button
                onClick={() => removeExpense(expense.id)}
                aria-label={`Remove ${expense.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
