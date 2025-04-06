import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();


router.put('/update', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;

    // Find the user in DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, password, profilePhoto, notificationsEnabled } = req.body;

    if (name) user.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto; // Update profile photo
    if (notificationsEnabled !== undefined) user.notificationsEnabled = notificationsEnabled; // Update notifications

    await user.save();

    res.status(200).json({ message: 'User details updated successfully', user });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// **Admin updates another user's role**
router.post('/update-role', async (req, res) => {
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

    const { username, role } = req.body;
    if (!username || !role) {
      return res.status(400).json({ message: 'Username and new role are required' });
    }

    // Find user by username (email)
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update role
    user.role = role;
    await user.save();

    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error('Role update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;