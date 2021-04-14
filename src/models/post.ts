import mongodb from 'mongodb';
import mongoose, { Document } from 'mongoose';
import { UserDocument } from './user';

interface IPost {
  title: string;
  content: string;
  imageUrl: string;
  creator: mongodb.ObjectID | UserDocument;
}

export interface PostDocument extends IPost, Document {
  _doc: any;
  createdAt: Date;
  updatedAt: Date;
}

const postSchemaFields: Record<keyof IPost, any> = {
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
    type: mongodb.ObjectID,
    required: true,
    ref: 'User',
  },
};

const postSchema = new mongoose.Schema(postSchemaFields, { timestamps: true });

export default mongoose.model<PostDocument>('Post', postSchema);
