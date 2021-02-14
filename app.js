const express = require('express');

const postRoutes = require('./routes/post');

const app = express();

app.use('/feed', postRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("App started");
});
