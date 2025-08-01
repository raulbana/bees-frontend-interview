describe('Favorites Flow', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/dashboard')
    
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user') || '{}')
      userData.favoriteBreweries = []
      win.localStorage.setItem('user', JSON.stringify(userData))
    })
    cy.reload()
  })

  it('should display empty favorites message initially', () => {
    cy.contains('You don\'t have any favorite brewery :(').should('be.visible')
  })

  it('should add brewery to favorites', () => {
    cy.intercept('GET', '**/breweries/search**', {
      fixture: 'search-results.json'
    }).as('searchBreweries')

    cy.get('input[placeholder="Find for your new favorite brewery"]').type('test')
    cy.get('button').contains('Search').click()
    cy.wait('@searchBreweries')

    cy.get('[aria-label="Add to favorites"]').first().click()
    
    cy.contains('You don\'t have any favorite brewery :(').should('not.exist')
    cy.get('h1').contains('Your favorite breweries').parent().parent().find('h2').contains('Test Brewery 1').should('be.visible')
  })

  it('should remove brewery from favorites', () => {
    cy.window().then((win) => {
      const userData = JSON.parse(win.localStorage.getItem('user') || '{}')
      userData.favoriteBreweries = [{
        id: 'brewery-1',
        name: 'Test Brewery 1',
        brewery_type: 'micro',
        address_1: '123 Test St',
        city: 'Test City',
        state_province: 'Test State',
        postal_code: '12345',
        country: 'Test Country',
        phone: '123-456-7890',
        website_url: 'https://test1.com',
        state: 'Test State',
        street: '123 Test St'
      }]
      win.localStorage.setItem('user', JSON.stringify(userData))
    })
    cy.reload()

    cy.get('h1').contains('Your favorite breweries').parent().parent().find('h2').contains('Test Brewery 1').should('be.visible')
    
    cy.get('[aria-label="Remove from favorites"]').click()
    
    cy.contains('You don\'t have any favorite brewery :(').should('be.visible')
  })
})