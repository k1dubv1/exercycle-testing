import { toForm } from "../support/consts";

describe("the initial page", () => {
  //Visits pages when their respective buttons are clicked | NOTE: beforeEach redundant
  it("should redirect to the form pages", () => {
    toForm.forEach((i) => {
      //Returns to the home page after every iteration
      cy.visit("https://cycle.dia-sandbox.govt.nz/");
      cy.get(`a[href*=${i}]`).click();
      cy.url().should("eq", `https://cycle.dia-sandbox.govt.nz/cycle/${i}`);
    });
  });
});
