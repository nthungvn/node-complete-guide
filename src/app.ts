import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import multer from 'multer';
import graphql from 'express-graphql';

import cors from './middlewares/cors.js';
import serverError from './middlewares/server-error.js';
import graphqlSchema from './graphql/schema.js';
import graphqlResolvers from './graphql/resolvers.js';
import auth from './middlewares/auth.js';
import { deleteFile, __dirname } from './utils/file.js';
import { CustomRequest } from './utils/express-extended.js';
import { CustomError } from './utils/error.js';

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.oipin.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
  _: any,
  file: { mimetype: string },
  cb: (f: any, s: any) => void,
) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    return cb(null, true);
  }
  cb(null, false);
};

const app = express();

app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(auth);
app.put('/post-image', (req: CustomRequest, res, _) => {
  if (!req.isAuth) {
    const error: CustomError = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  if (!req.file) {
    return res.json({ message: 'No image was uploaded!' });
  }
  if (req.body.oldImagePath) {
    deleteFile(req.body.oldImagePath);
  }
  res.status(201).json({
    message: 'Image was uploaded!',
    imagePath: req.file.path,
  });
});
app.use(
  '/graphql',
  graphql.graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn: (error) => {
      if (!error.originalError) {
        return error;
      }
      return {
        message: error.message || 'Unexpected error',
        statusCode: (error.originalError as CustomError).statusCode || 500,
        data: (error.originalError as CustomError).data,
      };
    },
  }),
);
app.use(serverError);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((_) => {
    console.log('Mongo connected');
    app.listen(process.env.PORT || 3000);
  })
  .catch((error) => {
    console.log(error);
  });
