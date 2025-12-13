import App from './App'

describe('Add Multiple Expenses', () => {
  describe('Successfully add multiple valid expenses', () => {
    it('should add multiple expenses and display them in the list', () => {
      cy.mount(<App />)

      cy.get('[data-testid="expense-name-input"]').type('Coffee')
      cy.get('[data-testid="expense-amount-input"]').type('5')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-name-input"]').type('Lunch')
      cy.get('[data-testid="expense-amount-input"]').type('12.50')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-name-input"]').type('Bus fare')
      cy.get('[data-testid="expense-amount-input"]').type('2.75')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-list"]').within(() => {
        cy.get('[data-testid="expense-item"]').should('have.length', 3)
        cy.contains('Coffee').should('exist')
        cy.contains('5').should('exist')
        cy.contains('Lunch').should('exist')
        cy.contains('12.50').should('exist')
        cy.contains('Bus fare').should('exist')
        cy.contains('2.75').should('exist')
      })
    })
  })

  describe('Cannot add expense with empty name', () => {
    it('should not add expense and show error when name is empty', () => {
      cy.mount(<App />)

      cy.get('[data-testid="expense-amount-input"]').type('10')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="error-message"]').should('contain', 'Name is required')
      cy.get('[data-testid="expense-list"]').should('not.exist')
    })
  })

  describe('Cannot add expense with empty amount', () => {
    it('should not add expense and show error when amount is empty', () => {
      cy.mount(<App />)

      cy.get('[data-testid="expense-name-input"]').type('Lunch')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="error-message"]').should('contain', 'Amount is required')
      cy.get('[data-testid="expense-list"]').should('not.exist')
    })
  })

  describe('Cannot add expense with zero amount', () => {
    it('should not add expense and show error when amount is zero', () => {
      cy.mount(<App />)

      cy.get('[data-testid="expense-name-input"]').type('Free item')
      cy.get('[data-testid="expense-amount-input"]').type('0')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="error-message"]').should('contain', 'Amount must be greater than zero')
      cy.get('[data-testid="expense-list"]').should('not.exist')
    })
  })

  describe('Cannot add expense with negative amount', () => {
    it('should not add expense and show error when amount is negative', () => {
      cy.mount(<App />)

      cy.get('[data-testid="expense-name-input"]').type('Refund')
      cy.get('[data-testid="expense-amount-input"]').type('-20')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="error-message"]').should('contain', 'Amount must be greater than zero')
      cy.get('[data-testid="expense-list"]').should('not.exist')
    })
  })
})
