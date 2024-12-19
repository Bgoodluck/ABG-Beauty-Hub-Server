import StaffReview from '../models/staffReviewModel.js';
import StaffModel from '../models/staffModel.js';
import userModel from "../models/userModel.js";



export const createReview = async (req, res) => {
  try {
    const { staffId } = req.params;
    const userId = req.user.id;

    const { rating, comment } = req.body;

    
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating and comment"
      });
    }

    
    const staff = await StaffModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found"
      });
    }

    
    const existingReview = await StaffReview.findOne({ 
      staff: staffId, 
      user: userId 
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this staff"
      });
    }

    // Create new review
    const newReview = new StaffReview({
      staff: staffId,
      user: userId,
      rating,
      comment
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: savedReview
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message
    });
  }
};

export const getStaffReviews = async (req, res) => {
  try {
    const { staffId } = req.params;

   
    const staff = await StaffModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found"
      });
    }

    
    const reviews = await StaffReview.find({ staff: staffId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results: reviews.length,
      data: reviews
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message
    });
  }
};

export const getUserDetailsForReview = async (req, res) => {
  try {
    const userId = req.user.id;


    // Find the user by ID
    const user = await userModel.findById(userId)
      .select('name profilePic email'); 

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prepare user details to send
    const userDetails = {
      _id: user._id,
      name: user.name,                        //|| `${user.firstName} ${user.lastName}`.trim()
      // firstName: user.firstName,
      // lastName: user.lastName,
      profilePic: user.profilePic || null,
      email: user.email
    };

    res.status(200).json({
      success: true,
      message: "User details retrieved successfully",
      data: userDetails
    });

  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: "Error retrieving user details",
      error: error.message
    });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    
    const review = await StaffReview.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if the user is the owner of the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review"
      });
    }

    // Update review
    review.rating = rating;
    review.comment = comment;

    const updatedReview = await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    
    const review = await StaffReview.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if the user is the owner of the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review"
      });
    }

    
    await StaffReview.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message
    });
  }
};


export const searchStaffs = async(req, res)=>{

  try {

    const query = req.query.q;
    
    const regex = new RegExp(query,"i","g")

    const staffs = await StaffModel.find({$or: [
      {staffName: regex},      
      {staffCategory: regex}
    ]}).sort({ createdAt : -1 });

    return res.json({
      success: true,
      message: "Staffs fetched successfully",
      data: staffs
    })
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Search not available",
      error: error.message
    });
  }
}

export const filterStaffs = async(req, res)=>{
  try {
   const categoryList = req?.body?.staffCategory || []

   const staffs = await StaffModel.find({ 
     staffCategory: { $in: categoryList } 
   })

   return res.json({
     success: true,
     message: "Staffs fetched successfully",
     data: staffs
   })
   
  } catch (error) {
   console.error(error);
   res.status(500).json({
     success: false,
     message: "Filter Error",
     error: error.message
   });
 }
}


export const getAllReviews = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    // Get total count for pagination
    const totalCount = await StaffReview.countDocuments();

    // Fetch reviews with pagination and sorting
    const reviews = await StaffReview.find()
      .populate({
        path: 'user',
        select: 'name email profilePic'
      })
      .populate({
        path: 'staff',
        select: 'staffName staffCategory'
      })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Add timestamp for cache control
    const timestamp = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        reviews,
        pagination: {
          totalCount,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage,
          hasPrevPage
        }
      },
      metadata: {
        timestamp,
        sortBy,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc'
      }
    });

  } catch (error) {
    console.error('Error in getAllReviews:', error);
    
    // Determine if error is related to invalid query parameters
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message
    });
  }
};