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

describe("POST /api/expenses", () => {
  it("creates an expense and returns it with a generated id", async () => {
    const app = makeApp();

    const response = await request(app)
      .post("/api/expenses")
      .send({ name: "Rent", amount: 1200 });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: "Rent", amount: 1200 });
    expect(typeof response.body.id).toBe("string");
    expect(response.body.id.length).toBeGreaterThan(0);
  });

  it("persists the expense so it appears in subsequent GET requests", async () => {
    const app = makeApp();

    await request(app)
      .post("/api/expenses")
      .send({ name: "Rent", amount: 1200 });

    const response = await request(app).get("/api/expenses");

    expect(response.body).toMatchObject([{ name: "Rent", amount: 1200 }]);
  });

  it("trims whitespace from the expense name", async () => {
    const app = makeApp();

    const response = await request(app)
      .post("/api/expenses")
      .send({ name: "  Rent  ", amount: 1200 });

    expect(response.body.name).toBe("Rent");
  });

  it("returns 422 when name is missing", async () => {
    const app = makeApp();

    const response = await request(app)
      .post("/api/expenses")
      .send({ amount: 1200 });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ field: "name" }),
    );
  });

  it("returns 422 when name is whitespace-only", async () => {
    const app = makeApp();

    const response = await request(app)
      .post("/api/expenses")
      .send({ name: "   ", amount: 1200 });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ field: "name" }),
    );
  });

  it("returns 422 when amount is missing", async () => {
    const app = makeApp();

    const response = await request(app)
      .post("/api/expenses")
      .send({ name: "Rent" });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ field: "amount" }),
    );
  });

  it("returns 422 when amount is not a number", async () => {
    const app = makeApp();

    const response = await request(app)
      .post("/api/expenses")
      .send({ name: "Rent", amount: "abc" });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ field: "amount" }),
    );
  });

  it("returns 422 when amount is zero", async () => {
    const app = makeApp();

    const response = await request(app)
      .post("/api/expenses")
      .send({ name: "Rent", amount: 0 });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ field: "amount" }),
    );
  });

  it("returns 422 when amount is negative", async () => {
    const app = makeApp();

    const response = await request(app)
      .post("/api/expenses")
      .send({ name: "Rent", amount: -10 });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({ field: "amount" }),
    );
  });
});
