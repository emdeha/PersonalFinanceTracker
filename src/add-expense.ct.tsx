import { expect, test } from "@playwright/experimental-ct-react";
import type { Page } from "@playwright/test";

import App from "./App";
import { addExpense, amountField, clickAdd, expenseRows, nameField, type ExpenseInput } from "./expense-page";

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const expectExpenseRow = (page: Page, { name, amount }: ExpenseInput) =>
  expect(
    expenseRows(page).filter({
      hasText: new RegExp(`^${escapeRegExp(name)} ${escapeRegExp(amount)}(?: |$)`),
    }),
  ).not.toHaveCount(0);

const expectNoExpenseRows = (page: Page) => expect(expenseRows(page)).toHaveCount(0);

const expectInvalidAmountRejected = async (
  page: Page,
  { amount, error }: { amount: string; error: string },
) => {
  await addExpense(page, { name: "Coffee", amount });

  await expect(page.getByText(error)).toBeVisible();
  await expectNoExpenseRows(page);
};

const expectEnteredValuesKept = async (page: Page, { name, amount }: ExpenseInput) => {
  await nameField(page).fill(name);
  await amountField(page).fill(amount);

  await clickAdd(page);

  await expect(nameField(page)).toHaveValue(name);
  await expect(amountField(page)).toHaveValue(amount);
};

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

  test("clears the input fields after adding an expense", async ({ page }) => {
    await nameField(page).fill("Coffee");
    await amountField(page).fill("5");

    await clickAdd(page);

    await expect(nameField(page)).toHaveValue("");
    await expect(amountField(page)).toHaveValue("");
  });

  test("adds multiple expenses", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5" });

    await addExpense(page, { name: "Groceries", amount: "30" });

    await expectExpenseRow(page, { name: "Coffee", amount: "5" });
    await expectExpenseRow(page, { name: "Groceries", amount: "30" });
  });

  test("lists expenses in the order they were added", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5" });
    await addExpense(page, { name: "Groceries", amount: "30" });

    await expect(expenseRows(page)).toContainText(["Coffee 5", "Groceries 30"]);
  });

  test("adds an expense with a decimal amount", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "4.50" });

    await expectExpenseRow(page, { name: "Coffee", amount: "4.50" });
  });

  test("trims surrounding whitespace from the name", async ({ page }) => {
    await addExpense(page, { name: "  Coffee  ", amount: "5" });

    await expectExpenseRow(page, { name: "Coffee", amount: "5" });
  });

  test("trims surrounding whitespace from the amount", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: " 5 " });

    await expectExpenseRow(page, { name: "Coffee", amount: "5" });
  });

  test("adds two expenses with the same name", async ({ page }) => {
    await addExpense(page, { name: "Coffee", amount: "5" });

    await addExpense(page, { name: "Coffee", amount: "6" });

    await expect(expenseRows(page)).toContainText(["Coffee 5", "Coffee 6"]);
  });

  test("cannot add an expense without a name", async ({ page }) => {
    await amountField(page).fill("5");

    await clickAdd(page);

    await expect(page.getByText("Name is required")).toBeVisible();
    await expectNoExpenseRows(page);
  });

  test("cannot add an expense with a whitespace-only name", async ({ page }) => {
    await addExpense(page, { name: "   ", amount: "5" });

    await expect(page.getByText("Name is required")).toBeVisible();
    await expectNoExpenseRows(page);
  });

  test("cannot add an expense without an amount", async ({ page }) => {
    await nameField(page).fill("Coffee");

    await clickAdd(page);

    await expect(page.getByText("Amount is required")).toBeVisible();
    await expectNoExpenseRows(page);
  });

  test("cannot add an expense with a whitespace-only amount", async ({ page }) => {
    await nameField(page).fill("Coffee");
    await amountField(page).fill("   ");

    await clickAdd(page);

    await expect(page.getByText("Amount is required")).toBeVisible();
    await expectNoExpenseRows(page);
  });

  test('cannot add an expense with the invalid amount "abc"', async ({ page }) => {
    await expectInvalidAmountRejected(page, { amount: "abc", error: "Amount must be a number" });
  });

  test('cannot add an expense with the invalid amount "0"', async ({ page }) => {
    await expectInvalidAmountRejected(page, { amount: "0", error: "Amount must be greater than 0" });
  });

  test('cannot add an expense with the invalid amount "-5"', async ({ page }) => {
    await expectInvalidAmountRejected(page, { amount: "-5", error: "Amount must be greater than 0" });
  });

  test('keeps entered values when validation fails for name "Coffee" and amount "abc"', async ({ page }) => {
    await expectEnteredValuesKept(page, { name: "Coffee", amount: "abc" });
  });

  test('keeps entered values when validation fails for name "Coffee" and an empty amount', async ({ page }) => {
    await expectEnteredValuesKept(page, { name: "Coffee", amount: "" });
  });

  test('keeps entered values when validation fails for an empty name and amount "5"', async ({ page }) => {
    await expectEnteredValuesKept(page, { name: "", amount: "5" });
  });

  test("removes the error after a successful add", async ({ page }) => {
    await amountField(page).fill("5");
    await clickAdd(page);
    await expect(page.getByText("Name is required")).toBeVisible();

    await nameField(page).fill("Coffee");
    await clickAdd(page);

    await expect(page.getByText("Name is required")).not.toBeVisible();
  });
});
