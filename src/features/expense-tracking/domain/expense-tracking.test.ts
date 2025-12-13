import { describe, it, expect } from "vitest";
import { createExpense, addExpenseToList } from "./expense-tracking";

describe("Expense tracking", () => {
  describe("Adding expenses", () => {
    it("should create an expense with valid name and amount", () => {
      const result = createExpense({ name: "Coffee", amount: 5 });

      expect(result.success).toBe(true);
      expect(result.data.name).toBe("Coffee");
      expect(result.data.amount).toBe(5);
      expect(result.data.id).toBeDefined();
      expect(result.data.createdAt).toBeInstanceOf(Date);
    });

    it("should add expense to empty list", () => {
      const expenseResult = createExpense({ name: "Coffee", amount: 5 });
      const expenses = addExpenseToList([], expenseResult.data);

      expect(expenses).toHaveLength(1);
      expect(expenses[0].name).toBe("Coffee");
    });

    it("should add multiple expenses", () => {
      const expense1Result = createExpense({ name: "Coffee", amount: 5 });
      const expense2Result = createExpense({ name: "Lunch", amount: 12 });

      const listWith1 = addExpenseToList([], expense1Result.data);
      const listWith2 = addExpenseToList(listWith1, expense2Result.data);

      expect(listWith2).toHaveLength(2);
      expect(listWith2[0].name).toBe("Coffee");
      expect(listWith2[1].name).toBe("Lunch");
    });
  });

  describe("Validation", () => {
    it("should reject expense with empty name", () => {
      const result = createExpense({ name: "", amount: 10 });

      expect(result.success).toBe(false);
      expect(result.errors).toContain("Name is required");
    });

    it("should reject expense with zero amount", () => {
      const result = createExpense({ name: "Coffee", amount: 0 });

      expect(result.success).toBe(false);
      expect(result.errors.some(err => err.includes("greater than zero"))).toBe(true);
    });

    it("should reject expense with negative amount", () => {
      const result = createExpense({ name: "Coffee", amount: -5 });

      expect(result.success).toBe(false);
      expect(result.errors.some(err => err.includes("greater than zero"))).toBe(true);
    });

    it("should reject expense with empty string amount", () => {
      const result = createExpense({ name: "Coffee", amount: "" });

      expect(result.success).toBe(false);
      expect(result.errors).toContain("Amount is required");
    });

    it("should reject expense with missing amount", () => {
      const result = createExpense({ name: "Coffee" });

      expect(result.success).toBe(false);
      expect(result.errors).toContain("Amount is required");
    });

    it("should accept expense with string amount", () => {
      const result = createExpense({ name: "Coffee", amount: "5" });

      expect(result.success).toBe(true);
      expect(result.data.amount).toBe(5);
    });

    it("should reject expense with string zero amount", () => {
      const result = createExpense({ name: "Coffee", amount: "0" });

      expect(result.success).toBe(false);
      expect(result.errors.some(err => err.includes("greater than zero"))).toBe(true);
    });

    it("should accept expense with decimal string amount", () => {
      const result = createExpense({ name: "Lunch", amount: "12.50" });

      expect(result.success).toBe(true);
      expect(result.data.amount).toBe(12.5);
    });
  });
});
