import mongoose from 'mongoose'


const reviewSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'staff', 
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Static method to calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function(staffId) {
  const stats = await this.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(staffId) }
    },
    {
      $group: {
        _id: '$staff',
        numberOfRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('staff').findByIdAndUpdate(staffId, {
      $set: {
        ratingsQuantity: stats[0].numberOfRatings,
        ratingsAverage: Number(stats[0].averageRating.toFixed(1))
      }
    });
  }
};

// Post save middleware to update product rating
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.staff);
});

// Post remove middleware to update staff rating
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.staff);
});

const StaffReview = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default StaffReview;