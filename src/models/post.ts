import mongodb from 'mongodb';
import mongoose, { Document } from 'mongoose';

const postSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IPost>('Post', postSchema);
export interface IPost extends Document {
  _doc: any;
  title: string;
  content: string;
  imageUrl: string;
  creator: mongodb.ObjectID;
  createdAt: Date;
  updatedAt: Date;
}
