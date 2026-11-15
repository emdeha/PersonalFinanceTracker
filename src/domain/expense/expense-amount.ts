import { accepted, refused, type Result } from '../result.ts';
import type { EntryProblem } from './entry-problem.ts';

export type ExpenseAmount = number & { readonly brand: unique symbol };

const CENTS_IN_ONE = 100n;
const DECIMALS = 2;
const AMOUNT_TYPED = /^\d+(\.\d{1,2})?$/;
const EXAMPLE_AMOUNT = '4.50';
const LARGEST_CENTS = BigInt(Number.MAX_SAFE_INTEGER);

const shown = (cents: bigint): string =>
  `${cents / CENTS_IN_ONE}.${(cents % CENTS_IN_ONE).toString().padStart(DECIMALS, '0')}`;

const notAnAmount = (typed: string): EntryProblem => ({
  field: 'amount',
  what: `"${typed}" is not an amount.`,
  why: 'An expense records how much was spent, so the amount has to be a positive number of money.',
  how: `Type the amount as a positive number with at most two decimals, such as "${EXAMPLE_AMOUNT}".`,
});

const beyondTheLargest = (typed: string): EntryProblem => ({
  field: 'amount',
  what: `"${typed}" is more than this tracker can record.`,
  why: 'An amount is kept as an exact whole number of cents, and this one needs more cents than can be held exactly, so it would be recorded as a different amount.',
  how: `Type an amount of at most ${shown(LARGEST_CENTS)}.`,
});

const centsIn = (amount: string): bigint => {
  const [whole, fraction = ''] = amount.split('.');
  return BigInt(whole) * CENTS_IN_ONE + BigInt(fraction.padEnd(DECIMALS, '0'));
};

export const expenseAmount = (
  typed: string,
): Result<ExpenseAmount, EntryProblem> => {
  const amount = typed.trim();
  if (!AMOUNT_TYPED.test(amount)) {
    return refused(notAnAmount(typed));
  }

  const cents = centsIn(amount);
  if (cents === 0n) {
    return refused(notAnAmount(typed));
  }
  return cents > LARGEST_CENTS
    ? refused(beyondTheLargest(typed))
    : accepted(Number(cents) as ExpenseAmount);
};

export const amountShown = (amount: ExpenseAmount): string =>
  shown(BigInt(amount));
