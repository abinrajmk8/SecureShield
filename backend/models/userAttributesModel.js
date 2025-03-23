import mongoose from 'mongoose';

const userAttributesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  profilePhoto: {
    type: String, // Store the profile photo as a base64 string or URL
    default: null,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true, // Notifications enabled by default
  },
}, { timestamps: true });

const UserAttributes = mongoose.model('UserAttributes', userAttributesSchema);
export default UserAttributes;