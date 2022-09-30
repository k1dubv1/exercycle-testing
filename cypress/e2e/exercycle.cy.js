const toForm = ["1", "2", "3", "4", "5"];

describe("the initial page", () => {
  //Visits page before each test
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/");
  });

  //Visits respective pages when buttons are clicked
  it("should redirect to the form pages", () => {
    for (let i = 0; i < toForm.length; i++) {
      cy.visit("https://cycle.dia-sandbox.govt.nz/");
      cy.get(`a[href*=${toForm[i]}]`).click();
      cy.url().should(
        "eq",
        `https://cycle.dia-sandbox.govt.nz/cycle/${toForm[i]}`
      );
    }
  });
});
