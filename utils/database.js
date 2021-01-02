const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete-guide', 'root', 'my-secret-pw', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
