import { screen, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button onClick={() => {}}>Add Expense</Button>)

    expect(screen.getByText('Add Expense')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click Me</Button>)

    await user.click(screen.getByText('Click Me'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies testId when provided', () => {
    render(
      <Button onClick={() => {}} testId="test-button">
        Test
      </Button>
    )

    expect(screen.getByTestId('test-button')).toBeInTheDocument()
  })

  it('renders as a button element', () => {
    render(<Button onClick={() => {}}>Submit</Button>)

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })
})
