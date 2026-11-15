export type EntryField = 'name' | 'amount';

export type EntryProblem = {
  readonly field: EntryField;
  readonly what: string;
  readonly why: string;
  readonly how: string;
};

export const messageOf = (problem: EntryProblem): string =>
  `${problem.what} ${problem.why} ${problem.how}`;
