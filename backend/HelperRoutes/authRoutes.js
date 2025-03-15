// /backend/HelperRoutes/authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendMail from '../utils/sendMail.js';

const router = express.Router();

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
    console.log(`User role: ${user.role}`);

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log("jwt token",token);
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      username: user.username, 
      role: user.role, // Include role in the response
     // userId: user._id // Include user ID in the response
    });

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
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a unique companyId
    const uniqueCompanyId = uuidv4();

    // Create new user
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      role: role || 'user',
      activeStatus: 'offline',
      lastLogin: null,
      lastLogout: null,
      companyId: uniqueCompanyId // Assign unique companyId
    });

    
    // Save user to the database
    await newUser.save();

    // **Send Registration Email**
    const subject = "Account Successfully Registered!";
    const message = `
      Hello ${name},

      Your account has been successfully registered.
      
      ✅ Username: ${username}  
      ✅ Password: ${password}  
      
      🔹 Please update your password once you log in.

      Thank you,
      Admin Team
    `;

    await sendMail(username, subject, message);

    res.status(201).json({ message: 'User registered successfully', companyId: uniqueCompanyId });
    
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;