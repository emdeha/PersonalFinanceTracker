import {
  addExpense,
  anExpense,
  expectProblemsNaming,
  expectRecordedExpenses,
  openTheExpenseTracker,
} from './record-expense.steps.tsx';

describe('ExpenseTrackerShould', () => {
  it('start_with_no_recorded_expenses_before_anything_is_added', () => {
    openTheExpenseTracker();

    expectRecordedExpenses([]);
  });

  it('show_the_expense_with_its_name_and_amount_when_it_is_added', async () => {
    const user = openTheExpenseTracker();

    await addExpense(user, anExpense({ name: 'Coffee', amount: '4.50' }));

    expectRecordedExpenses([{ name: 'Coffee', amount: '4.50' }]);
  });

  it('show_every_expense_when_several_are_added_one_after_another', async () => {
    const user = openTheExpenseTracker();

    await addExpense(user, anExpense({ name: 'Coffee', amount: '4.50' }));
    await addExpense(user, anExpense({ name: 'Rent', amount: '1200' }));

    expectRecordedExpenses([
      { name: 'Coffee', amount: '4.50' },
      { name: 'Rent', amount: '1200.00' },
    ]);
  });

  it('record_both_when_the_same_name_and_amount_are_added_twice', async () => {
    const user = openTheExpenseTracker();

    await addExpense(user, anExpense({ name: 'Coffee', amount: '4.50' }));
    await addExpense(user, anExpense({ name: 'Coffee', amount: '4.50' }));

    expectRecordedExpenses([
      { name: 'Coffee', amount: '4.50' },
      { name: 'Coffee', amount: '4.50' },
    ]);
  });

  it('refuse_the_entry_and_record_nothing_when_the_name_is_blank', async () => {
    const user = openTheExpenseTracker();

    await addExpense(user, anExpense({ name: '', amount: '4.50' }));

    expectRecordedExpenses([]);
    expectProblemsNaming([['name', 'Coffee']]);
  });

  it('refuse_the_entry_and_record_nothing_when_the_amount_is_not_a_number', async () => {
    const user = openTheExpenseTracker();

    await addExpense(user, anExpense({ name: 'Coffee', amount: 'abc' }));

    expectRecordedExpenses([]);
    expectProblemsNaming([['abc', '4.50']]);
  });

  it('report_both_problems_in_one_pass_when_the_name_and_the_amount_are_invalid', async () => {
    const user = openTheExpenseTracker();

    await addExpense(user, anExpense({ name: '', amount: '-5' }));

    expectRecordedExpenses([]);
    expectProblemsNaming([
      ['name', 'Coffee'],
      ['-5', '4.50'],
    ]);
  });

  it('keep_the_expenses_already_recorded_when_a_later_entry_is_refused', async () => {
    const user = openTheExpenseTracker();

    await addExpense(user, anExpense({ name: 'Coffee', amount: '4.50' }));
    await addExpense(user, anExpense({ name: 'Rent', amount: 'free' }));

    expectRecordedExpenses([{ name: 'Coffee', amount: '4.50' }]);
    expectProblemsNaming([['free', '4.50']]);
  });
});
