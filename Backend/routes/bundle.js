const express = require('express');
const router = express.Router();
const {
  createBundle,
  getAllBundles,
  getBundleById,
  updateBundle,
  deleteBundle,
  validateCartForBundles,
  incrementBundleUsage
} = require('../controllers/bundleController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/', getAllBundles);
router.get('/:id', getBundleById);
router.post('/validate', validateCartForBundles);

// Protected routes (Admin only)
router.post('/', protect, admin, createBundle);
router.put('/:id', protect, admin, updateBundle);
router.delete('/:id', protect, admin, deleteBundle);
router.post('/:id/use', protect, incrementBundleUsage);

module.exports = router;
