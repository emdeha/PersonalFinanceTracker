import styles from './EmptyState.module.css'

type EmptyStateProps = {
  readonly message: string
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return <div className={styles.empty}>{message}</div>
}
