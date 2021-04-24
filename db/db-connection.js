const mysql = require('mysql');

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

modual.exports = connection;