const { expect } = require('chai');
const { describe } = require('mocha');
const jwt = require('jsonwebtoken');


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
    jwt.verify = () => {
      return {
        email: 'valid_id',
      };
    };
    User.findOne = () => {
      return {}
    }

    await isAuthMiddleware(req, {}, () => {});
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
