import { expect, test } from "@playwright/experimental-ct-react";

import App from "./App";
import {
  addExpense,
  amountField,
  clickAdd,
  expenseRows,
  nameField,
  typeField,
} from "./expense-page";

test.describe("Mark an expense as expense or income", () => {
  test.beforeEach(async ({ mount }) => {
    await mount(<App />);
  });

  test("adds an expense without choosing a type as an expense", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5" });

    await expect(expenseRows(page)).toHaveText(["Coffee 5 Expense"]);
  });

  test("shows the type after the category", async ({ page }) => {
    await addExpense(page, { name: "Salary", amount: "3000", category: "Work", type: "Income" });

    await expect(expenseRows(page)).toHaveText(["Salary 3000 (Work) Income"]);
  });

  test("adds an income", async ({ page }) => {
    await addExpense(page, { name: "Salary", amount: "3000", type: "Income" });

    await expect(expenseRows(page)).toHaveText(["Salary 3000 Income"]);
  });

  test("selects Expense when the form opens", async ({ page }) => {
    await expect(typeField(page)).toHaveValue("Expense");
  });

  test("returns the type to Expense after adding an expense", async ({ page }) => {
    await addExpense(page, { name: "Salary", amount: "3000", type: "Income" });

    await expect(typeField(page)).toHaveValue("Expense");
  });

  test("does not carry a chosen type over to the next expense", async ({ page }) => {
    await addExpense(page, { name: "Salary", amount: "3000", type: "Income" });

    await addExpense(page, { name: "Coffee", amount: "5" });

    await expect(expenseRows(page)).toHaveText(["Salary 3000 Income", "Coffee 5 Expense"]);
  });

  test("keeps the type when validation fails", async ({ page }) => {
    await typeField(page).selectOption("Income");

    await clickAdd(page);

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(typeField(page)).toHaveValue("Income");
  });

  test("saves a kept type when the add succeeds on retry", async ({ page }) => {
    await typeField(page).selectOption("Income");
    await clickAdd(page);

    await nameField(page).fill("Salary");
    await amountField(page).fill("3000");
    await clickAdd(page);

    await expect(expenseRows(page)).toHaveText(["Salary 3000 Income"]);
  });
});
