import { toForm } from "../support/consts";

describe("the initial page", () => {
  //Visits page before each test
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/");
  });

  //Visits pages when their respective buttons are clicked
  it("should redirect to the form pages", () => {
    for (let i = 0; i < toForm.length; i++) {
      //Returns to the home page after every iteration
      cy.visit("https://cycle.dia-sandbox.govt.nz/");
      cy.get(`a[href*=${toForm[i]}]`).click();
      cy.url().should(
        "eq",
        `https://cycle.dia-sandbox.govt.nz/cycle/${toForm[i]}`
      );
    }
  });
});
