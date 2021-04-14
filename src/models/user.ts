import mongodb from 'mongodb';
import mongoose, { Document } from 'mongoose';
import { PostDocument } from './post';

interface IUser {
  name: string;
  email: string;
  password: string;
  status: string;
  posts: mongodb.ObjectID[] | PostDocument[];
}

export interface UserDocument extends IUser, Document {
  _doc: any;
}

const userSchemaFields: Record<keyof IUser, any> = {
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
};

const userSchema = new mongoose.Schema(userSchemaFields);

export default mongoose.model<UserDocument>('User', userSchema);
