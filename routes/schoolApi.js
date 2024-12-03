import express from 'express';
import db from '../config/db.js';
import haversine from 'haversine';
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
router.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    const validationError = validateSchoolData(name, address, latitude, longitude);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id';
    const values = [name, address, latitude, longitude];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: results.rows[0].id });
    });
});

// List Schools
router.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;

    // Validation
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    // Fetch all schools 
    const query = 'SELECT id, name, address, latitude, longitude FROM schools';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching schools:', err);
            return res.status(500).json({ error: 'Failed to fetch schools' });
        }

        // proximity
        const userLocation = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        const schoolsWithDistances = results.rows.map((school) => {
            const schoolLocation = { latitude: school.latitude, longitude: school.longitude };
            const distance = haversine(userLocation, schoolLocation, { unit: 'km' });
            return { ...school, distance };
        });

        //  sort in ascending order
        schoolsWithDistances.sort((a, b) => a.distance - b.distance);
        res.json(schoolsWithDistances);
    });
});

// Test Route
router.get("/school", (req, res) => {
    res.send("working perfectly1");
});

export default router;
