# exercycle-testing

## Description

A series of cypress tests that test the functionality of a web applcation. 

This application records each household member's daily exercycle points for a given week and then reports the total household points. 

## Test Files 

All test files can be found under [cypress/e2e](cypress/e2e).

* exercycle-home.cy.js: Contains tests for the [initial/home page](https://cycle.dia-sandbox.govt.nz/). 
* exercycle-form-individual.cy.js: Contains tests for only the [one person form](https://cycle.dia-sandbox.govt.nz/cycle/1).
* exercycle-form-multiple.cy.js: Contains tests for forms with multiple family members:
  * [2 members](https://cycle.dia-sandbox.govt.nz/cycle/2)
  * [3 members](https://cycle.dia-sandbox.govt.nz/cycle/3)
  * [4 members](https://cycle.dia-sandbox.govt.nz/cycle/4)
  * [5 members](https://cycle.dia-sandbox.govt.nz/cycle/5)

## Other information

Code is formatted with Prettier