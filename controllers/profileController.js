import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import ProfileModel from '../models/profileModel.js';
import userModel from '../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let profile = await ProfileModel.findOne({ user: userId })
      .populate('user', 'name email');
    
    if (!profile) {
      profile = await ProfileModel.create({ user: userId });
      profile = await profile.populate('user', 'name email');
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = { ...req.body };
    
    // Remove user field if it exists
    delete updateData.user;
    
    // Handle file upload if there's a profile picture
    if (req.file) {
      // Store the path relative to the uploads directory
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    // Parse nested JSON strings if they exist
    ['address', 'socialLinks'].forEach(field => {
      if (typeof updateData[field] === 'string') {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          console.log(`Failed to parse ${field}:`, e);
        }
      }
    });

    let profile = await ProfileModel.findOne({ user: userId });
    
    if (!profile) {
      profile = await ProfileModel.create({
        user: userId,
        ...updateData
      });
    } else {
      // If updating profile picture, delete old one if it exists
      if (req.file && profile.profilePicture) {
        const oldPath = path.join(__dirname, '../public', profile.profilePicture);
        try {
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (err) {
          console.error('Error deleting old profile picture:', err);
        }
      }

      profile = await ProfileModel.findOneAndUpdate(
        { user: userId },
        { $set: updateData },
        { new: true }
      );
    }

    await profile.populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false, 
      message: error.message
    });
  }
};

// Delete profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const profile = await ProfileModel.findOne({ user: userId });
    
    if (profile && profile.profilePicture) {
      // Delete the file
      const filePath = path.join(__dirname, '../public', profile.profilePicture);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Error deleting profile picture file:', err);
      }
    }
    
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { user: userId },
      { $set: { profilePicture: '' } },
      { new: true }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Profile picture removed successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error in deleteProfilePicture:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};