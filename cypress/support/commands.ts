Cypress.Commands.add('login', (name = 'John', surname = 'Doe') => {
  cy.visit('/authentication/login')
  cy.get('input[placeholder="Your full name"]').type(`${name} ${surname}`)
  cy.get('[type="checkbox"]').check()
  cy.get('button').contains('Enter').click()
  cy.url().should('include', '/dashboard')
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(name?: string, surname?: string): Chainable<Element>
    }
  }
}

export {}