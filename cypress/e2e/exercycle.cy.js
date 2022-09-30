describe("the initial page", () => {
  //Visits page before each test
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/");
  });

  //Visits respective pages when buttons are clicked
  //TODO - combine into one test
  it("should redirect to the form page 1", () => {
    cy.get('a[href*="1"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/cycle/1");
  });
  it("should redirect to the form page 2", () => {
    cy.get('a[href*="2"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/cycle/2");
  });
  it("should redirect to the form page 1", () => {
    cy.get('a[href*="3"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/cycle/3");
  });
  it("should redirect to the form page 1", () => {
    cy.get('a[href*="4"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/cycle/4");
  });
  it("should redirect to the form page 1", () => {
    cy.get('a[href*="5"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/cycle/5");
  });
});
