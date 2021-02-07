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

  it(`숫자(.digit)를 연속해서 클릭할 때 결과창에 값이 3자리수 이하여야 하고, 더 추가하려고 하면 기존 출력을 유지하고 수정되지 않도록 한다.`, () => {
    cy.get(".digit").contains("2").click();
    cy.get(".digit").contains("3").click();
    cy.get(".digit").contains("4").click();
    cy.get(".digit").contains("5").click();
    cy.get(".digit").contains("6").click();
    cy.get("#total").should("have.text", "234");

    cy.get(".modifier").click();

    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("-").click();
    cy.get(".digit").contains("3").click();
    cy.get(".digit").contains("1").click();
    cy.get(".digit").contains("1").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", "-309");
  });

  it("'='를 제외한 연산자(.operation)을 눌렀을 때 결과창이 변하지 않아야 한다.", () => {
    cy.get(".digit").contains("2").click();
    cy.get(".digit").contains("3").click();
    cy.get(".digit").contains("4").click();
    cy.get(".operation").contains("X").click();
    cy.get("#total").should("have.text", "234");
  });

  it("결과창에 0이 있는 상태에서 연산자(.operation)를 클릭하면, 0에 연산을 수행한 결과가 결과창(#total)에 나와야 한다.", () => {
    cy.get(".operation").contains("X").click();
    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", "0");
  });

  it("숫자를 클릭하고, 연산자를 클릭하고, 숫자를 클릭하고, =을 클릭하면 결과창에 연산 결과가 출력되어야 한다.", () => {
    for (let i = 0; i < 5; i++) {
      const num1 = Math.floor(Math.random() * 10);
      const num2 = Math.floor(Math.random() * 10);
      cy.get(".digit").contains(num1).click();
      cy.get(".operation").contains("+").click();
      cy.get(".digit").contains(num2).click();
      cy.get(".operation").contains("=").click();
      cy.get("#total").should("have.text", `${num1 + num2}`);
      cy.get(".modifier").click();
    }
  });

  it(`올클리어(.modifier)를 누르면 결과창(#total)의 값이 "0"이 된다.`, () => {
    cy.get(".digit").contains("2").click();
    cy.get(".modifier").click();
    cy.get("#total").should("have.text", `0`);
    cy.get(".digit").contains("5").click();
    cy.get(".operation").contains("+").click();
    cy.get(".digit").contains("9").click();
    cy.get(".modifier").click();
    cy.get("#total").should("have.text", `0`);
  });

  it(`올클리어(.modifier)를 누르면 초기 상태로 돌아가고, 다음 연산을 수행할 수 있다.`, () => {
    cy.get(".digit").contains("2").click();
    cy.get(".modifier").click();
    cy.get(".digit").contains("5").click();
    cy.get(".operation").contains("+").click();
    cy.get(".digit").contains("9").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `14`);
  });

  it(`등호를 눌러 나온 결과값을 이용해 연산을 해야 한다.`, () => {
    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("+").click();
    cy.get(".digit").contains("5").click();
    cy.get(".operation").contains("=").click();
    cy.get(".operation").contains("X").click();
    cy.get(".digit").contains("3").click();
    cy.get(".operation").contains("=").click();
    cy.get(".operation").contains("-").click();
    cy.get(".digit").contains("1").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `20`);
  });

  it(`계산 결과를 표현할 때 소수점 이하는 버림한다.`, () => {
    cy.get(".digit").contains("1").click();
    cy.get(".digit").contains("0").click();
    cy.get(".operation").contains("/").click();
    cy.get(".digit").contains("3").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `3`);
  });

  it(`'='를 제외한 연산자(.operation)를 누르자 마자 '='를 누르면 op1, op2가 결과창의 값이 되고, 연산자는 직전에 눌렀던 연산자가 되어 연산한다.`, () => {
    cy.get(".digit").contains("9").click();
    cy.get(".operation").contains("+").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `18`);
  });

  it(`'='을 연속해서 누르면, 결과창(#total)에 있는 값을 op1, 최초로 '='을 눌렀을 때의 op2를 op2로 써서 연산한다.`, () => {
    cy.get(".digit").contains("1").click();
    cy.get(".operation").contains("+").click();
    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `3`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `5`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `7`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `9`);

    cy.get(".modifier").click();

    cy.get(".digit").contains("9").click();
    cy.get(".operation").contains("-").click();
    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `7`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `5`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `3`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `1`);

    cy.get(".modifier").click();

    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("X").click();
    cy.get(".digit").contains("3").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `6`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `18`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `54`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `162`);

    cy.get(".modifier").click();

    cy.get(".digit").contains("1").click();
    cy.get(".digit").contains("2").click();
    cy.get(".digit").contains("8").click();
    cy.get(".operation").contains("/").click();
    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `64`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `32`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `16`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `8`);
  });

  it("0으로 나누려고 하면 alert로 경고 메시지를 출력하고, 결과창에는 '오류'를 출력한다.", () => {
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get(".digit").contains("3").click();
    cy.get(".operation").contains("/").click();
    cy.get(".digit").contains("0").click();
    cy.get(".operation")
      .contains("=")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("0으로 나눌 수 없습니다.");
      });
    cy.get("#total").should("have.text", `오류`);
  });

  it("'오류'가 출력된 상태에서 숫자, 올클리어 이외의 버튼을 클릭하면 내부적으로 아무런 동작이 되지 않도록 한다.", () => {
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get(".digit").contains("3").click();
    cy.get(".operation").contains("/").click();
    cy.get(".digit").contains("0").click();
    cy.get(".operation")
      .contains("=")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("0으로 나눌 수 없습니다.");
      });
    cy.get("#total").should("have.text", `오류`);
    cy.get(".operation").contains("/").click();
    cy.get("#total").should("have.text", `오류`);
    cy.get(".operation").contains("-").click();
    cy.get(".operation").contains("+").click();
    cy.get(".operation").contains("X").click();
    cy.get("#total").should("have.text", `오류`);
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `오류`);
  });

  it("'오류'가 출력된 상태에서 숫자를 클릭하면 결과창에 그 숫자가 출력되고, 그 숫자로 연산이 가능하다.", () => {
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get(".digit").contains("3").click();
    cy.get(".operation").contains("/").click();
    cy.get(".digit").contains("0").click();
    cy.get(".operation")
      .contains("=")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("0으로 나눌 수 없습니다.");
      });
    cy.get("#total").should("have.text", `오류`);
    cy.get(".digit").contains("3").click();
    cy.get("#total").should("have.text", `3`);
    cy.get(".operation").contains("-").click();
    cy.get(".digit").contains("1").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `2`);
  });

  it("'오류'가 출력된 상태에서 올클리어(.modifier)를 누르면 초기 상태로 돌아가고, 다음 연산을 수행할 수 있다.", () => {
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get(".digit").contains("3").click();
    cy.get(".operation").contains("/").click();
    cy.get(".digit").contains("0").click();
    cy.get(".operation")
      .contains("=")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("0으로 나눌 수 없습니다.");
      });
    cy.get("#total").should("have.text", `오류`);
    cy.get(".modifier").click();
    cy.get("#total").should("have.text", `0`);
    cy.get(".digit").contains("7").click();
    cy.get(".digit").contains("7").click();
    cy.get(".operation").contains("/").click();
    cy.get(".digit").contains("1").click();
    cy.get(".digit").contains("1").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `7`);
  });

  it("'='을 누른 후에 숫자를 누르면 기존의 연산 결과에 누적되지 않고 새로운 숫자로 입력된다.", () => {
    cy.get(".digit").contains("1").click();
    cy.get(".operation").contains("+").click();
    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `3`);
    cy.get(".digit").contains("9").click();
    cy.get("#total").should("have.text", `9`);
    cy.get(".operation").contains("X").click();
    cy.get(".digit").contains("2").click();
    cy.get(".operation").contains("=").click();
    cy.get("#total").should("have.text", `18`);
  });
});
