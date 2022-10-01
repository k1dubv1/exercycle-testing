describe("2 people tests", () => {
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/cycle/2");
  });

  it("should redirect to the calculate page when submit button is clicked", () => {
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    //Should also display 0 household points as nothing was entered
    cy.contains("Total Household points: 0");
    cy.get("table").find("tr").should("have.length", 2);
  });
});
