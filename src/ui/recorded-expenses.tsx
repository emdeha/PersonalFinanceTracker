import { amountShown } from '../domain/expense/expense-amount.ts';
import type { ExpenseLedger } from '../domain/expense/expense-ledger.ts';
import { nameShown } from '../domain/expense/expense-name.ts';

type RecordedExpensesProps = {
  readonly ledger: ExpenseLedger;
};

const RecordedExpenses = ({ ledger }: RecordedExpensesProps) => (
  <table>
    <caption>Recorded expenses</caption>
    <thead>
      <tr>
        <th scope="col">Expense</th>
        <th scope="col">Amount</th>
      </tr>
    </thead>
    <tbody>
      {ledger.expenses.map((expense, recordedAt) => (
        <tr key={recordedAt}>
          <td>{nameShown(expense.name)}</td>
          <td>{amountShown(expense.amount)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default RecordedExpenses;
