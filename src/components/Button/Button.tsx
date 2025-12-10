import styles from './Button.module.css'

type ButtonProps = {
  readonly children: React.ReactNode
  readonly onClick: () => void
  readonly testId?: string
}

export const Button = ({ children, onClick, testId }: ButtonProps) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      data-testid={testId}
      type="button"
    >
      {children}
    </button>
  )
}
