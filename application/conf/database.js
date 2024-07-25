const mysql = require('mysql2')

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'12345',
    database:'videoapp',
    waitingForConnections: true,
    connectionLimit: 20, 
    maxIdle: 10,
    idleTimeout: 1000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

module.exports = pool.promise();