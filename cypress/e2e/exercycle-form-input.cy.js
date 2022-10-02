import {
  individuals,
  textInputs,
  formSites,
  calculateSite,
} from "../support/consts";
const singleInput = textInputs[0];
const largeNegative = "-999999999999999999999"; // In string format as number is too big for int
const largeNegativeScientific = "-1.0E+21";
const manyLeadingZeros = "000000000000000000000000000000000000000001"; // In string format as leading 0s will be removed as a number

/*
 *  These tests check that the app allows/does not allow different types of input.
 *  Checks both valid and invalid inputs.
 *  Inputs need to be tested as they can affect the final calculation.
 */
describe("Single member input tests", () => {
  beforeEach(() => {
    cy.visit(formSites[0]);
  });

  it("Should not accept a daily value greater than 7", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("8");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should("not.have.text", "Total Household points");
  });

  it("Should not allow negative points", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("-1");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should("not.contain", "Total Household points: -1");
    cy.contains(".mb-4", individuals[0]).should("not.contain", "-1");
  });

  it("Should not allow large negative points", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type(largeNegative);
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should(
      "not.contain",
      "Total Household points: " + largeNegativeScientific // Number is too large so it turns into scientific form
    );
    cy.contains(".mb-4", individuals[0]).should(
      "not.contain",
      largeNegativeScientific
    );
  });

  it("Should only allow whole numbers and no decimals", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("1.1");
    cy.get('input[type="submit"]').click();
    cy.url().should("not.eq", calculateSite);
    cy.get(".pb-6").should("not.contain", "Total Household points: 1.1");
  });

  it("Should display 0 in the table when all inputs are empty", () => {
    singleInput.forEach((i) => {
      cy.get(`input[id=${i}]`).clear();
    });
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 0");
    cy.contains(".mb-4", individuals[0]).should("contain", "0");
  });

  /*
   *  NOTE:
   *  It is not specified whether or not this number format is allowed.
   *  However, I have included a test to check for scientific format in case a decision on its validity is to made in the future.
   */
  it("Should not allow numbers in scientific format", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("-1e+24");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should("not.contain", "+24");
    cy.contains(".mb-4", individuals[0]).should("not.contain", "+24");
  });

  it("Should allow leading 0s", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("00000001");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 1");
    cy.contains(".mb-4", individuals[0]).should("contain", "1");
  });

  it("Should allow many leading 0s", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type(manyLeadingZeros);
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 1");
    cy.contains(".mb-4", individuals[0]).should("contain", "1");
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
  // Removes all input data for one individual
  it("Should calculate correctly and show correct table when one individual has empty input fields", () => {
    for (let i = 0; i < textInputs[0].length; i++) {
      cy.get(`input[id=${textInputs[0][i]}]`).clear(); // Total = 0
      cy.get(`input[id=${textInputs[1][i]}]`).clear().type(i); // Total = 21
    }
    // Therefore total household points should be 21 (0 + 21)
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 21");
    cy.contains(".mb-4", individuals[0]).should("contain", "0");
    cy.contains(".mb-4", individuals[1]).should("contain", "21");
  });

  it("Should calculate correctly and show correct table when one individual has leading 0s", () => {
    for (let i = 0; i < textInputs[0].length; i++) {
      cy.get(`input[id=${textInputs[0][i]}]`).clear().type(i); // Total = 21
      cy.get(`input[id=${textInputs[1][i]}]`).clear().type("000000000001"); // Total = 7
    }
    // Therefore total household points should be 28 (21 + 7)
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 28");
    cy.contains(".mb-4", individuals[0]).should("contain", "21");
    cy.contains(".mb-4", individuals[1]).should("contain", "7");
  });
});

/*
 *  These tests check for other inputs such as using arrow keys and pressing the enter button.
 */
describe("Alternative input tests", () => {
  beforeEach(() => {
    cy.visit(formSites[0]);
  });

  it("Should calculate correctly when updated with the up arrow key", () => {
    cy.get(`input[id=${textInputs[0][0]}]`).type("{upArrow}"); // Total = 1
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 1");
    cy.contains(".mb-4", individuals[0]).should("contain", "1");
  });

  it("Should calculate correctly when updated with the up and down arrow keys", () => {
    cy.get(`input[id=${textInputs[0][0]}]`)
      .type("{upArrow}")
      .type("{upArrow}")
      .type("{upArrow}")
      .type("{downArrow}"); // Total = 2
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 2");
    cy.contains(".mb-4", individuals[0]).should("contain", "2");
  });

  it("Should not allow more than 7 by using the up arrow", () => {
    for (let i = 0; i < 8; i++) {
      cy.get(`input[id=${textInputs[0][0]}]`).type("{upArrow}");
    }
    // Total = 8
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should("not.have.text", "Total Household points");
  });

  it("Should not allow negatives by using the down arrow", () => {
    cy.get(`input[id=${textInputs[0][0]}]`).type("{downArrow}"); // Total = -1
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.get(".pb-6").should("not.have.text", "Total Household points: -1");
    cy.contains(".mb-4", individuals[0]).should("not.contain", "-1");
  });

  it("Should redirect to the calculate page when enter key is pressed in the form", () => {
    cy.get(`input[id=${textInputs[0][0]}]`).type("{enter}");
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 0");
    cy.contains(".mb-4", individuals[0]).should("contain", "0");
  });
});
