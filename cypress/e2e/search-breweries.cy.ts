describe('Search Breweries Flow', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard')
  })

  it('should display search section correctly', () => {
    cy.contains('Add a new brewery').should('be.visible')
    cy.get('input[placeholder="Find for your new favorite brewery"]').should('be.visible')
    cy.get('button').contains('Search').should('be.visible')
  })

  it('should search for breweries and display results', () => {
    cy.intercept('GET', '**/breweries/search**', { 
      fixture: 'search-results.json'
    }).as('searchBreweries')

    cy.get('input[placeholder="Find for your new favorite brewery"]').type('test')
    cy.get('button').contains('Search').click()
    
    cy.wait('@searchBreweries')
    cy.contains('Test Brewery 1').should('be.visible')
    cy.contains('Test Brewery 2').should('be.visible')
  })

  it('should display error message when search fails', () => {
    cy.intercept('GET', '**/breweries/search**', {
      statusCode: 500,
      body: 'Server error'
    }).as('failedSearch')

    cy.get('input[placeholder="Find for your new favorite brewery"]').type('error')
    cy.get('button').contains('Search').click()
    
    cy.wait('@failedSearch')
    cy.contains('An error occurred while searching for breweries.').should('be.visible')
  })

  it('should show empty results message when no breweries match search', () => {
    cy.intercept('GET', '**/breweries/search**', {
      body: []
    }).as('emptySearch')

    cy.get('input[placeholder="Find for your new favorite brewery"]').type('nonexistent')
    cy.get('button').contains('Search').click()
    
    cy.wait('@emptySearch')
    cy.contains('No breweries found for the search query.').should('be.visible')
  })
})