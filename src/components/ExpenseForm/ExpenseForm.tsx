import { useState } from 'react'
import styles from './ExpenseForm.module.css'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'

type ExpenseFormProps = {
  readonly onAddExpense: (options: {
    name: string
    amount: string
  }) => void
}

export const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = () => {
    onAddExpense({ name, amount })
    setName('')
    setAmount('')
  }

  return (
    <div className={styles.form}>
      <div className={styles.accent} />
      <div className={styles.inputs}>
        <Input
          testId="expense-name-input"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Expense name"
        />
        <Input
          testId="expense-amount-input"
          type="number"
          value={amount}
          onChange={setAmount}
          placeholder="Amount"
        />
        <Button testId="add-expense-button" onClick={handleSubmit}>
          Add Expense
        </Button>
      </div>
    </div>
  )
}
