const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete_guide', 'root', {
  host: '34.87.158.173',
  password: 'node-complete-guide',
  dialect: 'mysql',
});

module.exports = sequelize;
