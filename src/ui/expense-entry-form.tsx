import type { FormEvent } from 'react';
import {
  messageOf,
  type EntryField,
  type EntryProblem,
} from '../domain/expense/entry-problem.ts';
import type { ExpenseDraft } from '../domain/expense/expense-draft.ts';

const NAME_FIELD_ID = 'expense-name';
const AMOUNT_FIELD_ID = 'expense-amount';

const problemId = (field: EntryField): string => `${field}-problem`;

const problemOf = (
  problems: readonly EntryProblem[],
  field: EntryField,
): EntryProblem | undefined => problems.find((problem) => problem.field === field);

const describedBy = (
  problems: readonly EntryProblem[],
  field: EntryField,
): string | undefined =>
  problemOf(problems, field) === undefined ? undefined : problemId(field);

type ExpenseEntryFormProps = {
  readonly draft: ExpenseDraft;
  readonly problems: readonly EntryProblem[];
  readonly onDraft: (draft: ExpenseDraft) => void;
  readonly onRecord: () => void;
};

const ExpenseEntryForm = ({
  draft,
  problems,
  onDraft,
  onRecord,
}: ExpenseEntryFormProps) => {
  const record = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onRecord();
  };

  return (
    <form onSubmit={record}>
      <div>
        <label htmlFor={NAME_FIELD_ID}>Expense name</label>
        <input
          id={NAME_FIELD_ID}
          value={draft.name}
          aria-invalid={problemOf(problems, 'name') !== undefined}
          aria-describedby={describedBy(problems, 'name')}
          onChange={(event) => onDraft({ ...draft, name: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor={AMOUNT_FIELD_ID}>Amount</label>
        <input
          id={AMOUNT_FIELD_ID}
          value={draft.amount}
          aria-invalid={problemOf(problems, 'amount') !== undefined}
          aria-describedby={describedBy(problems, 'amount')}
          onChange={(event) => onDraft({ ...draft, amount: event.target.value })}
        />
      </div>
      <button type="submit">Add expense</button>
      {problems.map((problem) => (
        <p key={problem.field} id={problemId(problem.field)} role="alert">
          {messageOf(problem)}
        </p>
      ))}
    </form>
  );
};

export default ExpenseEntryForm;
