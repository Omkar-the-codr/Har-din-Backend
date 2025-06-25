const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mysql@123",
    database: "graphql_demo",
});

module.exports = pool;