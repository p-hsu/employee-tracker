const mysql = require('mysql');
const util = require('util');

require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: employee_trackerDB,
});

connection.connect((err) => {
    if (err) throw err;
});

// using util.promisify to turn connection.query into promise returning function
connection.query = util.promisify(connection.query)

modual.exports = connection;