import { textInputs, formSites, calculateSite } from "../support/consts";
const singleInput = textInputs[0];
const largeNegative = "-999999999999999999999"; //Turned into a string as too big for int
const largeNegativeScientific = "-1.0E+21";
describe("General tests", () => {
  beforeEach(() => {
    cy.visit(formSites[0]);
  });

  it("should redirect to the calculate page when submit button is clicked", () => {
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    //Should also display 0 household points as nothing was entered
    cy.contains("Total Household points: 0");
  });
});

/*
 *  These tests check that calculation is working as intended.
 *  All inputs should be valid and follow the scheme rules.
 */

describe("Calculation tests", () => {
  //Visits page before each test
  beforeEach(() => {
    cy.visit(formSites[0]);
  });

  it("should display the same number when one daily value is inputted", () => {
    cy.get(`input[id=${singleInput[0]}]`).clear().type("1");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 1");
  });

  it("should display the same number when multiple values are inputted", () => {
    for (let i = 0; i < singleInput.length; i++) {
      // forEach not used here for variablilty in input values
      cy.get(`input[id=${singleInput[i]}]`)
        .clear()
        .type(i + 1);
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 28");
  });

  /*
   *  Individual points = 49
   *  This is over the maximum number of points that an individual can earn for their household (30).
   *  The individual should be able to earn all of these points (as per the daily limit).
   *  However, only 30 points shall be awarded per week per individual, excess points will not contribute to the household total.
   */
  it("should not have more than 30 weekly points when total daily points > 30", () => {
    singleInput.forEach((i) => {
      cy.get(`input[id=${i}]`).clear().type("7");
    });
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 30");
  });

  it("should calculate correctly when there are empty fields", () => {
    singleInput.forEach((i) => {
      cy.get(`input[id=${i}]`).clear().type(4);
    });
    cy.get(`input[id=${singleInput[0]}]`).clear();
    cy.get(`input[id=${singleInput[6]}]`).clear();
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 20");
  });
});
