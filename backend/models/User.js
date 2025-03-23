import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: "Guest User", // Set default name
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true, // Hashed password
  },
  companyId: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'], // Only admin and user roles
    default: 'user',
  },
  lastLogin: {
    type: Date, // Stores last login timestamp
    default: null,
  },
  lastLogout: {
    type: Date, // Stores last logout timestamp
    default: null,
  },
  activeStatus: {
    type: String,
    enum: ['online', 'offline'], // Active status options
    default: 'offline',
  },
  profilePhoto: {
    type: String, // Store the profile photo as a base64 string or URL
    default: null, // Default to null
  },
  notificationsEnabled: {
    type: Boolean,
    default: true, // Notifications enabled by default
  },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const User = mongoose.model('User', userSchema);
export default User;