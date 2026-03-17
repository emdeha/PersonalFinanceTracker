// @vitest-environment node
import { describe, it, expect } from "vitest";
import request from "supertest";
import Database from "better-sqlite3";
import { createApp } from "./app.js";

const makeApp = () => {
  const db = new Database(":memory:");
  return createApp(db);
};

describe("GET /api/expenses", () => {
  it("returns an empty array when there are no expenses", async () => {
    const app = makeApp();

    const response = await request(app).get("/api/expenses");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("returns all expenses stored in the database", async () => {
    const db = new Database(":memory:");
    const app = createApp(db);
    db.prepare("INSERT INTO expenses (id, name, amount) VALUES (?, ?, ?)").run(
      "1",
      "Rent",
      1200,
    );

    const response = await request(app).get("/api/expenses");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: "1", name: "Rent", amount: 1200 }]);
  });
});
