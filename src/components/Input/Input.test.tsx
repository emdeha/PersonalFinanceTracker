import { screen, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renders with initial value', () => {
    render(
      <Input
        type="text"
        value="Test Value"
        onChange={() => {}}
        placeholder="Enter text"
      />
    )

    expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    const { rerender } = render(
      <Input
        type="text"
        value=""
        onChange={handleChange}
        placeholder="Enter text"
      />
    )

    const input = screen.getByPlaceholderText('Enter text')

    await user.type(input, 'H')
    expect(handleChange).toHaveBeenCalledWith('H')

    rerender(
      <Input
        type="text"
        value="Hello"
        onChange={handleChange}
        placeholder="Enter text"
      />
    )

    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument()
  })

  it('applies placeholder text', () => {
    render(
      <Input
        type="text"
        value=""
        onChange={() => {}}
        placeholder="Expense name"
      />
    )

    expect(screen.getByPlaceholderText('Expense name')).toBeInTheDocument()
  })

  it('applies testId when provided', () => {
    render(
      <Input
        type="text"
        value=""
        onChange={() => {}}
        placeholder="Test"
        testId="test-input"
      />
    )

    expect(screen.getByTestId('test-input')).toBeInTheDocument()
  })

  it('handles number type input', () => {
    render(
      <Input
        type="number"
        value="42"
        onChange={() => {}}
        placeholder="Amount"
      />
    )

    const input = screen.getByPlaceholderText('Amount')
    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveValue(42)
  })

  it('renders as an input element', () => {
    render(
      <Input
        type="text"
        value=""
        onChange={() => {}}
        placeholder="Enter text"
      />
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
