import { expect, test } from "@playwright/experimental-ct-react";

import App from "./App";
import { addExpense, categoryField, expenseRows } from "./expense-page";

test.describe("Categorize an expense", () => {
  test.beforeEach(async ({ mount }) => {
    await mount(<App />);
  });

  test("adds an expense with a category", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5", category: "Food" });

    await expect(expenseRows(page)).toHaveText(["Coffee 5 (Food) Expense"]);
    await expect(categoryField(page)).toHaveValue("");
  });

  test("trims surrounding whitespace from the category", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5", category: "  Food  " });
    await addExpense(page, { name: "Bus", amount: "3", category: "   " });

    await expect(expenseRows(page)).toHaveText(["Coffee 5 (Food) Expense", "Bus 3 Expense"]);
  });
});
