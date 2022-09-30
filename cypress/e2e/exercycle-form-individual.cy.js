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

describe("the one person form page", () => {
  //Visits page before each test
  beforeEach(() => {
    cy.visit("https://cycle.dia-sandbox.govt.nz/cycle/1");
  });

  it("should redirect to the calculate page when submit button is clicked", () => {
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    //Should also display 0 household points as nothing was entered
    cy.contains("Total Household points: 0");
  });

  it("should display the same number when one daily value is inputted", () => {
    cy.get(`input[id=${textInput[0]}]`).clear().type("1");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 1");
  });

  it("should display the same number when one multiple values are inputted", () => {
    cy.get(`input[id=${textInput[0]}]`).clear().type("1");
    cy.get(`input[id=${textInput[1]}]`).clear().type("3");
    cy.get(`input[id=${textInput[2]}]`).clear().type("2");
    cy.get(`input[id=${textInput[3]}]`).clear().type("5");
    cy.get(`input[id=${textInput[4]}]`).clear().type("2");
    cy.get(`input[id=${textInput[5]}]`).clear().type("3");
    cy.get(`input[id=${textInput[6]}]`).clear().type("1");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 17");
  });

  it("should not accept a daily value greater than 7", () => {
    cy.get(`input[id=${textInput[0]}]`).clear().type("8");
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.get(".pb-6").should("not.have.text", "Total Household Points");
  });

  it("should not have more than 30 weekly points when total daily points > 30", () => {
    //Total daily points = 35
    for (let i = 0; i < textInput.length; i++) {
      cy.get(`input[id=${textInput[i]}]`).clear().type("7");
    }
    cy.get('input[type="submit"]').click();
    cy.url().should("eq", "https://cycle.dia-sandbox.govt.nz/calculate");
    cy.contains("Total Household points: 30");
  });

  it("should not allow negative points", () => {
    cy.get(`input[id=${textInput[0]}]`).clear().type("-1");
    cy.get('input[type="submit"]').click();
    cy.get(".pb-6").should("not.contain", "Total Household points: -1");
  });

  it("should not allow decimals", () => {
    cy.get(`input[id=${textInput[0]}]`).clear().type("1.1");
    cy.get('input[type="submit"]').click();
    cy.url().should("not.contain", "calculate");
    cy.get(".pb-6").should("not.contain", "Total Household points: 1.1");
  });
});
