// Imports
import express from 'express';
import db from '../config/db.js';
import haversine from 'haversine';

// Middleware creation
const router = express.Router();

// Validation function
const validateSchoolData = (name, address, latitude, longitude) => {
    if (!name || typeof name !== 'string') return 'Invalid name';
    if (!address || typeof address !== 'string') return 'Invalid address';
    if (!latitude || isNaN(latitude) || latitude < -90 || latitude > 90) return 'Invalid latitude';
    if (!longitude || isNaN(longitude) || longitude < -180 || longitude > 180) return 'Invalid longitude';
    return null; 
};

// Add School 
router.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    const validationError = validateSchoolData(name, address, latitude, longitude);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    
    try {
        // Use db.promise() for async/await and promise-based query execution
        const [results] = await db.promise().query(query, [name, address, latitude, longitude]);
        res.status(201).json({ message: 'School added successfully', schoolId: results.insertId });
    } catch (err) {
        console.error('Error inserting data:', err.message);
        res.status(500).json({ error: 'Database insertion error' });
    }
});

// List Schools
router.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    // Validation for latitude and longitude
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const query = 'SELECT id, name, address, latitude, longitude FROM schools';
    
    try {
        // Use db.promise() for async/await and promise-based query execution
        const [results] = await db.promise().query(query);
        
        const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        const schoolsWithDistances = results.map((school) => { 
            const schoolLocation = { latitude: school.latitude, longitude: school.longitude };
            const distance = haversine(userLocation, schoolLocation, { unit: 'km' });
            return { ...school, distance };
        });

        // Sort schools 
        schoolsWithDistances.sort((a, b) => a.distance - b.distance);
        res.json(schoolsWithDistances);
    } catch (err) {
        console.error('Error fetching schools:', err);
        res.status(500).json({ error: 'Failed to fetch schools' });
    }
});

// Test
router.get("/school", (req, res) => {
    res.send("Working Perfectly!");
});
router.get("/",(req,res)=>{
    res.send("welcome, check the routes POST:/addSchool and GET:/listSchools?latitude:XXXX&longitude:XXXXX");
})

export default router;
