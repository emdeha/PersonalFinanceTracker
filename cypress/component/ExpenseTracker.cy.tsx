import { ExpenseTracker } from '../../src/components/ExpenseTracker'

describe('ExpenseTracker Component', () => {
  beforeEach(() => {
    // Mount the component before each test
    cy.mount(<ExpenseTracker />)
  })

  describe('Initial UI Rendering', () => {
    it('should display all required form elements', () => {
      // Check for name input
      cy.getByLabelText('Expense Name').should('be.visible')

      // Check for amount input
      cy.getByLabelText('Amount').should('be.visible')

      // Check for Add button
      cy.getByRole('button', { name: 'Add' }).should('be.visible')

      // Check for expense table
      cy.getByRole('table').should('be.visible')
      cy.getByRole('table').should('contain', 'Name')
      cy.getByRole('table').should('contain', 'Amount')

      // Table should be initially empty (no expense rows)
      cy.getByRole('table')
        .find('tbody tr')
        .should('have.length', 0)
    })
  })

  describe('Valid Expense Addition', () => {
    it('should add a valid expense to the table', () => {
      const expenseName = 'Coffee'
      const expenseAmount = '5.99'

      // Enter expense name
      cy.getByLabelText('Expense Name').type(expenseName)
        .should('have.value', expenseName)

      // Enter expense amount
      cy.getByLabelText('Amount').type(expenseAmount)
        .should('have.value', expenseAmount)

      // Click Add button
      cy.getByRole('button', { name: 'Add' }).click()

      // Verify expense appears in table
      cy.getByRole('table').find('tbody tr').should('have.length', 1)
      cy.getByRole('table').should('contain', expenseName)
      cy.getByRole('table').should('contain', expenseAmount)

      // Verify form is cleared after submission
      cy.getByLabelText('Expense Name').should('have.value', '')
      cy.getByLabelText('Amount').should('have.value', '')
    })
  })

  describe('Multiple Expenses Management', () => {
    it('should add multiple expenses to the table', () => {
      const expenses = [
        { name: 'Coffee', amount: '5.99' },
        { name: 'Lunch', amount: '12.50' },
        { name: 'Transportation', amount: '8.75' }
      ]

      // Add each expense
      expenses.forEach(expense => {
        cy.getByLabelText('Expense Name').type(expense.name)
        cy.getByLabelText('Amount').type(expense.amount)
        cy.getByRole('button', { name: 'Add' }).click()
      })

      // Verify all expenses appear in table
      cy.getByRole('table').find('tbody tr').should('have.length', 3)

      // Verify each expense is displayed correctly
      expenses.forEach(expense => {
        cy.getByRole('table').should('contain', expense.name)
        cy.getByRole('table').should('contain', expense.amount)
      })
    })

    it('should display expenses in the order they were added', () => {
      const expenses = [
        { name: 'First Expense', amount: '10.00' },
        { name: 'Second Expense', amount: '20.00' },
        { name: 'Third Expense', amount: '30.00' }
      ]

      // Add expenses in specific order
      expenses.forEach(expense => {
        cy.getByLabelText('Expense Name').type(expense.name)
        cy.getByLabelText('Amount').type(expense.amount)
        cy.getByRole('button', { name: 'Add' }).click()
      })

      // Verify order is maintained
      cy.getByRole('table').find('tbody tr').eq(0).should('contain', 'First Expense')
      cy.getByRole('table').find('tbody tr').eq(1).should('contain', 'Second Expense')
      cy.getByRole('table').find('tbody tr').eq(2).should('contain', 'Third Expense')
    })
  })

  describe('Error Handling', () => {
    it('should show user-friendly error when name is empty', () => {
      // Enter amount but not name
      cy.getByLabelText('Amount').type('10.00')
      cy.getByRole('button', { name: 'Add' }).click()

      // Verify error message is displayed
      cy.getByText('Expense name is required').should('be.visible')

      // Verify no expense was added to table
      cy.getByRole('table').find('tbody tr').should('have.length', 0)

      // Verify form values are preserved for user convenience
      cy.getByLabelText('Amount').should('have.value', '10.00')
    })

    it('should show user-friendly error when amount is empty', () => {
      // Enter name but not amount
      cy.getByLabelText('Expense Name').type('Coffee')
      cy.getByRole('button', { name: 'Add' }).click()

      // Verify error message is displayed
      cy.getByText('Amount is required').should('be.visible')

      // Verify no expense was added to table
      cy.getByRole('table').find('tbody tr').should('have.length', 0)

      // Verify form values are preserved for user convenience
      cy.getByLabelText('Expense Name').should('have.value', 'Coffee')
    })

    it('should show user-friendly error when both fields are empty', () => {
      // Click Add without entering any data
      cy.getByRole('button', { name: 'Add' }).click()

      // Verify error message is displayed
      cy.getByText('Both expense name and amount are required').should('be.visible')

      // Verify no expense was added to table
      cy.getByRole('table').find('tbody tr').should('have.length', 0)
    })

    it('should show error when amount is not a valid number', () => {
      // Enter name and invalid amount
      cy.getByLabelText('Expense Name').type('Coffee')
      cy.getByLabelText('Amount').type('not-a-number')
      cy.getByRole('button', { name: 'Add' }).click()

      // Verify error message is displayed
      cy.getByText('Please enter a valid amount').should('be.visible')

      // Verify no expense was added to table
      cy.getByRole('table').find('tbody tr').should('have.length', 0)

      // Verify form values are preserved for user convenience
      cy.getByLabelText('Expense Name').should('have.value', 'Coffee')
      cy.getByLabelText('Amount').should('have.value', 'not-a-number')
    })

    it('should clear error message when user starts typing again', () => {
      // Trigger error by submitting empty form
      cy.getByRole('button', { name: 'Add' }).click()
      cy.getByText('Both expense name and amount are required').should('be.visible')

      // Start typing in name field
      cy.getByLabelText('Expense Name').type('Coffee')

      // Error should disappear
      cy.getByText('Both expense name and amount are required').should('not.exist')
    })
  })

  describe('Form Reset Behavior', () => {
    it('should clear form after successful expense addition', () => {
      // Add a valid expense
      cy.getByLabelText('Expense Name').type('Coffee')
      cy.getByLabelText('Amount').type('5.99')
      cy.getByRole('button', { name: 'Add' }).click()

      // Verify form is cleared
      cy.getByLabelText('Expense Name').should('have.value', '')
      cy.getByLabelText('Amount').should('have.value', '')

      // Verify focus returns to name input for better UX
      cy.getByLabelText('Expense Name').should('be.focused')
    })
  })
})