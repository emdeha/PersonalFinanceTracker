import { screen, render } from '@testing-library/react'
import { ExpenseItem } from './ExpenseItem'
import type { Expense } from '../../types/expense.types'

describe('ExpenseItem', () => {
  it('renders expense name and formatted amount', () => {
    const expense: Expense = { name: 'Groceries', amount: 50.0 }

    render(<ExpenseItem expense={expense} />)

    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('50.00')).toBeInTheDocument()
  })

  it('formats decimal amounts correctly', () => {
    const expense: Expense = { name: 'Coffee', amount: 5.5 }

    render(<ExpenseItem expense={expense} />)

    expect(screen.getByText('5.50')).toBeInTheDocument()
  })

  it('handles large amounts', () => {
    const expense: Expense = { name: 'Rent', amount: 1250.99 }

    render(<ExpenseItem expense={expense} />)

    expect(screen.getByText('1250.99')).toBeInTheDocument()
  })
})
