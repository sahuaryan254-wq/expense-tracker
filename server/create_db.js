const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DB}`);
        console.log(`Database ${process.env.MYSQL_DB} created or already exists.`);
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    }
})();
