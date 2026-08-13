const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateTrackingInfo,
  getOrderStatistics,
  cancelOrder
} = require('../controllers/orderController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// Protected routes (Logged in users)
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.get('/stats/summary', protect, admin, getOrderStatistics);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/tracking', protect, admin, updateTrackingInfo);

module.exports = router;
