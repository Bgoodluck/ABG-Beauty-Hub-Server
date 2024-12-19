import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  birthday: {
    type: Date
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  interests: [{
    type: String
  }],
  profilePicture: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const ProfileModel = mongoose.models.profile || mongoose.model("profile", profileSchema);

export default ProfileModel;