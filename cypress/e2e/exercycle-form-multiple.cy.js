import {
  individuals,
  textInputs,
  formSites,
  calculateSite,
} from "../support/consts";

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

/*
 *  These tests check that the point calculation is correct for households with multiple members (2 - 5 members)
 *  All member numbers have the same tests.
 */

for (let members = 2; members <= 5; members++) {
  describe(`${members} people calculation tests`, () => {
    beforeEach(() => {
      cy.visit(formSites[members - 1]);
    });

    it("should redirect to the calculate page when submit button is clicked", () => {
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", calculateSite);

      //Should also display 0 household points as nothing was entered
      cy.contains("Total Household points: 0");

      //Checks that table has the correct number of rows.
      cy.get("table").find("tr").should("have.length", members);
    });

    it("should calculate the correct number of household points with individual values < 30", () => {
      for (let m = 0; m < members; m++) {
        textInputs[m].forEach((memberDay) => {
          cy.get(`input[id=${memberDay}]`).clear().type(2); // total = 14
        });
      }

      // therefore total household points should = number of members * 14
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", calculateSite);
      cy.contains("Total Household points: " + members * 14);
      for (let n = 0; n < members; n++) {
        cy.contains(".mb-4", individuals[n]).should("contain", "14");
      }
    });

    it("should calculate the correct number of household points with individual values << 30", () => {
      for (let m = 0; m < members; m++) {
        cy.get(`input[id=${textInputs[m][0]}]`).clear().type(1); // total = 1
      }

      // therefore total household points should = number of members
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", calculateSite);
      cy.contains("Total Household points: " + members);
      for (let n = 0; n < members; n++) {
        cy.contains(".mb-4", individuals[n]).should("contain", "1");
      }
    });

    it("should calculate the correct number of household points with individual values > 30", () => {
      for (let m = 0; m < members; m++) {
        textInputs[m].forEach((memberDay) => {
          if (m == members - 1) {
            cy.get(`input[id=${memberDay}]`).clear().type(5); // total = 35, but only 30 household points awarded
          } else {
            cy.get(`input[id=${memberDay}]`).clear().type(2); // total = 14
          }
        });
      }

      /*
       *    therefore total household points should = (number of members - 1) * 14 + 30
       *                                            = number of members * 14 + 16
       *                                            (simplified for readability purposes)
       */
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", calculateSite);
      cy.contains("Total Household points: " + (members * 14 + 16));
      for (let n = 0; n < members; n++) {
        if (n == members - 1) {
          cy.contains(".mb-4", individuals[n]).should("contain", "30");
        } else {
          cy.contains(".mb-4", individuals[n]).should("contain", "14");
        }
      }
    });

    it("should calculate the correct number of household points with maximum individual points", () => {
      for (let m = 0; m < members; m++) {
        for (let i = 0; i < 6; i++) {
          cy.get(`input[id=${textInputs[m][i]}]`).clear().type(5); // total = 30
        }
      }
      // therefore total household points should = number of members members * 30
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", calculateSite);
      cy.contains("Total Household points: " + members * 30);
      for (let n = 0; n < members; n++) {
        cy.contains(".mb-4", individuals[n]).should("contain", "30");
      }
    });
  });
}
