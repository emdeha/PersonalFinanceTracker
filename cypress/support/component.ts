import { mount } from 'cypress/react'

type CypressOptions = Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>

Cypress.Commands.add('getByLabelText', (label: string, options?: CypressOptions) => {
  return cy.get(`[aria-label="${label}"]`, options)
})

Cypress.Commands.add('getByRole', (role: string, options?: CypressOptions) => {
  return cy.get(`[role="${role}"]`, options)
})

Cypress.Commands.add('getByText', (text: string, options?: CypressOptions) => {
  return cy.contains(text, options) as unknown as Cypress.Chainable<JQuery<HTMLElement>>
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      getByLabelText: (label: string, options?: CypressOptions) => Chainable<JQuery<HTMLElement>>
      getByRole: (role: string, options?: CypressOptions) => Chainable<JQuery<HTMLElement>>
      getByText: (text: string, options?: CypressOptions) => Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('mount', mount)