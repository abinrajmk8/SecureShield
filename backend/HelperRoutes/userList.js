// /backend/HelperRoutes/userList.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET route to fetch all users
router.get('/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;