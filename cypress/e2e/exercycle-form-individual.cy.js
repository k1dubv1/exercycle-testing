//id of each input box
const textInput = [
  "individual-1-1",
  "individual-1-2",
  "individual-1-3",
  "individual-1-4",
  "individual-1-5",
  "individual-1-6",
  "individual-1-7",
];

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

/*  These tests check that the app allows/does not allow different types of input.
    Checks both valid and invalid inputs.
    As inputs can affect the final calculation, they need to be tested as they are possible causes of incorrect calculations.
*/

describe("Input tests", () => {
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/cycle/1");
  });

  it("should not accept a daily value greater than 7", () => {
    cy.get(`input[id=${textInput[0]}]`).clear().type("8");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.get(".pb-6").should("not.have.text", "Total Household Points");
  });

  it("should not allow negative points", () => {
    cy.get(`input[id=${textInput[0]}]`).clear().type("-1");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.get(".pb-6").should("not.contain", "Total Household points: -1");
  });

  it("should not allow decimals", () => {
    cy.get(`input[id=${textInput[0]}]`).clear().type("1.1");
    cy.get('input[type="submit"]').click();
    cy.url().should("not.contain", "calculate");
    cy.get(".pb-6").should("not.contain", "Total Household points: 1.1");
  });

  it("should display 0 in the table when all inputs are empty", () => {
    for (let i = 0; i < textInput.length; i++) {
      cy.get(`input[id=${textInput[i]}]`).clear();
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.get(".px-4").contains("0");
  });

  it("should not allow numbers in scientific format", () => {
    cy.get(`input[id=${textInput[0]}]`).clear().type("-1e+24");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.get(".pb-6").should("not.contain", "+24", { matchCase: false });
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
    cy.get(`input[id=${textInput[0]}]`).clear().type("1");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 1");
  });

  it("should display the same number when one multiple values are inputted", () => {
    for (let i = 0; i < textInput.length; i++) {
      cy.get(`input[id=${textInput[i]}]`)
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
    for (let i = 0; i < textInput.length; i++) {
      cy.get(`input[id=${textInput[i]}]`).clear().type("7");
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 30");
  });
});
