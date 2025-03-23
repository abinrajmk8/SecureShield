import express from 'express';
import UserAttributes from '../models/userAttributesModel.js';

const router = express.Router();

// Fetch user attributes by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userAttributes = await UserAttributes.findOne({ username });
    if (!userAttributes) {
      return res.status(404).json({ message: 'User attributes not found' });
    }
    res.json(userAttributes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user attributes
router.put('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { profilePhoto, notificationsEnabled } = req.body;

    const userAttributes = await UserAttributes.findOneAndUpdate(
      { username },
      { profilePhoto, notificationsEnabled },
      { new: true, upsert: true } // Create if not exists
    );

    res.json({ message: 'User attributes updated successfully', userAttributes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;