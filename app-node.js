const express = require('express');
const todoRoutes = require('./routes/todos-node');

const app = express();
app.use(express.json());
app.use('/todos', todoRoutes);

app.listen(3000);
