import { accepted, refused, type Result } from '../result.ts';
import type { EntryProblem } from './entry-problem.ts';

export type ExpenseName = string & { readonly brand: unique symbol };

const EXAMPLE_NAME = 'Coffee';

const noName: EntryProblem = {
  field: 'name',
  what: 'The expense has no name.',
  why: 'Each expense is listed under its name, so one without a name cannot be told from another.',
  how: `Type a name for the expense, such as "${EXAMPLE_NAME}".`,
};

export const expenseName = (
  typed: string,
): Result<ExpenseName, EntryProblem> => {
  const named = typed.trim();
  return named === ''
    ? refused(noName)
    : accepted(named as ExpenseName);
};

export const nameShown = (name: ExpenseName): string => name;
