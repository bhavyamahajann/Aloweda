const Announcement = require('../models/Announcement');

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Admin
exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Admin
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get active announcements
// @route   GET /api/announcements/active
// @access  Public
exports.getActiveAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    
    const announcements = await Announcement.find({
      isActive: true,
      $or: [
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: null }
      ]
    }).sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get announcement by ID
// @route   GET /api/announcements/:id
// @access  Admin
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Admin
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Admin
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle announcement active status
// @route   PATCH /api/announcements/:id/toggle
// @access  Admin
exports.toggleAnnouncementStatus = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }
    
    announcement.isActive = !announcement.isActive;
    await announcement.save();
    
    res.json({
      success: true,
      message: `Announcement ${announcement.isActive ? 'activated' : 'deactivated'} successfully`,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update announcement order
// @route   PUT /api/announcements/reorder
// @access  Admin
exports.reorderAnnouncements = async (req, res) => {
  try {
    const { announcements } = req.body; // Array of { id, order }
    
    if (!Array.isArray(announcements)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }
    
    const updatePromises = announcements.map(({ id, order }) =>
      Announcement.findByIdAndUpdate(id, { order })
    );
    
    await Promise.all(updatePromises);
    
    res.json({
      success: true,
      message: 'Announcements reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
