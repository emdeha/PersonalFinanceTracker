import App from '../../src/App'

describe('Feature: Remove Expense', () => {
  beforeEach(() => {
    cy.mount(<App />)
  })

  describe('Scenario: Remove multiple expenses', () => {
    it('should remove expense when clicking the remove button for "Groceries"', () => {
      cy.get('[data-testid="expense-name-input"]').type('Groceries')
      cy.get('[data-testid="expense-amount-input"]').type('50.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-name-input"]').type('Coffee')
      cy.get('[data-testid="expense-amount-input"]').type('4.50')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-list"]')
        .should('contain', 'Groceries')
        .and('contain', 'Coffee')

      cy.contains('Groceries')
        .parent()
        .find('[data-testid="remove-expense-button"]')
        .click()

      cy.get('[data-testid="expense-list"]')
        .should('not.contain', 'Groceries')
        .and('contain', 'Coffee')
    })

    it('should remove expense when clicking the remove button for "Coffee"', () => {
      cy.get('[data-testid="expense-name-input"]').type('Groceries')
      cy.get('[data-testid="expense-amount-input"]').type('50.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-name-input"]').type('Coffee')
      cy.get('[data-testid="expense-amount-input"]').type('4.50')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.contains('Coffee')
        .parent()
        .find('[data-testid="remove-expense-button"]')
        .click()

      cy.get('[data-testid="expense-list"]')
        .should('not.contain', 'Coffee')
        .and('contain', 'Groceries')
    })

    it('should show "No expenses added yet" message when expense list is empty', () => {
      cy.get('[data-testid="expense-name-input"]').type('Groceries')
      cy.get('[data-testid="expense-amount-input"]').type('50.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-name-input"]').type('Coffee')
      cy.get('[data-testid="expense-amount-input"]').type('4.50')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.contains('Groceries')
        .parent()
        .find('[data-testid="remove-expense-button"]')
        .click()

      cy.contains('Coffee')
        .parent()
        .find('[data-testid="remove-expense-button"]')
        .click()

      cy.get('[data-testid="expense-list"]')
        .should('contain', 'No expenses added yet')
    })
  })

  describe('Scenario: Remove clears error messages', () => {
    it('should clear error message when removing an expense', () => {
      cy.get('[data-testid="expense-name-input"]').type('Groceries')
      cy.get('[data-testid="expense-amount-input"]').type('50.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="error-message"]')
        .should('contain', 'Expense name is required')

      cy.contains('Groceries')
        .parent()
        .find('[data-testid="remove-expense-button"]')
        .click()

      cy.get('[data-testid="error-message"]').should('not.exist')
    })
  })
})