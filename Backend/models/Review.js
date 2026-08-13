const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: String
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  adminResponse: {
    text: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Compound indexes for queries
reviewSchema.index({ productId: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });

// Static method to get product rating summary
reviewSchema.statics.getProductRatingSummary = async function(productId) {
  const summary = await this.aggregate([
    {
      $match: {
        productId: productId,
        isApproved: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        fiveStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] }
        },
        fourStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] }
        },
        threeStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] }
        },
        twoStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] }
        },
        oneStarCount: {
          $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] }
        }
      }
    }
  ]);

  if (summary.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      fiveStarCount: 0,
      fourStarCount: 0,
      threeStarCount: 0,
      twoStarCount: 0,
      oneStarCount: 0
    };
  }

  return summary[0];
};

// Static method to check if user can review product
reviewSchema.statics.canUserReview = async function(userId, productId) {
  const existingReview = await this.findOne({ userId, productId });
  return !existingReview;
};

// Method to increment helpful count
reviewSchema.methods.markHelpful = async function() {
  this.helpfulCount += 1;
  return await this.save();
};

module.exports = mongoose.model('Review', reviewSchema);
