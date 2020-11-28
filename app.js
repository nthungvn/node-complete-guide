const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const admin = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();
app.engine('handlebars', expressHbs());
app.set('view engine', 'handlebars');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', admin.routes);
app.use(shopRoutes);
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(process.env.PORT || 3000);
