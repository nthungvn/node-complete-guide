const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const cors = require('./middlewares/cors');
const serverError = require('./middlewares/server-error');

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.oipin.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/feed', feedRoutes);
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
