describe('the initial page', () => {

  //TODO - visit the same page before each test

  //Firstly checks if the page can be accessed
  it('shows the initial page', () => {
    cy.visit('https://cycle.dia-sandbox.govt.nz/')
  })

  //Checks if there are buttons that can be pressed
  //TODO - get the buttons themselves and not the values
  it('contains buttons', () => {
    cy.visit('https://cycle.dia-sandbox.govt.nz/')
    cy.contains('1')
    cy.contains('2')
    cy.contains('3')
    cy.contains('4')
    cy.contains('5')
  })

  //Visits respective pages when buttons are clicked
  //TODO - combine into one test
  it('should redirect to the form page 1', () => {
    cy.visit('https://cycle.dia-sandbox.govt.nz/')
    cy.get('a[href*="1"]').click()
    cy.url().should("eq", 'https://cycle.dia-sandbox.govt.nz/cycle/1')
  })
  it('should redirect to the form page 2', () => {
    cy.visit('https://cycle.dia-sandbox.govt.nz/')
    cy.get('a[href*="2"]').click()
    cy.url().should("eq", 'https://cycle.dia-sandbox.govt.nz/cycle/2')
  })
  it('should redirect to the form page 1', () => {
    cy.visit('https://cycle.dia-sandbox.govt.nz/')
    cy.get('a[href*="3"]').click()
    cy.url().should("eq", 'https://cycle.dia-sandbox.govt.nz/cycle/3')
  })
  it('should redirect to the form page 1', () => {
    cy.visit('https://cycle.dia-sandbox.govt.nz/')
    cy.get('a[href*="4"]').click()
    cy.url().should("eq", 'https://cycle.dia-sandbox.govt.nz/cycle/4')
  })
  it('should redirect to the form page 1', () => {
    cy.visit('https://cycle.dia-sandbox.govt.nz/')
    cy.get('a[href*="5"]').click()
    cy.url().should("eq", 'https://cycle.dia-sandbox.govt.nz/cycle/5')
  })
})