import styles from './ExpenseHeader.module.css'

type ExpenseHeaderProps = {
  readonly title: string
}

export const ExpenseHeader = ({ title }: ExpenseHeaderProps) => {
  return <h1 className={styles.header}>{title}</h1>
}
