import express from 'express';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { 
  getProfile, 
  updateProfile, 
  deleteProfilePicture 
} from '../controllers/profileController.js';

const profileRouter = express.Router();

// All routes require authentication
profileRouter.use(authUser);

// Profile routes
profileRouter.get('/me', getProfile);
profileRouter.put('/update', upload.single('profilePicture'), updateProfile);
profileRouter.delete('/picture', deleteProfilePicture);

export default profileRouter;