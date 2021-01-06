const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const { connectMongo } = require('./utils/database');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.getNotFound);

connectMongo(() => {
  console.log('Connected to MongoDB');
  app.listen(process.env.PORT || 3000);
});
