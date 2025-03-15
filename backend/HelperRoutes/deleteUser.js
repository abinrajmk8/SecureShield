// backend/HelperRoutes/deleteUser.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// **Admin deletes a user**
router.delete('/delete-user', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify admin token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only' });
    }

    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Prevent self-deletion
    if (decoded.username === username) {
      return res.status(403).json({ message: 'You cannot delete yourself' });
    }

    // Find and delete user
    const user = await User.findOneAndDelete({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User ${username} deleted successfully` });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
