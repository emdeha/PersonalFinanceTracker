import type { Page } from "@playwright/test";

export type ExpenseInput = { name: string; amount: string; category?: string };

export const nameField = (page: Page) => page.getByLabel("Name");
export const amountField = (page: Page) => page.getByLabel("Amount");
export const categoryField = (page: Page) => page.getByLabel("Category");
export const expenseRows = (page: Page) => page.getByRole("listitem");

export const clickAdd = (page: Page) => page.getByRole("button", { name: "Add" }).click();

export const addExpense = async (page: Page, { name, amount, category }: ExpenseInput) => {
  await nameField(page).fill(name);
  await amountField(page).fill(amount);
  if (category !== undefined) {
    await categoryField(page).fill(category);
  }
  await clickAdd(page);
};
