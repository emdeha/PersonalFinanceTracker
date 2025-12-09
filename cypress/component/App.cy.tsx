import App from '../../src/App'

describe('Personal Finance Tracker - Expense Management', () => {
  beforeEach(() => {
    cy.mount(<App />)
  })

  describe('Scenario: Successfully adding a valid expense', () => {
    it('should add an expense with valid name and amount to the list', () => {
      cy.get('[data-testid="expense-name-input"]').type('Groceries')
      cy.get('[data-testid="expense-amount-input"]').type('50.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-list"]')
        .should('contain', 'Groceries')
        .and('contain', '50.00')
    })
  })

  describe('Scenario: Rejecting expense with empty name', () => {
    it('should show error message when expense name is empty', () => {
      cy.get('[data-testid="expense-amount-input"]').type('25.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Expense name is required')

      cy.get('[data-testid="expense-list"]').should('not.contain', '25.00')
    })
  })

  describe('Scenario: Rejecting expense with empty amount', () => {
    it('should show error message when amount is empty', () => {
      cy.get('[data-testid="expense-name-input"]').type('Coffee')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Amount is required')

      cy.get('[data-testid="expense-list"]').should('not.contain', 'Coffee')
    })
  })

  describe('Scenario: Rejecting expense with negative amount', () => {
    it('should show error message when amount is negative', () => {
      cy.get('[data-testid="expense-name-input"]').type('Refund')
      cy.get('[data-testid="expense-amount-input"]').type('-10.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Amount must be greater than zero')

      cy.get('[data-testid="expense-list"]').should('not.contain', 'Refund')
    })
  })

  describe('Scenario: Rejecting expense with zero amount', () => {
    it('should show error message when amount is zero', () => {
      cy.get('[data-testid="expense-name-input"]').type('Free Item')
      cy.get('[data-testid="expense-amount-input"]').type('0')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Amount must be greater than zero')

      cy.get('[data-testid="expense-list"]').should('not.contain', 'Free Item')
    })
  })

  describe('Scenario: Viewing multiple added expenses', () => {
    it('should display all added expenses in the list', () => {
      cy.get('[data-testid="expense-name-input"]').type('Groceries')
      cy.get('[data-testid="expense-amount-input"]').type('50.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-name-input"]').clear().type('Coffee')
      cy.get('[data-testid="expense-amount-input"]').clear().type('5.50')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-name-input"]').clear().type('Transport')
      cy.get('[data-testid="expense-amount-input"]').clear().type('15.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-list"]')
        .should('contain', 'Groceries')
        .and('contain', '50.00')
        .and('contain', 'Coffee')
        .and('contain', '5.50')
        .and('contain', 'Transport')
        .and('contain', '15.00')
    })
  })

  describe('Scenario: Viewing empty expense list', () => {
    it('should show message when no expenses have been added', () => {
      cy.get('[data-testid="expense-list"]')
        .should('contain', 'No expenses added yet')
    })
  })

  describe('Scenario: Form clears after successful submission', () => {
    it('should clear form fields after adding an expense', () => {
      cy.get('[data-testid="expense-name-input"]').type('Groceries')
      cy.get('[data-testid="expense-amount-input"]').type('50.00')
      cy.get('[data-testid="add-expense-button"]').click()

      cy.get('[data-testid="expense-name-input"]').should('have.value', '')
      cy.get('[data-testid="expense-amount-input"]').should('have.value', '')
    })
  })
})