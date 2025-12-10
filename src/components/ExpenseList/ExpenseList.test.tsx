import { screen, render } from '@testing-library/react'
import { ExpenseList } from './ExpenseList'
import type { Expense } from '../../types/expense.types'

describe('ExpenseList', () => {
  it('renders multiple expense items', () => {
    const expenses: readonly Expense[] = [
      { name: 'Groceries', amount: 50.0 },
      { name: 'Coffee', amount: 5.5 },
      { name: 'Transport', amount: 15.0 },
    ]

    render(<ExpenseList expenses={expenses} />)

    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('50.00')).toBeInTheDocument()
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('5.50')).toBeInTheDocument()
    expect(screen.getByText('Transport')).toBeInTheDocument()
    expect(screen.getByText('15.00')).toBeInTheDocument()
  })

  it('shows empty state when no expenses', () => {
    render(<ExpenseList expenses={[]} />)

    expect(screen.getByText('No expenses added yet')).toBeInTheDocument()
  })

  it('applies testId when provided', () => {
    render(<ExpenseList expenses={[]} testId="expense-list" />)

    expect(screen.getByTestId('expense-list')).toBeInTheDocument()
  })

  it('does not show empty state when expenses exist', () => {
    const expenses: readonly Expense[] = [{ name: 'Test', amount: 10 }]

    render(<ExpenseList expenses={expenses} />)

    expect(
      screen.queryByText('No expenses added yet')
    ).not.toBeInTheDocument()
  })
})
