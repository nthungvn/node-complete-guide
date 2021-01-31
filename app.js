const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findById('6006fc24e95f4b367ac6b10a')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.getNotFound);

mongoose
  .connect(
    'mongodb+srv://node-complete-guide:node-complete-guide@cluster0.oipin.mongodb.net/node-complete-guide?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('Connected to MongoDB');
    return User.findById('6006fc24e95f4b367ac6b10a')
      .then((user) => {
        if (!user) {
          const user = new User({
            name: 'Hung',
            email: 'hung@sample.com',
            cart: { items: [] },
          });
          return user.save();
        }
        return user;
      })
      .then((user) => {
        console.log(user);
        app.listen(process.env.PORT || 3000);
      });
  })
  .catch((err) => {
    console.log(err);
  });
