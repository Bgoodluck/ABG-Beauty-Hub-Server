import express from 'express'
import { 
  createReview, 
  getProductReviews, 
  updateReview, 
  deleteReview,
  searchProducts,
  filterProducts 
} from '../controllers/productReviewController.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

router.post('/post-review/:productId', authUser, createReview);
router.get('/get-review/:productId', getProductReviews);
router.post('/update-review/:reviewId', authUser, updateReview);
router.delete('/delete-review/:reviewId', authUser, deleteReview);
router.get("/search",searchProducts)
router.post("/filter", filterProducts)

export default router;