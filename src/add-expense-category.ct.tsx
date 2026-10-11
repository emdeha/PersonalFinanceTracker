import { expect, test } from "@playwright/experimental-ct-react";

import App from "./App";
import {
  addExpense,
  amountField,
  categoryField,
  clickAdd,
  expenseRows,
  nameField,
} from "./expense-page";

test.describe("Categorize an expense", () => {
  test.beforeEach(async ({ mount }) => {
    await mount(<App />);
  });

  test.skip("adds an expense with a category", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5", category: "Food" });

    await expect(expenseRows(page)).toHaveText(["Coffee 5 (Food)"]);
  });

  test.skip("clears the category field after adding an expense", async ({ page }) => {
    await nameField(page).fill("Coffee");
    await amountField(page).fill("5");
    await categoryField(page).fill("Food");

    await clickAdd(page);

    await expect(categoryField(page)).toHaveValue("");
  });

  test.skip("adds an expense without a category", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5" });

    await expect(expenseRows(page)).toHaveText(["Coffee 5"]);
    await expect(expenseRows(page)).not.toContainText("(");
  });

  test.skip("trims surrounding whitespace from the category", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5", category: "  Food  " });

    await expect(expenseRows(page)).toHaveText(["Coffee 5 (Food)"]);
  });

  test.skip("treats a whitespace-only category as no category", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5", category: "   " });

    await expect(expenseRows(page)).toHaveText(["Coffee 5"]);
    await expect(expenseRows(page)).not.toContainText("(");
  });

  test.skip("keeps the category when validation fails", async ({ page }) => {
    await categoryField(page).fill("Food");

    await clickAdd(page);

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(categoryField(page)).toHaveValue("Food");
  });
});
