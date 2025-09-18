describe('When navigating to Home', () => {
  it('Shows Home', () => {
    cy.visit('http://localhost:5173/')
    cy.contains('Home')
  })
})
