const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cors = require('./middlewares/cors');
const authGuard = require('./middlewares/auth-guard');
const serverError = require('./middlewares/server-error');

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.oipin.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/feed', authGuard, feedRoutes);
app.use('/auth', authRoutes);
app.use('/user', authGuard, userRoutes);
app.use(serverError);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('Mongo connected');
    app.listen(process.env.PORT || 3000);
  })
  .catch((error) => {
    console.log(error);
  });
