const textInput_1 = [
  "individual-1-1",
  "individual-1-2",
  "individual-1-3",
  "individual-1-4",
  "individual-1-5",
  "individual-1-6",
  "individual-1-7",
];

const textInput_2 = [
  "individual-2-1",
  "individual-2-2",
  "individual-2-3",
  "individual-2-4",
  "individual-2-5",
  "individual-2-6",
  "individual-2-7",
];

describe("2 people tests", () => {
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/cycle/2");
  });

  it("should redirect to the calculate page when submit button is clicked", () => {
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    //Should also display 0 household points as nothing was entered
    cy.contains("Total Household points: 0");
    //Checks that table has 2 rows. Should not have any more or less.
    cy.get("table").find("tr").should("have.length", 2);
  });

  it("should calculate the correct number of household points with individual values < 30", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(i); // total = 21
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(i); // total = 21
      // therefore total household points should be 42
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 42");
    cy.contains(".mb-4", "Individual 1").should("contain", "21");
    cy.contains(".mb-4", "Individual 2").should("contain", "21");
  });

  it("should calculate the correct number of household points with individual values > 30", () => {
    for (let i = 0; i < textInput_1.length; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(5); // total = 35, but only 30 household points awarded
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(i); // total = 21
      // therefore total household points should be 51
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 51");
    cy.contains(".mb-4", "Individual 1").should("contain", "30");
    cy.contains(".mb-4", "Individual 2").should("contain", "21");
  });

  it("should calculate the correct number of household points with maximum individual points", () => {
    for (let i = 0; i < 6; i++) {
      cy.get(`input[id=${textInput_1[i]}]`).clear().type(5); // total = 30
      cy.get(`input[id=${textInput_2[i]}]`).clear().type(5); // total = 30
      // therefore total household points should be 60
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 60");
    cy.contains(".mb-4", "Individual 1").should("contain", "30");
    cy.contains(".mb-4", "Individual 2").should("contain", "30");
  });
});
