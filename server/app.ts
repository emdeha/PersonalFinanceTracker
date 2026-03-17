import express from "express";
import cors from "cors";
import type Database from "better-sqlite3";
import { SQLiteExpenseRepository } from "./infrastructure/sqlite-expense-repository.js";

export const createApp = (db: Database.Database) => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const repository = new SQLiteExpenseRepository(db);

  app.get("/api/expenses", (_req, res) => {
    res.json(repository.getAll());
  });

  return app;
};
