// /backend/HelperRoutes/authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = "myverysecuresecret"; // Store this in an environment variable

// **Login Route**
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update login details
    await User.findByIdAndUpdate(user._id, {
      activeStatus: 'online',
      lastLogin: new Date()
    });

    console.log(`User ${username} is now online.`);
    console.log(`Last login time: ${new Date().toISOString()}`);

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token, username: user.username, role: user.role });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// **Logout Route**
router.post('/logout', async (req, res) => {
  const { username } = req.body;

  try {
    await User.findOneAndUpdate({ username }, {
      activeStatus: 'offline',
      lastLogout: new Date()
    });

    console.log(`User ${username} has logged out.`);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// **Register Route**
router.post('/register', async (req, res) => {
  const { name, username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      role: role || 'user',
      activeStatus: 'offline',
      lastLogin: null,
      lastLogout: null
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
