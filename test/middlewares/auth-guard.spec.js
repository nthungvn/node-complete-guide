const { expect } = require('chai');
const { describe } = require('mocha');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const User = require('../../src/models/user');
const isAuthMiddleware = require('../../src/middlewares/auth-guard');

describe('Auth guard middleware', () => {
  it('should throw an error if no authorization header is present', async () => {
    const req = {
      headers: {},
    };
    let thrown;
    try {
      await isAuthMiddleware(req, {}, () => {});
    } catch (error) {
      thrown = error;
    }
    expect(thrown.message).to.equal('Not Authenticated');
  });

  it('should throw an error if the authorization header is only one string', async () => {
    const req = {
      headers: {
        authorization: 'Bearer',
      },
    };
    let thrown;
    try {
      await isAuthMiddleware(req, {}, () => {});
    } catch (error) {
      thrown = error;
    }
    expect(thrown.message).to.equal('Not Authenticated');
  });

  it('should get the userId if the token is valid', async () => {
    const req = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    };
    const verify = sinon.stub(jwt, 'verify').returns({ email: 'valid_id' });
    const findOne = sinon.stub(User, 'findOne').returns({ email: 'email' });

    await isAuthMiddleware(req, {}, () => {});
    verify.restore();
    findOne.restore();
    expect(verify.called).to.be.true;
    expect(req).to.have.property('user');
  });

  it('should throw an error if the token cannot be verified', async () => {
    const req = {
      headers: {
        authorization: 'Bearer wrong_token',
      },
    };
    let thrown;
    try {
      await isAuthMiddleware(req, {}, () => {});
    } catch (error) {
      thrown = error;
    }
    expect(thrown.message).to.equal('Not Authenticated');
  });
});
