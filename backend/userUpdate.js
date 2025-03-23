import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from './models/User.js';
import UserPhoto from './models/UserPhoto.js';  // Import the UserPhoto model
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const updateExistingUsers = async () => {
  try {
    await connectDB(); // Ensure database is connected

    const users = await User.find({}); // Fetch all users
    if (users.length === 0) {
      console.log('⚠️ No users found in the database.');
      return;
    }

    for (const user of users) {
      const uniqueCompanyId = uuidv4(); // Generate unique company ID

      // Update the User model
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            activeStatus: 'offline',
            companyId: uniqueCompanyId,
            profilePhoto: null, // Initialize profilePhoto to null
            notificationsEnabled: true, // Initialize notificationsEnabled to true
          },
        }
      );

      // Initialize the UserPhoto model with null photo for each user
      await UserPhoto.updateOne(
        { userId: user._id },
        { $set: { photo: null } },  // Set the photo field to null
        { upsert: true }  // This ensures that a UserPhoto document is created if it doesn't exist
      );
    }

    console.log('✅ All users updated with a unique companyId, profilePhoto, and notificationsEnabled successfully!');
  } catch (error) {
    console.error('❌ Error updating users:', error);
  } finally {
    mongoose.connection.close();
  }
};

updateExistingUsers();
