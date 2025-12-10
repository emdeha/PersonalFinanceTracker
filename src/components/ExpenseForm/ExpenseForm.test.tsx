import { screen, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ExpenseForm } from './ExpenseForm'

describe('ExpenseForm', () => {
  it('renders name input, amount input, and button', () => {
    render(<ExpenseForm onAddExpense={() => {}} />)

    expect(screen.getByPlaceholderText('Expense name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Add Expense')).toBeInTheDocument()
  })

  it('calls onAddExpense with form data when submitted', async () => {
    const user = userEvent.setup()
    const handleAddExpense = vi.fn()

    render(<ExpenseForm onAddExpense={handleAddExpense} />)

    await user.type(screen.getByPlaceholderText('Expense name'), 'Coffee')
    await user.type(screen.getByPlaceholderText('Amount'), '5.50')
    await user.click(screen.getByText('Add Expense'))

    expect(handleAddExpense).toHaveBeenCalledWith({
      name: 'Coffee',
      amount: '5.5',
    })
  })

  it('clears form after submission', async () => {
    const user = userEvent.setup()
    const handleAddExpense = vi.fn()

    render(<ExpenseForm onAddExpense={handleAddExpense} />)

    const nameInput = screen.getByPlaceholderText('Expense name')
    const amountInput = screen.getByPlaceholderText('Amount')

    await user.type(nameInput, 'Test')
    await user.type(amountInput, '100')
    await user.click(screen.getByText('Add Expense'))

    expect(nameInput).toHaveValue('')
    expect(amountInput).toHaveValue(null)
  })

  it('applies data-testid to inputs and button', () => {
    render(<ExpenseForm onAddExpense={() => {}} />)

    expect(screen.getByTestId('expense-name-input')).toBeInTheDocument()
    expect(screen.getByTestId('expense-amount-input')).toBeInTheDocument()
    expect(screen.getByTestId('add-expense-button')).toBeInTheDocument()
  })
})
