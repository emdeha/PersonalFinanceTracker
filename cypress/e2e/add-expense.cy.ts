const APP_URL = 'http://localhost:5173/'

const nameField = () => cy.findByLabelText('Name')
const amountField = () => cy.findByLabelText('Amount')
const expenseRows = () => cy.findAllByRole('listitem')

const clickAdd = () => cy.findByRole('button', { name: 'Add' }).click()

const enterName = (name: string) => nameField().type(name)
const enterAmount = (amount: string) => amountField().type(amount)

const addExpense = ({ name, amount }: { name: string; amount: string }) => {
  enterName(name)
  enterAmount(amount)
  clickAdd()
}

const expectExpenseRow = ({ name, amount }: { name: string; amount: string }) =>
  expenseRows()
    .filter(`:contains("${name}")`)
    .filter(`:contains("${amount}")`)
    .should('have.length.at.least', 1)

const expectNoExpenseRows = () => cy.queryAllByRole('listitem').should('have.length', 0)

describe('Add an expense by name and amount', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.visit(APP_URL)
  })

  it('adds a valid expense', () => {
    enterName('Coffee')
    enterAmount('5')
    clickAdd()

    expectExpenseRow({ name: 'Coffee', amount: '5' })
  })

  it('clears the input fields after adding an expense', () => {
    enterName('Coffee')
    enterAmount('5')

    clickAdd()

    nameField().should('have.value', '')
    amountField().should('have.value', '')
  })

  it('adds multiple expenses', () => {
    addExpense({ name: 'Coffee', amount: '5' })

    addExpense({ name: 'Groceries', amount: '30' })

    expectExpenseRow({ name: 'Coffee', amount: '5' })
    expectExpenseRow({ name: 'Groceries', amount: '30' })
  })

  it('lists expenses in the order they were added', () => {
    addExpense({ name: 'Coffee', amount: '5' })

    addExpense({ name: 'Groceries', amount: '30' })

    expenseRows().eq(0).should('contain.text', 'Coffee')
    expenseRows().eq(1).should('contain.text', 'Groceries')
  })

  it('adds an expense with a decimal amount', () => {
    addExpense({ name: 'Coffee', amount: '4.50' })

    expectExpenseRow({ name: 'Coffee', amount: '4.50' })
  })

  it('adds two expenses with the same name', () => {
    addExpense({ name: 'Coffee', amount: '5' })

    addExpense({ name: 'Coffee', amount: '6' })

    expenseRows().filter(':contains("Coffee")').should('have.length', 2)
  })

  it('trims surrounding whitespace from the name', () => {
    addExpense({ name: '  Coffee  ', amount: '5' })

    expectExpenseRow({ name: 'Coffee', amount: '5' })
    expenseRows().first().invoke('text').should('match', /^Coffee/)
  })

  it('cannot add an expense without a name', () => {
    enterAmount('5')

    clickAdd()

    cy.findByText('Name is required').should('be.visible')
    expectNoExpenseRows()
  })

  it('cannot add an expense with a whitespace-only name', () => {
    addExpense({ name: '   ', amount: '5' })

    cy.findByText('Name is required').should('be.visible')
    expectNoExpenseRows()
  })

  it('cannot add an expense without an amount', () => {
    enterName('Coffee')

    clickAdd()

    cy.findByText('Amount is required').should('be.visible')
    expectNoExpenseRows()
  })

  const invalidAmounts = [
    { amount: 'abc', error: 'Amount must be a number' },
    { amount: '0', error: 'Amount must be greater than 0' },
    { amount: '-5', error: 'Amount must be greater than 0' },
  ]

  invalidAmounts.forEach(({ amount, error }) => {
    it(`cannot add an expense with the invalid amount "${amount}"`, () => {
      addExpense({ name: 'Coffee', amount })

      cy.findByText(error).should('be.visible')
      expectNoExpenseRows()
    })
  })

  it('keeps entered values when validation fails', () => {
    enterName('Coffee')

    clickAdd()

    nameField().should('have.value', 'Coffee')
  })

  it('removes the error after a successful add', () => {
    amountField().type('5')
    clickAdd()
    cy.findByText('Name is required').should('be.visible')

    nameField().type('Coffee')
    clickAdd()

    cy.findByRole('alert').should('not.exist')
  })
})
