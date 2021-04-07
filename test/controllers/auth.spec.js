const sinon = require('sinon');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const User = require('../../src/models/user');
const authController = require('../../src/controllers/auth');

describe('Auth Controller - Login', () => {
  it('should throw an error 500 if could not access database', async () => {
    const req = {
      body: {
        email: 'hung@hung.com',
        password: 'abc123',
      },
    };
    const findOne = sinon.stub(User, 'findOne').throws();
    let thrown;
    try {
      await authController.postLogin(req, {}, next);
    } catch (error) {
      findOne.restore();
      thrown = error;
    }
    expect(thrown.statusCode).to.equal(500);
  });
});

const next = (error) => {
  error.statusCode = error.statusCode || 500;
  throw error;
};
