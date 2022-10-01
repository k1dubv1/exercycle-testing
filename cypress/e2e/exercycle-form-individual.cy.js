import { textInput_1 } from "../support/consts";

describe("General tests", () => {
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/cycle/1");
  });

  it("should redirect to the calculate page when submit button is clicked", () => {
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    //Should also display 0 household points as nothing was entered
    cy.contains("Total Household points: 0");
  });
});

// TODO - reduce duplication (for all tests)

/*  These tests check that the app allows/does not allow different types of input.
    Checks both valid and invalid inputs.
    As inputs can affect the final calculation, they need to be tested as they are possible causes of incorrect calculations.
*/

describe("Input tests", () => {
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/cycle/1");
  });

  it("should not accept a daily value greater than 7", () => {
    cy.get(`input[id=${textInput_1[0]}]`).clear().type("8");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.get(".pb-6").should("not.have.text", "Total Household points");
  });

  it("should not allow negative points", () => {
    cy.get(`input[id=${textInput_1[0]}]`).clear().type("-1");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.get(".pb-6").should("not.contain", "Total Household points: -1");
  });

  it("should not allow decimals", () => {
    cy.get(`input[id=${textInput_1[0]}]`).clear().type("1.1");
    cy.get('input[type="submit"]').click();
    cy.url().should("not.contain", "calculate");
    cy.get(".pb-6").should("not.contain", "Total Household points: 1.1");
  });

  it("should display 0 in the table when all inputs are empty", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear();
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.get(".px-4").contains("0");
    cy.contains("Total Household points: 0");
  });

  it("should not allow numbers in scientific format", () => {
    cy.get(`input[id=${textInput_1[0]}]`).clear().type("-1e+24");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.get(".pb-6").should("not.contain", "+24", { matchCase: false });
  });

  it("should allow leading 0s", () => {
    cy.get(`input[id=${textInput_1[0]}]`).clear().type("00000001");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 1");
  });
});

/*  These tests check that calculation itself is working as intended. 
    All inputs should be valid and follow the scheme rules.
*/

describe("Calculation tests", () => {
  //Visits page before each test
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/cycle/1");
  });

  it("should display the same number when one daily value is inputted", () => {
    cy.get(`input[id=${textInput_1[0]}]`).clear().type("1");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 1");
  });

  it("should display the same number when one multiple values are inputted", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`)
        .clear()
        .type(i + 1);
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 28");
  });

  /*  Individual points = 49
      This is over the maximum number of points that an individual can earn for their household (30).
      The individual should be able to earn all of these points (as per the daily limit).
      However, only 30 points shall be awarded per week per individual, excess points will not contribute to the household total.
  */
  it("should not have more than 30 weekly points when total daily points > 30", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type("7");
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 30");
  });

  it("should calculate correctly when there are empty fields", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`)
        .clear()
        .type(i + 1);
    }
    cy.get(`input[id=${textInput_1[0]}]`).clear();
    cy.get(`input[id=${textInput_1[6]}]`).clear();
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 20");
  });
});
