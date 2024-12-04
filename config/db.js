import mysql from 'mysql2';  // Import mysql2 library
import dotenv from 'dotenv';  // Import dotenv for environment variables
dotenv.config();  // Load environment variables from .env file

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT || 3306, 
    waitForConnections: true,  
    connectionLimit: 10,  
    queueLimit: 0,  
});

export default pool;
