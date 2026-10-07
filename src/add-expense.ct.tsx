import { expect, test } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";

import App from "./App";

type ExpenseInput = { name: string; amount: string };

const nameField = (page: Page) => page.getByLabel("Name");
const amountField = (page: Page) => page.getByLabel("Amount");
const expenseRows = (page: Page) => page.getByRole("listitem");

const clickAdd = (page: Page) => page.getByRole("button", { name: "Add" }).click();

const addExpense = async (page: Page, { name, amount }: ExpenseInput) => {
  await nameField(page).fill(name);
  await amountField(page).fill(amount);
  await clickAdd(page);
};

const expectExpenseRow = (page: Page, { name, amount }: ExpenseInput) =>
  expect(
    expenseRows(page).filter({ hasText: name }).filter({ hasText: amount }),
  ).not.toHaveCount(0);

const expectNoExpenseRows = (page: Page) => expect(expenseRows(page)).toHaveCount(0);

test.describe("Add an expense by name and amount", () => {
  test.beforeEach(async ({ mount }) => {
    await mount(<App />);
  });

  test("adds a valid expense", async ({ page }) => {
    await nameField(page).fill("Coffee");
    await amountField(page).fill("5");
    await clickAdd(page);

    await expectExpenseRow(page, { name: "Coffee", amount: "5" });
  });

  test.skip("clears the input fields after adding an expense", async ({ page }) => {
    await nameField(page).fill("Coffee");
    await amountField(page).fill("5");

    await clickAdd(page);

    await expect(nameField(page)).toHaveValue("");
    await expect(amountField(page)).toHaveValue("");
  });

  test.skip("adds multiple expenses", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5" });

    await addExpense(page, { name: "Groceries", amount: "30" });

    await expectExpenseRow(page, { name: "Coffee", amount: "5" });
    await expectExpenseRow(page, { name: "Groceries", amount: "30" });
  });

  test.skip("lists expenses in the order they were added", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5" });

    await addExpense(page, { name: "Groceries", amount: "30" });

    await expect(expenseRows(page).nth(0)).toContainText("Coffee");
    await expect(expenseRows(page).nth(1)).toContainText("Groceries");
  });

  test.skip("adds an expense with a decimal amount", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "4.50" });

    await expectExpenseRow(page, { name: "Coffee", amount: "4.50" });
  });

  test.skip("adds two expenses with the same name", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5" });

    await addExpense(page, { name: "Coffee", amount: "6" });

    await expect(expenseRows(page).filter({ hasText: "Coffee" })).toHaveCount(2);
  });

  test.skip("trims surrounding whitespace from the name", async ({ page }) => {
    await addExpense(page, { name: "  Coffee  ", amount: "5" });

    await expectExpenseRow(page, { name: "Coffee", amount: "5" });
    await expect(expenseRows(page).first()).toHaveText(/^Coffee/);
  });

  test.skip("cannot add an expense without a name", async ({ page }) => {
    await amountField(page).fill("5");

    await clickAdd(page);

    await expect(page.getByText("Name is required")).toBeVisible();
    await expectNoExpenseRows(page);
  });

  test.skip("cannot add an expense with a whitespace-only name", async ({ page }) => {
    await addExpense(page, { name: "   ", amount: "5" });

    await expect(page.getByText("Name is required")).toBeVisible();
    await expectNoExpenseRows(page);
  });

  test.skip("cannot add an expense without an amount", async ({ page }) => {
    await nameField(page).fill("Coffee");

    await clickAdd(page);

    await expect(page.getByText("Amount is required")).toBeVisible();
    await expectNoExpenseRows(page);
  });

  const invalidAmounts: ReadonlyArray<{ amount: string; error: string }> = [
    { amount: "abc", error: "Amount must be a number" },
    { amount: "0", error: "Amount must be greater than 0" },
    { amount: "-5", error: "Amount must be greater than 0" },
  ];

  invalidAmounts.forEach(({ amount, error }) => {
    test.skip(`cannot add an expense with the invalid amount "${amount}"`, async ({ page }) => {
      await addExpense(page, { name: "Coffee", amount });

      await expect(page.getByText(error)).toBeVisible();
      await expectNoExpenseRows(page);
    });
  });

  test.skip("keeps entered values when validation fails", async ({ page }) => {
    await nameField(page).fill("Coffee");

    await clickAdd(page);

    await expect(nameField(page)).toHaveValue("Coffee");
  });

  test.skip("removes the error after a successful add", async ({ page }) => {
    await amountField(page).fill("5");
    await clickAdd(page);
    await expect(page.getByText("Name is required")).toBeVisible();

    await nameField(page).fill("Coffee");
    await clickAdd(page);

    await expect(page.getByRole("alert")).toHaveCount(0);
  });
});
