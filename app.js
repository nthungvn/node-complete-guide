const path = require('path');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash')();
const MongoDBStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const renderAttachedInfo = require('./middleware/renderAttachedInfo');
const loggedInUser = require('./middleware/loggedInUser');

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.oipin.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'));
const certificate = fs.readFileSync(path.join(__dirname, 'server.cert'));

const multerStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' },
);

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(compression({ filter: shouldCompress }));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

app.use(
  multer({ storage: multerStorage, fileFilter: fileFilter }).single('image'),
);
app.use(csrfProtection);
app.use(renderAttachedInfo);
app.use(loggedInUser);
app.use(flash);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.getNotFound);
app.use(errorController.get500);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // https
    //   .createServer(
    //     {
    //       key: privateKey,
    //       cert: certificate,
    //     },
    //     app,
    //   )
    //   .listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
