const mysql = require('mysql2');
// const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '34.87.158.173',
  user: 'root',
  password: 'node-complete-guide',
  database: 'node_complete_guide',
});

module.exports = pool.promise();
// module.exports = pool
