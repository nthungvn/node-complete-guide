const { expect } =  require('chai');

const isAuthMiddleware = require('../src/middlewares/auth-guard');

it('should throw an error if no authorization header is present', async () => {
  const req = {
    headers: {},
  };
  try {
    await isAuthMiddleware(req, {}, () => {})
  } catch (error) {
    expect(error.message).to.equal('Not Authenticated');
  }
});
