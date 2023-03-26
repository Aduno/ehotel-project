// const mysql = require('mysql2');
// // DB connection init
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'hotel_project'
//   })

// connection.connect();
// module.exports = connection;
// const Pool = require('pg')
const pg = require('pg')
const databaseConfig = { connectionString: "postgres://feamspap:7E6QyELUE3gDCUJ_hk20sPVl2Dl1DmIB@isilo.db.elephantsql.com/feamspap" };
const pool = new pg.Pool(databaseConfig);

module.exports = pool;
