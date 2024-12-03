import pkg from 'pg'; 
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pkg; 


const db = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,  // Default PostgreSQL port is 5432
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to Postgres:', err.message);
        return;
    }
    console.log('Connected to Postgres database');
});

export default db;
