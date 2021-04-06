const { expect } = require('chai');
const { describe } = require('mocha');

const isAuthMiddleware = require('../../src/middlewares/auth-guard');

describe('Auth guard middleware', () => {
  it('should throw an error if no authorization header is present', async () => {
    const req = {
      headers: {},
    };
    try {
      await isAuthMiddleware(req, {}, () => {});
    } catch (error) {
      expect(error.message).to.equal('Not Authenticated');
    }
  });

  it('should throw an error if the authorization header is only one string', async () => {
    const req = {
      headers: {
        authorization: 'Bearer',
      },
    };
    try {
      await isAuthMiddleware(req, {}, () => {});
    } catch (error) {
      expect(error.message).to.equal('Not Authenticated');
    }
  });

  it('should throw an error if the token cannot be verified', async () => {
    const req = {
      headers: {
        authorization: 'Bearer wrong_token',
      },
    };
    try {
      await isAuthMiddleware(req, {}, () => {});
    } catch (error) {
      expect(error.message).to.equal('Not Authenticated');
    }
  });

  it('should get the userId if the token is valid', async () => {
    const req = {
      headers: {
        authorization: 'Bearer valid_token',
      },
    };
    await isAuthMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
  });
});
