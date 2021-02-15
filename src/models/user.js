const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: 'String',
    required: true,
  },
  password: {
    type: 'String',
    required: true,
  },
  status: {
    type: 'String',
    default: 'New',
  },
  posts: [
    {
      type: ObjectId,
      ref: 'Post',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
