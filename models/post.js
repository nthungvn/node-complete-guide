const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  creator: {
    name: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Post', postSchema);
