/// <reference types="cypress" />

context("e2e", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:5500/index.html");
  });

  it(`결과창(#total)의 기본 값이 "0"이어야 한다.`, () => {
    cy.get("#total").should("have.text", "0");
  });

  it(`결과창(#total)이 "0"일 때 숫자(.digit)을 클릭하면 그 숫자가 결과값이 되어야 한다.`, () => {
    cy.get(".digit").contains("1").click();
    cy.get("#total").should("have.text", "1");
  });

  it(`결과창(#total)이 "0"일 때 숫자(.digit) "0"을 클릭하면 결과창(#total)에 "0"이 출력되어야 한다.`, () => {
    cy.get(".digit").contains("0").click();
    cy.get("#total").should("have.text", "0");
  });

  it(`숫자(.digit)를 연속해서 클릭할 때 그 숫자가 누적되어서 결과창(#total)에 출력되어야 한다.`, () => {
    cy.get(".digit").contains("2").click();
    cy.get(".digit").contains("3").click();
    cy.get(".digit").contains("4").click();
    cy.get("#total").should("have.text", "234");
  });

  it(`숫자(.digit)를 연속해서 클릭할 때 결과창에 값이 3글자 이하여야 하고, 더 추가하려고 하면 기존 출력을 유지하고 수정되지 않도록 한다.`, () => {
    cy.get(".digit").contains("2").click();
    cy.get(".digit").contains("3").click();
    cy.get(".digit").contains("4").click();
    cy.get(".digit").contains("5").click();
    cy.get(".digit").contains("6").click();
    cy.get("#total").should("have.text", "234");
  });

  it("'='를 제외한 연산자(.operation)을 눌렀을 때 결과창이 변하지 않아야 한다.", () => {
    cy.get(".digit").contains("2").click();
    cy.get(".digit").contains("3").click();
    cy.get(".digit").contains("4").click();
    cy.get(".operation").contains("X").click();
    cy.get("#total").should("have.text", "234");
  });

  it("아무 숫자(.digit)도 누르지 않고 '='를 제외한 연산자(.operation)을 클릭하고 숫자(.digit)를 클릭하고, '='를 클릭하면 결과창(#total)이 연산을 수행한 결과값이 되야 한다.", () => {
    cy.get(".operation").contains("+").click();
    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", "2");
  });
});
