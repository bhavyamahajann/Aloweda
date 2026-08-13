const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getPendingReviews,
  updateReviewApproval,
  deleteReview,
  markReviewHelpful,
  reportReview,
  addAdminResponse,
  getFeaturedReviews
} = require('../controllers/reviewController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/featured', getFeaturedReviews);
router.post('/:id/helpful', markReviewHelpful);

// Protected routes
router.post('/', protect, createReview);
router.post('/:id/report', protect, reportReview);
router.delete('/:id', protect, deleteReview);

// Admin routes
router.get('/pending', protect, admin, getPendingReviews);
router.put('/:id/approve', protect, admin, updateReviewApproval);
router.post('/:id/respond', protect, admin, addAdminResponse);

module.exports = router;
