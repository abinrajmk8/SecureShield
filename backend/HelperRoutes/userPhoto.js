import express from 'express';
import mongoose from 'mongoose'; // Add this import
import UserPhoto from '../models/UserPhoto.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// **Route to update user's profile photo**
router.put('/update-photo', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;

    // Validate the userId type
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the user photo entry by userId
    let userPhoto = await UserPhoto.findOne({ userId });

    if (!userPhoto) {
      // If no user photo exists, create a new entry
      userPhoto = new UserPhoto({
        userId, 
        photo: req.body.profilePhoto // Base64 encoded image string
      });
    } else {
      // If the user photo exists, update it
      userPhoto.photo = req.body.profilePhoto;
    }

    // Save the updated user photo
    await userPhoto.save();
    res.status(200).json({ message: 'Profile photo updated successfully!', userPhoto });
  } catch (err) {
    console.error('Error updating photo:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/get-photo', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;

    // Validate the userId type
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the user's profile photo
    const userPhoto = await UserPhoto.findOne({ userId });
    if (!userPhoto) {
      return res.status(404).json({ message: 'User photo not found' });
    }

    res.status(200).json({ profilePhoto: userPhoto.photo });
  } catch (err) {
    console.error('Error fetching photo:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
