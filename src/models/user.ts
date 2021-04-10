import mongodb from 'mongodb';
import mongoose, { Document } from 'mongoose';

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
      type: mongodb.ObjectID,
      ref: 'Post',
    },
  ],
});

export default mongoose.model<IUser>('User', userSchema);

export interface IUser extends Document {
  _doc: any;
  name: string;
  email: string;
  password: string;
  status: string;
  posts: mongodb.ObjectID[];
}
