// @vitest-environment node
import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { app, resetExpenseStore } from "./app.ts";

describe("POST /api/expenses", () => {
  beforeEach(() => {
    resetExpenseStore();
  });

  describe("creating a valid expense", () => {
    it("returns 201 with the created expense as JSON", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: 50 });

      expect(response.status).toBe(201);
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      expect(response.body).toMatchObject({ name: "Groceries", amount: 50 });
    });

    it("includes a generated id in the response", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: 50 });

      expect(typeof response.body.id).toBe("string");
      expect(response.body.id.length).toBeGreaterThan(0);
    });

    it("assigns a different id to each expense", async () => {
      const first = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: 50 });

      const second = await request(app)
        .post("/api/expenses")
        .send({ name: "Rent", amount: 1200 });

      expect(first.body.id).not.toBe(second.body.id);
    });

    it("trims whitespace from the name", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "  Groceries  ", amount: 50 });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Groceries");
    });
  });

  describe("validation errors", () => {
    it("returns 422 with a name error when name is missing", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({ amount: 50 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "name" }),
      );
    });

    it("returns 422 with a name error when name is empty", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "", amount: 50 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "name" }),
      );
    });

    it("returns 422 with a name error when name is whitespace only", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "   ", amount: 50 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "name" }),
      );
    });

    it("returns 422 with an amount error when amount is missing", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries" });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "amount" }),
      );
    });

    it("returns 422 with an amount error when amount is zero", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: 0 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "amount" }),
      );
    });

    it("returns 422 with an amount error when amount is negative", async () => {
      const response = await request(app)
        .post("/api/expenses")
        .send({ name: "Groceries", amount: -10 });

      expect(response.status).toBe(422);
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({ field: "amount" }),
      );
    });

    it("returns 422 with an amount error when amount is non-numeric", async () => {
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
