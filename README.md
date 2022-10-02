# Exercycle Cypress Tests

## Description

A series of cypress tests that test the functionality of a web applcation. 

This application records each household member's daily exercycle points for a given week and then reports the total household points. Households can be rewarded financially for generating power on an exercycle.

## Test Files 

All test files can be found under [cypress/e2e](cypress/e2e).

* [exercycle-home](./cypress/e2e/exercycle-home.cy.js): Contains tests for the [initial/home page](https://cycle.dia-sandbox.govt.nz/). 
* [exercycle-form-input](./cypress/e2e/exercycle-form-input.cy.js): Contains tests regarding the input of data for all forms. 
* [exercycle-form-individual](./cypress/e2e/exercycle-form-individual.cy.js): Contains tests regarding the points calculation for one person.
* [exercycle-form-multiple](./cypress/e2e/exercycle-form-multiple.cy.js): Contains tests regarding the points calculation for multiple household members (2-5+).

## Other important files

* [consts](./cypress/support/consts.js): Constants used in test files.
* [TestReport-Final](./documents/TestReport-Final.pdf): Test report summarising tests done for this project.

## Other information

Code is formatted with Prettier
