import {
  individuals,
  textInputs,
  formSites,
  calculateSite,
} from "../support/consts";

/*
 *  These tests check that the point calculation is correct for households with multiple members (2 - 5 members)
 *  All member numbers test for the same calculation requirements.
 */

for (let members = 2; members <= 5; members++) {
  describe(`${members} member calculation tests`, () => {
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

      /*
       *    Therefore total household points should = number of members * 14
       *    eg. 3 members -> 42 points
       */
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

      /*
       *    Therefore total household points should = number of members
       *    eg. 5 members -> 5 points
       */
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
       *    Therefore total household points should = (number of members - 1) * 14 + 30
       *                                            = number of members * 14 + 16
       *                                            (simplified for readability purposes)
       *    eg. 2 members -> 44 points
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
      /*
       *    Therefore total household points should = number of members * 30
       *    eg. 4 members -> 120 points
       */
      cy.get('input[type="submit"]').click();
      cy.url().should("eq", calculateSite);
      cy.contains("Total Household points: " + members * 30);
      for (let n = 0; n < members; n++) {
        cy.contains(".mb-4", individuals[n]).should("contain", "30");
      }
    });
  });
}
