// backend/HelperRoutes/testRoute.js

import express from 'express';

const router = express.Router();



router.get('/', async (req, res) => {
    console.log('Test route working');
    res.status(200).json({ message: 'Test route working' });
    });

export default router;

