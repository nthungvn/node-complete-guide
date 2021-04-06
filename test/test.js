const { expect } = require("chai");
const { it } = require("mocha");

it('should add numbers correctly', () => {
  const num1 = 3;
  const num2 = 3;
  expect(6).equal(num1 + num2);
});


it('should not give a result of 6', () => {
  const num1 = 5;
  const num2 = 3;
  expect(num1 + num2).not.to.equal(6);
});
