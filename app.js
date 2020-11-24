const express = require('express');
const path = require('path');

const defaultRoutes = require('./routes/default');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRoutes);
app.use('/', defaultRoutes);

app.listen(process.env.PORT || 3000);
