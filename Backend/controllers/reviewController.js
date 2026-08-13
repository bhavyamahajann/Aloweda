const Review = require('../models/Review');
const Order = require('../models/Order');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, images, orderId } = req.body;
    const userId = req.userId; // From auth middleware
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    
    // Check if verified purchase
    let verifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({
        orderId,
        userId,
        'items.productId': productId,
        orderStatus: 'Delivered'
      });
      
      verifiedPurchase = !!order;
    }
    
    const review = new Review({
      productId,
      userId,
      userName: req.userName, // From auth middleware
      userEmail: req.userEmail, // From auth middleware
      rating,
      title,
      comment,
      images: images || [],
      verifiedPurchase,
      orderId: verifiedPurchase ? orderId : undefined
    });
    
    await review.save();
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will be visible after admin approval.',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = '-createdAt', approved = 'true' } = req.query;
    
    const query = { productId };
    if (approved === 'true') {
      query.isApproved = true;
    }
    
    const reviews = await Review.find(query)
      .sort(sort)
      .select('-userEmail');
    
    // Get rating summary
    const ratingSummary = await Review.getProductRatingSummary(productId);
    
    res.json({
      success: true,
      count: reviews.length,
      ratingSummary,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get pending reviews
// @route   GET /api/reviews/pending
// @access  Admin
exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve/Reject review
// @route   PUT /api/reviews/:id/approve
// @access  Admin
exports.updateReviewApproval = async (req, res) => {
  try {
    const { isApproved, isFeatured } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    if (isApproved !== undefined) {
      review.isApproved = isApproved;
    }
    
    if (isFeatured !== undefined) {
      review.isFeatured = isFeatured;
    }
    
    await review.save();
    
    res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Admin or Review Owner
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user is admin or review owner
    if (!req.isAdmin && review.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    await review.deleteOne();
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Public
exports.markReviewHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    await review.markHelpful();
    
    res.json({
      success: true,
      message: 'Review marked as helpful',
      helpfulCount: review.helpfulCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Report review
// @route   POST /api/reviews/:id/report
// @access  Private
exports.reportReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { reportCount: 1 } },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Auto-hide if report count exceeds threshold
    if (review.reportCount >= 5 && review.isApproved) {
      review.isApproved = false;
      await review.save();
    }
    
    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add admin response to review
// @route   POST /api/reviews/:id/respond
// @access  Admin
exports.addAdminResponse = async (req, res) => {
  try {
    const { text } = req.body;
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    review.adminResponse = {
      text,
      respondedAt: new Date(),
      respondedBy: req.userId
    };
    
    await review.save();
    
    res.json({
      success: true,
      message: 'Response added successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured reviews
// @route   GET /api/reviews/featured
// @access  Public
exports.getFeaturedReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const reviews = await Review.find({
      isApproved: true,
      isFeatured: true
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-userEmail');
    
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
