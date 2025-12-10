import styles from './ErrorMessage.module.css'

type ErrorMessageProps = {
  readonly message: string
  readonly testId?: string
}

export const ErrorMessage = ({ message, testId }: ErrorMessageProps) => {
  return (
    <div className={styles.error} data-testid={testId}>
      {message}
    </div>
  )
}
