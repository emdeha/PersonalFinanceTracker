import styles from './ExpenseItem.module.css'
import type { Expense } from '../../types/expense.types'

type ExpenseItemProps = {
  readonly expense: Expense
}

export const ExpenseItem = ({ expense }: ExpenseItemProps) => {
  return (
    <div className={styles.item}>
      <div className={styles.name}>{expense.name}</div>
      <div className={styles.amount}>{expense.amount.toFixed(2)}</div>
    </div>
  )
}
