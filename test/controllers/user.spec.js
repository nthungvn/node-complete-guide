const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const mongoose = require('mongoose');

const User = require('../../src/models/user');
const userController = require('../../src/controllers/user');

describe('User Controller - Update User Status', () => {
  before(async () => {
    const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.oipin.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
  });

  it('should return user status if there is an existing user', async () => {
    const rawUser = new User({
      name: 'Hung',
      email: 'hung@hung.com',
      password: 'abc123',
      posts: [],
      _id: '5f6ff6d8d9ec254d70c6f8e6',
    });
    const user = await rawUser.save();
    const req = { user, body: { status: 'Updated status' } };
    const res = {
      message: '',
      statusCode: 500,
      status(status) {
        this.statusCode = status;
        return this;
      },
      json(data) {
        this.message = data.message;
      },
    };
    res.json;

    await userController.updateUserStatus(req, res, () => {});
    expect(res.statusCode).to.be.equal(200);
    expect(res.message).to.be.equal('Status updated');
  });
});
