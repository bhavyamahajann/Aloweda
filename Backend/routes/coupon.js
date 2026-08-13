const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  recordCouponUsage,
  getCouponAnalytics,
  generateCouponReport
} = require('../controllers/couponController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.post('/validate', validateCoupon);

// Protected routes
router.post('/use', protect, recordCouponUsage);

// Admin routes
router.post('/', protect, admin, createCoupon);
router.get('/', protect, admin, getAllCoupons);
router.get('/analytics', protect, admin, getCouponAnalytics);
router.get('/report', protect, admin, generateCouponReport);
router.get('/:id', protect, admin, getCouponById);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
