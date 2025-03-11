import mongoose from 'mongoose';
import connectDB from '../db.js'; // Your database connection file
import User from '../models/User.js'; // Updated User model

const updateExistingUsers = async () => {
  try {
    await connectDB(); // Connect to MongoDB using your db.js file

    const updateFields = {
      role: 'user', // Default role
      lastLogin: null,
      lastLogout: null,
      activeStatus: 'offline',
      name: "Guest User" // Set name if missing
    };

    await User.updateMany({}, { $set: updateFields });

    console.log('✅ All users updated successfully!');
  } catch (error) {
    console.error('❌ Error updating users:', error);
  } finally {
    mongoose.connection.close(); // Close the connection after update
  }
};

updateExistingUsers();
