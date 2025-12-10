import { screen, render } from '@testing-library/react'
import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
  it('renders error message text', () => {
    render(<ErrorMessage message="Expense name is required" />)

    expect(screen.getByText('Expense name is required')).toBeInTheDocument()
  })

  it('applies testId when provided', () => {
    render(
      <ErrorMessage message="Error occurred" testId="error-message" />
    )

    expect(screen.getByTestId('error-message')).toBeInTheDocument()
  })

  it('renders with different messages', () => {
    const { rerender } = render(<ErrorMessage message="First error" />)

    expect(screen.getByText('First error')).toBeInTheDocument()

    rerender(<ErrorMessage message="Second error" />)

    expect(screen.getByText('Second error')).toBeInTheDocument()
    expect(screen.queryByText('First error')).not.toBeInTheDocument()
  })
})
