import express from "express";
import cors from "cors";
import type Database from "better-sqlite3";
import { SQLiteExpenseRepository } from "./infrastructure/sqlite-expense-repository.js";

type ValidationError = { readonly field: string; readonly message: string };
type ValidatedExpenseInput = { readonly name: string; readonly amount: number };
type ValidationResult =
  | { readonly valid: true; readonly data: ValidatedExpenseInput }
  | { readonly valid: false; readonly errors: ValidationError[] };

const validateCreateExpense = (
  body: Record<string, unknown>,
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    errors.push({ field: "name", message: "Name is required" });
  }

  if (typeof body.amount !== "number" || body.amount <= 0) {
    errors.push({
      field: "amount",
      message: "Amount must be a positive number",
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: { name: (body.name as string).trim(), amount: body.amount as number },
  };
};

export const createApp = (db: Database.Database) => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const repository = new SQLiteExpenseRepository(db);

  app.get("/api/expenses", (_req, res) => {
    res.json(repository.getAll());
  });

  app.post("/api/expenses", (req, res) => {
    const result = validateCreateExpense(req.body as Record<string, unknown>);

    if (!result.valid) {
      res.status(422).json({ errors: result.errors });
      return;
    }

    const expense = repository.create({
      id: crypto.randomUUID(),
      ...result.data,
    });

    res.status(201).json(expense);
  });

  return app;
};
