import { describe, it, expect } from "vitest";
import { createExpenses, addExpense } from "./expenses";

describe("Expenses domain", () => {
  describe("createExpenses", () => {
    it("creates an empty collection by default", () => {
      const expenses = createExpenses();

      expect(expenses.items).toEqual([]);
    });

    it("creates a collection pre-populated with the given expenses", () => {
      const expenses = createExpenses([
        { id: "1", name: "Rent", amount: 1200 },
      ]);

      expect(expenses.items).toEqual([{ id: "1", name: "Rent", amount: 1200 }]);
    });
  });

  describe("addExpense", () => {
    it("adds an expense to the collection", () => {
      const expenses = createExpenses();

      const updated = addExpense(expenses, {
        id: "1",
        name: "Rent",
        amount: 1200,
      });

      expect(updated.items).toEqual([{ id: "1", name: "Rent", amount: 1200 }]);
    });

    it("does not mutate the original collection", () => {
      const expenses = createExpenses([
        { id: "1", name: "Rent", amount: 1200 },
      ]);

      addExpense(expenses, { id: "2", name: "Utilities", amount: 80 });

      expect(expenses.items).toEqual([{ id: "1", name: "Rent", amount: 1200 }]);
    });

    it("preserves existing expenses when adding a new one", () => {
      const expenses = createExpenses([
        { id: "1", name: "Rent", amount: 1200 },
      ]);

      const updated = addExpense(expenses, {
        id: "2",
        name: "Utilities",
        amount: 80,
      });

      expect(updated.items).toEqual([
        { id: "1", name: "Rent", amount: 1200 },
        { id: "2", name: "Utilities", amount: 80 },
      ]);
    });
  });
});
