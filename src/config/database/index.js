const mysql2 = require("mysql2");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool = mysql2.createPool({
  host: "localhost",
  database: "thewarehouse",
  user: "root",
  password: "Fahemhakikikhaya+",
  waitForConnections: true,
  connectionLimit: 50,
});

module.exports = pool;
