import { accepted, refused, type Result } from '../result.ts';
import type { EntryProblem } from './entry-problem.ts';

export type ExpenseAmount = number & { readonly brand: unique symbol };

const CENTS_IN_ONE = 100;
const DECIMALS = 2;
const AMOUNT_TYPED = /^\d+(\.\d{1,2})?$/;
const EXAMPLE_AMOUNT = '4.50';

const notAnAmount = (typed: string): EntryProblem => ({
  field: 'amount',
  what: `"${typed}" is not an amount.`,
  why: 'An expense records how much was spent, so the amount has to be a positive number of money.',
  how: `Type the amount as a positive number with at most two decimals, such as "${EXAMPLE_AMOUNT}".`,
});

const centsIn = (amount: string): number => {
  const [whole, fraction = ''] = amount.split('.');
  return Number(whole) * CENTS_IN_ONE + Number(fraction.padEnd(DECIMALS, '0'));
};

export const expenseAmount = (
  typed: string,
): Result<ExpenseAmount, EntryProblem> => {
  const amount = typed.trim();
  if (!AMOUNT_TYPED.test(amount)) {
    return refused(notAnAmount(typed));
  }
  const cents = centsIn(amount);
  return cents === 0
    ? refused(notAnAmount(typed))
    : accepted(cents as ExpenseAmount);
};

export const amountShown = (amount: ExpenseAmount): string =>
  (amount / CENTS_IN_ONE).toFixed(DECIMALS);
