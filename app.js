const express = require('express');

const defaultRoutes = require('./routes/default');
const userRoutes = require('./routes/user');

const app = express();

app.use('/users', userRoutes);
app.use('/', defaultRoutes);

app.listen(process.env.PORT || 3000);
