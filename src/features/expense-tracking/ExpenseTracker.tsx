import { useState } from "react";
import {
  createExpense,
  addExpenseToList,
  type Expense,
} from "./domain/expense-tracking";

type ExpenseTrackerProps = Record<string, never>;

export const ExpenseTracker = (_props: ExpenseTrackerProps) => {
  const [expenses, setExpenses] = useState<readonly Expense[]>([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    setErrorMessage(null);

    const input = {
      name: expenseName,
      amount: expenseAmount,
    };

    const result = createExpense(input);

    if (result.success) {
      setExpenses(addExpenseToList(expenses, result.data));
      setExpenseName("");
      setExpenseAmount("");
    } else {
      setErrorMessage(result.errors[0]);
    }
  };

  return (
    <div>
      <div>
        <input
          data-testid="expense-name-input"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          type="text"
          placeholder="Expense name"
        />
        <input
          data-testid="expense-amount-input"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          type="text"
          placeholder="Amount"
        />
        <button data-testid="add-expense-button" onClick={handleSubmit}>
          Add Expense
        </button>
      </div>

      {errorMessage && <div data-testid="error-message">{errorMessage}</div>}

      {expenses.length > 0 && (
        <ul data-testid="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id} data-testid="expense-item">
              {expense.name} - {expense.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
