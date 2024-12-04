import mysql from 'mysql2';  // Import mysql2 library
import dotenv from 'dotenv';  // Import dotenv for environment variables
dotenv.config();  // Load environment variables from .env file

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,  // Database host
    user: process.env.DB_USER,  // Database username
    password: process.env.DB_PASSWORD,  // Database password
    database: process.env.DB_NAME,  // Database name
    port: process.env.DB_PORT || 3306,  // Default MySQL port is 3306
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

// Export the database connection for use in other files
export default db;
