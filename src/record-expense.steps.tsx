import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import { expect } from 'vitest';
import App from './App.tsx';

const NAME_FIELD = 'Expense name';
const AMOUNT_FIELD = 'Amount';
const ADD_BUTTON = 'Add expense';
const EXPENSE_TABLE = 'Recorded expenses';

export type ExpenseEntry = {
  readonly name: string;
  readonly amount: string;
};

export const anExpense = (overrides?: Partial<ExpenseEntry>): ExpenseEntry => ({
  name: 'Coffee',
  amount: '4.50',
  ...overrides,
});

export const openTheExpenseTracker = (): UserEvent => {
  cleanup();
  render(<App />);
  return userEvent.setup({ delay: null });
};

export const addExpense = async (
  user: UserEvent,
  entry: ExpenseEntry,
): Promise<void> => {
  const name = screen.getByLabelText(NAME_FIELD);
  const amount = screen.getByLabelText(AMOUNT_FIELD);

  await user.clear(name);
  await user.clear(amount);
  if (entry.name !== '') {
    await user.type(name, entry.name);
  }
  if (entry.amount !== '') {
    await user.type(amount, entry.amount);
  }
  await user.click(screen.getByRole('button', { name: ADD_BUTTON }));
};

const textOf = (element: HTMLElement): string => (element.textContent ?? '').trim();

export const recordedExpenses = (): readonly ExpenseEntry[] =>
  within(screen.getByRole('table', { name: EXPENSE_TABLE }))
    .getAllByRole('row')
    .map((row) => within(row).queryAllByRole('cell'))
    .filter((cells) => cells.length > 0)
    .map((cells) => ({ name: textOf(cells[0]), amount: textOf(cells[1]) }));

export const reportedProblems = (): readonly string[] =>
  screen.queryAllByRole('alert').map(textOf);

export const expectRecordedExpenses = (
  expected: readonly ExpenseEntry[],
  context = '',
): void => {
  expect(
    recordedExpenses(),
    `WHAT: the recorded expenses are not the ones the user entered. ${context} ` +
      'WHY: every accepted entry must be listed with the name and the amount entered, in the order entered, ' +
      'and a refused entry must leave the list exactly as it was. ' +
      'HOW: record each accepted entry once and change nothing when an entry is refused.',
  ).toEqual(expected);
};

export const expectProblemsNaming = (
  expectedProblems: readonly (readonly string[])[],
): void => {
  const problems = reportedProblems();

  expect(
    problems,
    `WHAT: ${problems.length} problem(s) were reported for ${expectedProblems.length} invalid field(s): ${JSON.stringify(problems)}. ` +
      'WHY: the user must see one problem for each field that was refused, all in one pass, and none for a field that was accepted. ' +
      'HOW: check the name and the amount independently and report every problem found together.',
  ).toHaveLength(expectedProblems.length);

  expectedProblems.forEach((facts) => {
    expect(
      problems.some((problem) => facts.every((fact) => problem.includes(fact))),
      `WHAT: no reported problem names all of ${JSON.stringify(facts)}; the problems were ${JSON.stringify(problems)}. ` +
        'WHY: a refusal must tell the user what was refused and what a valid entry looks like, otherwise it cannot be acted on. ' +
        'HOW: name the refused value and give an example of an accepted one in the message.',
    ).toBe(true);
  });
};
