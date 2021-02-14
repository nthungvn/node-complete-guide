const express = require('express');
const bodyParser = require('body-parser');

const postRoutes = require('./routes/post');
const cors = require('./middlewares/cors');;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/feed', postRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("App started");
});
