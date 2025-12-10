import styles from './Input.module.css'

type InputProps = {
  readonly type: 'text' | 'number'
  readonly value: string
  readonly onChange: (value: string) => void
  readonly placeholder: string
  readonly testId?: string
}

export const Input = ({
  type,
  value,
  onChange,
  placeholder,
  testId,
}: InputProps) => {
  return (
    <input
      className={styles.input}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      data-testid={testId}
    />
  )
}
