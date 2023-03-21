const mysql = require('mysql2');
// DB connection init
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hotel_project'
  })

connection.connect();
module.exports = connection;