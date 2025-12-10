import { screen, render } from '@testing-library/react'
import { ExpenseHeader } from './ExpenseHeader'

describe('ExpenseHeader', () => {
  it('renders title text', () => {
    render(<ExpenseHeader title="Personal Finance Tracker" />)

    expect(screen.getByText('Personal Finance Tracker')).toBeInTheDocument()
  })

  it('renders as h1 heading', () => {
    render(<ExpenseHeader title="My App" />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'My App' })
    ).toBeInTheDocument()
  })

  it('renders with different titles', () => {
    const { rerender } = render(<ExpenseHeader title="First Title" />)

    expect(screen.getByText('First Title')).toBeInTheDocument()

    rerender(<ExpenseHeader title="Second Title" />)

    expect(screen.getByText('Second Title')).toBeInTheDocument()
    expect(screen.queryByText('First Title')).not.toBeInTheDocument()
  })
})
