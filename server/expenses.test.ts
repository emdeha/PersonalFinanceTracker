// @vitest-environment node
import request from "supertest";
import { describe, it, expect } from "vitest";
import Database from "better-sqlite3";
import { createApp } from "./app.ts";

const createTestApp = () => createApp(new Database(":memory:"));

describe("POST /api/expenses", () => {
  describe("creating a valid expense", () => {
    it("returns 201 with the created expense as JSON", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: 50 });

      expect(response.status).toBe(201);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      expect(response.body).toMatchObject({ name: "Groceries", amount: 50 });
    });

    it("includes a generated id in the response", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: 50 });

      expect(typeof response.body.id).toBe("string");
      expect(response.body.id.length).toBeGreaterThan(0);
    });

    it("assigns a different id to each expense", async () => {
      const app = createTestApp();
      const first = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: 50 });

      const second = await request(app)
        .post("/api/expenses")
        .send({ name: "Rent", amount: 1200 });

      expect(first.body.id).not.toBe(second.body.id);
    });

    it("trims whitespace from the name", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "  Groceries  ", amount: 50 });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Groceries");
    });
  });

  describe("validation errors", () => {
    it("returns 422 with a name error when name is missing", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ amount: 50 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "name" }),
      );
    });

    it("returns 422 with a name error when name is empty", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "", amount: 50 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "name" }),
      );
    });

    it("returns 422 with a name error when name is whitespace only", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "   ", amount: 50 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "name" }),
      );
    });

    it("returns 422 with an amount error when amount is missing", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries" });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "amount" }),
      );
    });

    it("returns 422 with an amount error when amount is zero", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: 0 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "amount" }),
      );
    });

    it("returns 422 with an amount error when amount is negative", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: -10 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "amount" }),
      );
    });

    it("returns 422 with an amount error when amount is non-numeric", async () => {
      const app = createTestApp();
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: "abc" });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "amount" }),
      );
    });
  });
});

describe("GET /api/expenses", () => {
  it("returns 200 with an empty array when the store is empty", async () => {
    const app = createTestApp();
    const response = await request(app).get("/api/expenses");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.body).toEqual([]);
  });

  it("returns the created expense after one has been added", async () => {
    const app = createTestApp();
    await request(app)
      .post("/api/expenses")
      .send({ name: "Coffee", amount: 5 });

    const response = await request(app).get("/api/expenses");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({ name: "Coffee", amount: 5 });
  });

  it("preserves insertion order", async () => {
    const app = createTestApp();
    await request(app)
      .post("/api/expenses")
      .send({ name: "Rent", amount: 1200 });
    await request(app)
      .post("/api/expenses")
      .send({ name: "Utilities", amount: 80 });

    const response = await request(app).get("/api/expenses");

    expect(response.body[0].name).toBe("Rent");
    expect(response.body[1].name).toBe("Utilities");
  });
});

describe("DELETE /api/expenses/:id", () => {
  it("returns 204 and removes the expense from the list", async () => {
    const app = createTestApp();
    const created = await request(app)
      .post("/api/expenses")
      .send({ name: "Coffee", amount: 5 });

    const deleteResponse = await request(app).delete(
      `/api/expenses/${created.body.id}`,
    );

    expect(deleteResponse.status).toBe(204);

    const list = await request(app).get("/api/expenses");
    expect(list.body).toHaveLength(0);
  });

  it("returns 404 for a non-existent id", async () => {
    const app = createTestApp();
    const response = await request(app).delete("/api/expenses/non-existent-id");

    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
  });
});
