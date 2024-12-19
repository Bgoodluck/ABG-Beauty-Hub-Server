import express from 'express'
import { 
  createReview, 
  getStaffReviews, 
  updateReview, 
  deleteReview,
  searchStaffs,
  filterStaffs,
  getUserDetailsForReview,
  getAllReviews 
} from '../controllers/staffReviewController.js'
import authUser from '../middleware/auth.js';
import authToken from '../middleware/authToken.js';

const router = express.Router();

router.post('/post-review/:staffId',authUser, createReview);
router.get('/get-review/:staffId',authUser, getStaffReviews);
router.get('/all', getAllReviews)

router.post('/update-review/:reviewId',authUser,  updateReview);
router.get('/review-user/:userId', authUser, getUserDetailsForReview);
router.delete('/delete-review/:reviewId',authUser,  deleteReview);

router.get("/search",searchStaffs)
router.post("/filter", filterStaffs)

export default router;