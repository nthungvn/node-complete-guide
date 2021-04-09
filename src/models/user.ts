import mongodb from 'mongodb';
import mongoose from 'mongoose';

const { ObjectId } = mongodb;

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

export default mongoose.model('User', userSchema);
