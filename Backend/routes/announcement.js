const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAllAnnouncements,
  getActiveAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
  reorderAnnouncements
} = require('../controllers/announcementController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/active', getActiveAnnouncements);

// Admin routes
router.post('/', protect, admin, createAnnouncement);
router.get('/', protect, admin, getAllAnnouncements);
router.get('/:id', protect, admin, getAnnouncementById);
router.put('/reorder', protect, admin, reorderAnnouncements);
router.put('/:id', protect, admin, updateAnnouncement);
router.patch('/:id/toggle', protect, admin, toggleAnnouncementStatus);
router.delete('/:id', protect, admin, deleteAnnouncement);

module.exports = router;
