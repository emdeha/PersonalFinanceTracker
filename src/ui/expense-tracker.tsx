import { useState } from 'react';
import {
  drafted,
  newExpenseEntry,
  recorded,
  type ExpenseEntry,
} from '../application/expense-entry.ts';
import type { ExpenseDraft } from '../domain/expense/expense-draft.ts';
import ExpenseEntryForm from './expense-entry-form.tsx';
import RecordedExpenses from './recorded-expenses.tsx';

const ExpenseTracker = () => {
  const [entry, setEntry] = useState<ExpenseEntry>(newExpenseEntry);

  return (
    <section>
      <h2>Expenses</h2>
      <ExpenseEntryForm
        draft={entry.draft}
        problems={entry.problems}
        onDraft={(draft: ExpenseDraft) => setEntry(drafted({ entry, draft }))}
        onRecord={() => setEntry(recorded(entry))}
      />
      <RecordedExpenses ledger={entry.ledger} />
    </section>
  );
};

export default ExpenseTracker;
