import type Database from "better-sqlite3";
import type { Expense, ExpenseRepository } from "../domain/expense.js";

export class SQLiteExpenseRepository implements ExpenseRepository {
  constructor(private readonly db: Database.Database) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        amount REAL NOT NULL
      )
    `);
  }

  getAll(): Expense[] {
    return this.db
      .prepare("SELECT id, name, amount FROM expenses")
      .all() as Expense[];
  }
}
