const pg = require('pg')
const databaseConfig = { connectionString: "postgres://feamspap:7E6QyELUE3gDCUJ_hk20sPVl2Dl1DmIB@isilo.db.elephantsql.com/feamspap" };
const pool = new pg.Pool(databaseConfig);

module.exports = pool;
