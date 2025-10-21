import { mount } from 'cypress/react'

// Custom commands for Testing Library queries
Cypress.Commands.add('getByLabelText', (label, options) => {
  return cy.get(`[aria-label="${label}"]`, options)
})

Cypress.Commands.add('getByRole', (role, options) => {
  return cy.get(`[role="${role}"]`, options)
})

Cypress.Commands.add('getByText', (text, options) => {
  return cy.contains(text, options)
})

// Augment the Cypress namespace to include type definitions for
// custom commands.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      getByLabelText: (label: string, options?: unknown) => Chainable<JQuery<HTMLElement>>
      getByRole: (role: string, options?: unknown) => Chainable<JQuery<HTMLElement>>
      getByText: (text: string, options?: unknown) => Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('mount', mount)