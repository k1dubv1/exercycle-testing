import {
  individuals,
  textInput_1,
  textInput_2,
  textInput_3,
  textInput_4,
  textInput_5,
  formSites,
  calculateSite,
} from "../support/consts";

// TODO - reduce duplication for all tests

/*
 *  These tests are extensions of the input tests in exercycle-form-individual.
 *  Only non-invalid and assumed-valid inputs are tested (as invalid inputs should not be allowed: see exercycle-form-individual)
 *  Input tests should be the same for all forms.
 */
describe("Input tests", () => {
  beforeEach(() => {
    cy.visit(formSites[1]);
  });
  // removes text for one individual all
  it("should calculate correctly when one individual has empty input fields", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear(); // total = 0
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(i); // total = 21
      // therefore total household points should be 21 (0 + 21)
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 21");
    cy.contains(".mb-4", individuals[0]).should("contain", "0");
    cy.contains(".mb-4", individuals[1]).should("contain", "21");
  });

  it("should calculate correctly when one individual has leading 0s", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(i); // total = 21
      cy.get(`input[id=${textInput_2[i]}]`).clear().type("000000000001"); // total = 7
      // therefore total household points should be 28 (21 + 7)
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 28");
    cy.contains(".mb-4", individuals[0]).should("contain", "21");
    cy.contains(".mb-4", individuals[1]).should("contain", "7");
  });
});

/*
 *   These tests check that the calculation works for 2 members.
 *   Only valid inputs are checked as invalid inputs are checked in other test suites/files.
 */
describe("2 people calculation tests", () => {
  beforeEach(() => {
    cy.visit(formSites[1]);
  });

  it("should redirect to the calculate page when submit button is clicked", () => {
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    //Should also display 0 household points as nothing was entered
    cy.contains("Total Household points: 0");
    //Checks that table has 2 rows. Should not have any more or less.
    cy.get("table").find("tr").should("have.length", 2);
  });

  it("should calculate the correct number of household points with individual values < 30", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(i); // total = 21
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(i); // total = 21
      // therefore total household points should be 42 (21 + 21)
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 42");
    cy.contains(".mb-4", individuals[0]).should("contain", "21");
    cy.contains(".mb-4", individuals[1]).should("contain", "21");
  });

  it("should calculate the correct number of household points with individual values << 30", () => {
    cy.get(`input[id=${textInput_1[0]}]`).clear().type(1); // total = 1
    cy.get(`input[id=${textInput_2[0]}]`).clear().type(1); // total = 1
    // therefore total household points should be 2 (1 + 1)

    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 2");
    cy.contains(".mb-4", individuals[0]).should("contain", "1");
    cy.contains(".mb-4", individuals[1]).should("contain", "1");
  });

  it("should calculate the correct number of household points with individual values > 30", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(5); // total = 35, but only 30 household points awarded
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(i); // total = 21
      // therefore total household points should be 51 (30 + 21)
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 51");
    cy.contains(".mb-4", individuals[0]).should("contain", "30");
    cy.contains(".mb-4", individuals[1]).should("contain", "21");
  });

  it("should calculate the correct number of household points with maximum individual points", () => {
    for (let i = 0; i < 6; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(5); // total = 30
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(5); // total = 30
      // therefore total household points should be 60 (30 + 30)
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 60");
    cy.contains(".mb-4", individuals[0]).should("contain", "30");
    cy.contains(".mb-4", individuals[1]).should("contain", "30");
  });
});

/*
 *   These tests check for correct calculation for 3 members
 *   Tests for the same criteria as the 2 member tests but for 3 members
 */
describe("3 people calculation tests", () => {
  beforeEach(() => {
    cy.visit(formSites[2]);
  });

  it("should redirect to the calculate page when submit button is clicked", () => {
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    //Should also display 0 household points as nothing was entered
    cy.contains("Total Household points: 0");
    //Checks that table has 3 rows. Should not have any more or less.
    cy.get("table").find("tr").should("have.length", 3);
  });

  it("should calculate the correct number of household points with individual values < 30", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(i); // total = 21
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(i); // total = 21
      cy.get(`input[id=${textInput_3[i]}]`).clear().type(i); // total = 21
      // therefore total household points should be 63
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 63");
    cy.contains(".mb-4", individuals[0]).should("contain", "21");
    cy.contains(".mb-4", individuals[1]).should("contain", "21");
    cy.contains(".mb-4", individuals[2]).should("contain", "21");
  });

  it("should calculate the correct number of household points with individual values << 30", () => {
    cy.get(`input[id=${textInput_1[0]}]`).clear().type(1); // total = 1
    cy.get(`input[id=${textInput_2[0]}]`).clear().type(1); // total = 1
    cy.get(`input[id=${textInput_3[0]}]`).clear().type(1); // total = 1
    // therefore total household points should be 3

    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 3");
    cy.contains(".mb-4", individuals[0]).should("contain", "1");
    cy.contains(".mb-4", individuals[1]).should("contain", "1");
    cy.contains(".mb-4", individuals[2]).should("contain", "1");
  });

  it("should calculate the correct number of household points with individual values > 30", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(5); // total = 35, but only 30 household points awarded
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(i); // total = 21
      cy.get(`input[id=${textInput_3[i]}]`).clear().type(1); // total = 7
      // therefore total household points should be 58
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 58");
    cy.contains(".mb-4", individuals[0]).should("contain", "30");
    cy.contains(".mb-4", individuals[1]).should("contain", "21");
    cy.contains(".mb-4", individuals[2]).should("contain", "7");
  });

  it("should calculate the correct number of household points with maximum individual points", () => {
    for (let i = 0; i < 6; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(5); // total = 30
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(5); // total = 30
      cy.get(`input[id=${textInput_3[i]}]`).clear().type(5); // total = 30
      // therefore total household points should be 90
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", calculateSite);
    cy.contains("Total Household points: 90");
    cy.contains(".mb-4", individuals[0]).should("contain", "30");
    cy.contains(".mb-4", individuals[1]).should("contain", "30");
    cy.contains(".mb-4", individuals[2]).should("contain", "30");
  });
});
