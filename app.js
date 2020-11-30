const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const db = require('./utils/database');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

db.query('SELECT * FROM products', (error, results, fields) => {
  console.log(results);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.getNotFound);

app.listen(process.env.PORT || 3000);
