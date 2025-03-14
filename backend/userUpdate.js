import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from './models/User.js';
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
      await User.updateOne({ _id: user._id }, { $set: { activeStatus: 'offline', companyId: uniqueCompanyId } });
    }

    console.log('✅ All users updated with a unique companyId successfully!');
  } catch (error) {
    console.error('❌ Error updating users:', error);
  } finally {
    mongoose.connection.close();
  }
};

updateExistingUsers();
