import styles from './ExpenseList.module.css'
import { ExpenseItem } from './ExpenseItem'
import { EmptyState } from './EmptyState'
import type { Expense } from '../../types/expense.types'

type ExpenseListProps = {
  readonly expenses: readonly Expense[]
  readonly testId?: string
}

export const ExpenseList = ({ expenses, testId }: ExpenseListProps) => {
  return (
    <div className={styles.list} data-testid={testId}>
      {expenses.length === 0 ? (
        <EmptyState message="No expenses added yet" />
      ) : (
        expenses.map((expense, index) => (
          <ExpenseItem key={index} expense={expense} />
        ))
      )}
    </div>
  )
}
