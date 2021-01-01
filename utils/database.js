const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete_guide', 'root', {
  host: 'localhost',
  password: 'my-secret-pw',
  dialect: 'mysql',
});

module.exports = sequelize;
