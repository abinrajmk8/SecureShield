import mongoose from 'mongoose';

const userPhotoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    unique: true,
    required: true,
  },
  photo: {
    type: String, // You can store the photo URL or base64 string
    required: true,
  },
});

const UserPhoto = mongoose.model('UserPhoto', userPhotoSchema);

export default UserPhoto;
