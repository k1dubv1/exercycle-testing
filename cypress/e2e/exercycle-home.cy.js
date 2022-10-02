import { formSites } from "../support/consts";
const toForm = ["1", "2", "3", "4", "5"];
describe("The home page", () => {
  // Visits pages when their respective buttons are clicked
  it("Should redirect to the form pages", () => {
    toForm.forEach((i) => {
      // Returns to the home page after every iteration
      cy.visit("https://cycle.dia-sandbox.govt.nz/");
      cy.get(`a[href*=${i}]`).click();
      cy.url().should("eq", `${formSites[i - 1]}`);
    });
  });
});
