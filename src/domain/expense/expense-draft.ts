export type ExpenseDraft = {
  readonly name: string;
  readonly amount: string;
};

export const blankDraft: ExpenseDraft = { name: '', amount: '' };
