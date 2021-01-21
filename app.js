const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const { connectMongo } = require('./utils/database');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  User.findById('6006fc24e95f4b367ac6b10a')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      console.log(user);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.getNotFound);

connectMongo(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 3000);
  User.findById('6006fc24e95f4b367ac6b10a')
    .then((user) => {
      if (!user) {
        const user = new User('Hung', 'hung@sample.com');
        return user.save();
      }
      return user;
    })
    .then((user) => {
      console.log(user);
    })
    .catch((err) => {
      console.log(err);
    });
});
