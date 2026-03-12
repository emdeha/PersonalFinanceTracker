import express, { type Request, type Response } from "express";
import cors from "cors";

type Expense = {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
};

type ValidationError = {
  readonly field: string;
  readonly message: string;
};

let expenses: Expense[] = [];

export const resetExpenseStore = (): void => {
  expenses = [];
};

const validateCreateExpense = (
  body: Record<string, unknown>,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const name = body["name"];
  if (name === undefined || name === null || String(name).trim().length === 0) {
    errors.push({ field: "name", message: "Name is required" });
  }

  const amount = body["amount"];
  if (
    amount === undefined ||
    amount === null ||
    typeof amount !== "number" ||
    amount <= 0
  ) {
    errors.push({
      field: "amount",
      message: "Amount must be a positive number",
    });
  }

  return errors;
};

export const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/expenses", (req: Request, res: Response): void => {
  const errors = validateCreateExpense(req.body as Record<string, unknown>);

  if (errors.length > 0) {
    res.status(422).json({ errors });
    return;
  }

  const expense: Expense = {
    id: crypto.randomUUID(),
    name: String(req.body.name).trim(),
    amount: req.body.amount as number,
  };

  expenses = [...expenses, expense];

  res.status(201).json(expense);
});
