const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,  // Wait for a connection to become available
    connectionLimit: 10,       // Max number of connections in the pool
    queueLimit: 0              // Max number of queued connection requests
});

module.exports = pool.promise();
