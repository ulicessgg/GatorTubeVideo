const mysql = require('mysql2')

const pool = mysql.createPool({
    //host: process.env.DB_HOST,
    //user:process.env.DB_USER,
    //password: process.env.DB_PASSWORD,
    //database:process.env.DB_NAME,
    //when attempting to run the site with these it will fail to load the database
    
    host:'localhost',
    user:'root',
    password:'12345',
    database:'videoapp',
    port:3306,
    waitingForConnections: true,
    connectionLimit: 20, 
    maxIdle: 10,
    idleTimeout: 1000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

module.exports = pool.promise();