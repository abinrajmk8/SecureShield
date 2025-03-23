import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// GET route to fetch the current user and their role
router.get('/currentUser', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const user = await User.findById(decoded.userId, { password: 0 }); // Exclude password field

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user); // Return user details
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;