import { expect } from 'vitest';
import {
  addExpense,
  expectRecordedExpenses,
  openTheExpenseTracker,
  reportedProblems,
  type ExpenseEntry,
} from './record-expense.steps.tsx';

const FIRST_SEED = 20261115;
const RUNS = 8;
const REFUSAL_RUNS = 16;
const MAX_ENTRIES = 4;
const MAX_CENTS = 999999;
const SYLLABLES = ['ca', 'fe', 'bus', 'gym', 'ink', 'tax', 'lun', 'ch', 'pet', 'gas'];
const REFUSALS = [
  'blank name',
  'whitespace only name',
  'blank amount',
  'amount in words',
  'negative amount',
  'zero amount',
  'amount with three decimals',
  'amount beyond the largest',
] as const;
const BEYOND_THE_LARGEST = '99999999999999999999.99';

type Refusal = (typeof REFUSALS)[number];

const nextSeed = (seed: number): number => (seed * 1664525 + 1013904223) >>> 0;

const pick = (seed: number, size: number): number => seed % size;

const generatedName = (seed: number): string => {
  const parts = 1 + pick(seed, 2);
  const chosen = Array.from({ length: parts }, (_, index) =>
    SYLLABLES[pick(nextSeed(seed + index), SYLLABLES.length)],
  ).join('');
  return chosen.charAt(0).toUpperCase() + chosen.slice(1);
};

const generatedAmount = (seed: number): string => {
  const cents = 1 + pick(seed, MAX_CENTS);
  return (cents / 100).toFixed(2);
};

const generatedEntries = (seed: number): readonly ExpenseEntry[] => {
  const count = 1 + pick(seed, MAX_ENTRIES);
  return Array.from({ length: count }, (_, index) => {
    const entrySeed = nextSeed(seed + index * 7919);
    return {
      name: generatedName(entrySeed),
      amount: generatedAmount(nextSeed(entrySeed)),
    };
  });
};

const refusedEntry = (seed: number, refusal: Refusal): ExpenseEntry => {
  const name = generatedName(seed);
  const amount = generatedAmount(nextSeed(seed));
  const refused: Record<Refusal, ExpenseEntry> = {
    'blank name': { name: '', amount },
    'whitespace only name': { name: '   ', amount },
    'blank amount': { name, amount: '' },
    'amount in words': { name, amount: 'a lot' },
    'negative amount': { name, amount: `-${amount}` },
    'zero amount': { name, amount: '0.00' },
    'amount with three decimals': { name, amount: `${amount}5` },
    'amount beyond the largest': { name, amount: BEYOND_THE_LARGEST },
  };
  return refused[refusal];
};

describe('ExpenseTrackerShould', () => {
  // LAW1: every accepted entry is listed with the name and the amount entered, in the order entered.
  it('show_every_added_expense_in_the_order_entered_for_any_entries', async () => {
    for (let run = 0; run < RUNS; run += 1) {
      const seed = nextSeed(FIRST_SEED + run);
      const entries = generatedEntries(seed);
      const user = openTheExpenseTracker();

      for (const entry of entries) {
        await addExpense(user, entry);
      }

      expectRecordedExpenses(entries, `REPLAY: seed=${seed}`);
    }
  });

  // LAW2: a refused entry leaves the expenses already recorded exactly as they were.
  it('keep_the_recorded_expenses_unchanged_for_any_refused_entry', async () => {
    for (let run = 0; run < REFUSAL_RUNS; run += 1) {
      const seed = nextSeed(FIRST_SEED + run * 31);
      const refusal = REFUSALS[run % REFUSALS.length];
      const accepted = generatedEntries(seed);
      const user = openTheExpenseTracker();
      for (const entry of accepted) {
        await addExpense(user, entry);
      }

      await addExpense(user, refusedEntry(nextSeed(seed), refusal));

      expectRecordedExpenses(accepted, `REPLAY: seed=${seed}, refusal=${refusal}`);
      expect(
        reportedProblems().length,
        `WHAT: an entry refused for a ${refusal} reported no problem to the user (REPLAY: seed=${seed}). ` +
          'WHY: an entry that is dropped without a word leaves the user believing the expense was recorded. ' +
          'HOW: report the problem that refused the entry.',
      ).toBeGreaterThan(0);
    }
  });
});
