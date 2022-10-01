import {
  individuals,
  textInputs,
  formSites,
  calculateSite,
} from "../support/consts";
const singleInput = textInputs[0];
const largeNegative = "-999999999999999999999"; //Turned into a string as too big for int
const largeNegativeScientific = "-1.0E+21";

/*
 *  These tests check that the app allows/does not allow different types of input.
 *  Checks both valid and invalid inputs.
 *  Inputs need to be tested as they can affect the final calculation.
 */
describe("Single member input tests", () => {
  beforeEach(() => {
    cy.visit(formSites[0]);
  });

  it("should not accept a daily value greater than 7", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("8");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should("not.have.text", "Total Household points");
  });

  it("should not allow negative points", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("-1");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should("not.contain", "Total Household points: -1");
  });

  it("should not allow large negative points", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type(largeNegative);
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should(
      "not.contain",
      "Total Household points: " + largeNegativeScientific // number is too large so it turns into scientific form
    );
  });

  it("should only allow whole numbers", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("1.1");
    cy.get('input[type="submit"]').click();
    cy.url().should("not.eq", calculateSite);
    cy.get(".pb-6").should("not.contain", "Total Household points: 1.1");
  });

  it("should display 0 in the table when all inputs are empty", () => {
    singleInput.forEach((i) => {
      cy.get(`input[id=${i}]`).clear();
    });
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".px-4").contains("0");
    cy.contains("Total Household points: 0");
  });

  /*
   *  NOTE:
   *  It is not specified whether or not this number format is allowed.
   *  However, I have included a test to check for scientific format in case a decision on its validity is made in the future.
   */
  it("should not allow numbers in scientific format", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("-1e+24");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should("not.contain", "+24", { matchCase: false });
  });

  it("should allow leading 0s", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("00000001");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 1");
  });
});

/*
 *  These tests are extensions of the single member input tests,
 *  as they may function incorrectly with more members
 */
describe("Multiple member input tests", () => {
  beforeEach(() => {
    cy.visit(formSites[1]);
  });
  // removes text for one individual all
  it("should calculate correctly when one individual has empty input fields", () => {
    for (let i = 0; i < textInputs[0].length; i++) {
      cy.get(`input[id=${textInputs[0][i]}]`).clear(); // total = 0
      cy.get(`input[id=${textInputs[1][i]}]`).clear().type(i); // total = 21
      // therefore total household points should be 21 (0 + 21)
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 21");
    cy.contains(".mb-4", individuals[0]).should("contain", "0");
    cy.contains(".mb-4", individuals[1]).should("contain", "21");
  });

  it("should calculate correctly when one individual has leading 0s", () => {
    for (let i = 0; i < textInputs[0].length; i++) {
      cy.get(`input[id=${textInputs[0][i]}]`).clear().type(i); // total = 21
      cy.get(`input[id=${textInputs[1][i]}]`).clear().type("000000000001"); // total = 7
      // therefore total household points should be 28 (21 + 7)
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 28");
    cy.contains(".mb-4", individuals[0]).should("contain", "21");
    cy.contains(".mb-4", individuals[1]).should("contain", "7");
  });
});
