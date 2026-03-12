import express, { type Request, type Response } from "express";
import cors from "cors";
import Database from "better-sqlite3";

type Expense = {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
};

type ValidationError = {
  readonly field: string;
  readonly message: string;
};

type ValidatedExpenseInput = {
  readonly name: string;
  readonly amount: number;
};

type ValidationResult =
  | { readonly valid: true; readonly data: ValidatedExpenseInput }
  | { readonly valid: false; readonly errors: ValidationError[] };

const validateCreateExpense = (
  body: Record<string, unknown>,
): ValidationResult => {
  const errors: ValidationError[] = [];

  const rawName = body["name"];
  const name = typeof rawName === "string" ? rawName.trim() : "";
  if (name.length === 0) {
    errors.push({ field: "name", message: "Name is required" });
  }

  const amount = body["amount"];
  if (typeof amount !== "number" || amount <= 0) {
    errors.push({
      field: "amount",
      message: "Amount must be a positive number",
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: { name, amount: amount as number } };
};

export const createApp = (db: Database.Database) => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount REAL NOT NULL
    )`,
  ).run();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post("/api/expenses", (req: Request, res: Response): void => {
    const result = validateCreateExpense(req.body as Record<string, unknown>);

    if (!result.valid) {
      res.status(422).json({ errors: result.errors });
      return;
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      ...result.data,
    };

    db.prepare(
      "INSERT INTO expenses (id, name, amount) VALUES (?, ?, ?)",
    ).run(expense.id, expense.name, expense.amount);

    res.status(201).json(expense);
  });

  app.get("/api/expenses", (_req: Request, res: Response): void => {
    const expenses = db
      .prepare("SELECT id, name, amount FROM expenses ORDER BY rowid")
      .all() as Expense[];
    res.status(200).json(expenses);
  });

  app.delete("/api/expenses/:id", (req: Request, res: Response): void => {
    const { id } = req.params;
    const expense = db
      .prepare("SELECT id FROM expenses WHERE id = ?")
      .get(id) as Pick<Expense, "id"> | undefined;

    if (!expense) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }

    db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
    res.status(204).send();
  });

  return app;
};
