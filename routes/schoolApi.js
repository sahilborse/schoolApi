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
    db.query(query, [name, address, latitude, longitude], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: results.insertId });
    });
    // try {
    //     const [results] = await db.execute(query, values);  // Execute the query
    //     console.log("works");
    //     console.log([results]);
    //     res.status(201).json({ message: 'School added successfully', schoolId: results.insertId });  // Use insertId to get the new record's ID
    // } catch (err) {
    //     console.error('Error inserting data:', err.message);
    //     res.status(500).json({ error: 'Database insertion error' });
    // }
});


// List Schools
// List Schools
router.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    // Validation for latitude and longitude
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    const query = 'SELECT id, name, address, latitude, longitude FROM schools';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching schools:', err);
            return res.status(500).json({ error: 'Failed to fetch schools' });
        }

        // Calculate distances and sort schools by proximity
        const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        const schoolsWithDistances = results.map((school) => { // Use `results` directly as an array
            const schoolLocation = { latitude: school.latitude, longitude: school.longitude };
            const distance = haversine(userLocation, schoolLocation, { unit: 'km' });
            return { ...school, distance };
        });

        // Sort schools 
        schoolsWithDistances.sort((a, b) => a.distance - b.distance);
        res.json(schoolsWithDistances);
    });
});


// Test
router.get("/school", (req, res) => {
    res.send("Kay mato ganesh bhai!");
});

export default router;
