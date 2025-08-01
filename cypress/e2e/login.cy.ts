describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/authentication/login')
    cy.clearLocalStorage()
  })

  it('should display login page correctly', () => {
    cy.contains('Please, enter your full name below')
    cy.contains('Only alphabetical characters are accepted')
    cy.get('input[placeholder="Your full name"]').should('be.visible')
    cy.contains('Are you older than 18 years old?')
    cy.get('button[type="submit"]').should('be.disabled')
    cy.get('img[alt="bee illustration"]').should('be.visible')
  })

  it('should validate form fields correctly', () => {
    cy.get('input[placeholder="Your full name"]').type('John')
    cy.get('[type="checkbox"]').check()
    cy.contains('Please enter your first and last name').should('be.visible')
    cy.get('button[type="submit"]').should('be.disabled')
    
    cy.get('input[placeholder="Your full name"]').clear().type('John123 Doe')
    cy.contains('Only alphabetical characters are allowed').should('be.visible')
    cy.get('button[type="submit"]').should('be.disabled')
    
    cy.get('input[placeholder="Your full name"]').clear().type('John Doe')
    cy.get('button[type="submit"]').should('not.be.disabled')
    
    cy.get('[type="checkbox"]').uncheck()
    cy.get('button[type="submit"]').should('be.disabled')
    
    cy.get('[type="checkbox"]').check()
    cy.get('button[type="submit"]').should('not.be.disabled')
  })

  it('should show required field error when name is empty', () => {
    cy.get('input[placeholder="Your full name"]').type(' ').clear()
    cy.contains('Full name is required').should('be.visible')
  })

  it('should log in successfully and redirect to dashboard', () => {
    cy.get('input[placeholder="Your full name"]').type('John Doe')
    cy.get('[type="checkbox"]').check()
    cy.get('button[type="submit"]').click()
    
    cy.url().should('include', '/dashboard')
    cy.contains('Hi, John').should('be.visible')
    
    cy.window().then(window => {
      const userData = JSON.parse(window.localStorage.getItem('user') || '{}')
      expect(userData.name).to.equal('John')
      expect(userData.surname).to.equal('Doe')
      expect(userData.fullName).to.equal('John Doe')
      expect(window.localStorage.getItem('session-expiry')).to.not.be.null
    })
  })
  
  it('should prevent form submission when pressing Enter if invalid', () => {
    cy.get('input[placeholder="Your full name"]').type('John{enter}')
    cy.url().should('include', '/authentication/login')
  })
})