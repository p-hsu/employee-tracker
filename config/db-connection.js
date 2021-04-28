const mysql = require('mysql');
const util = require('util');

require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: 'employee_trackerDB',
});

connection.query = util.promisify(connection.query);
module.exports = connection;