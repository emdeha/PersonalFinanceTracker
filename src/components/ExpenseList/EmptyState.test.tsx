import { screen, render } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState message="No expenses added yet" />)

    expect(screen.getByText('No expenses added yet')).toBeInTheDocument()
  })

  it('renders different messages', () => {
    const { rerender } = render(<EmptyState message="No data" />)

    expect(screen.getByText('No data')).toBeInTheDocument()

    rerender(<EmptyState message="Empty list" />)

    expect(screen.getByText('Empty list')).toBeInTheDocument()
  })
})
