const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  linkText: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  backgroundColor: {
    type: String,
    default: '#ff6b6b'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  displaySpeed: {
    type: Number,
    default: 50 // pixels per second for scrolling
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: '🎉'
  }
}, {
  timestamps: true
});

// Method to check if announcement is currently active
announcementSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  
  if (!this.isActive) return false;
  
  if (this.startDate && this.startDate > now) return false;
  
  if (this.endDate && this.endDate < now) return false;
  
  return true;
};

// Static method to get all active announcements
announcementSchema.statics.getActiveAnnouncements = async function() {
  const now = new Date();
  
  return await this.find({
    isActive: true,
    $or: [
      { startDate: { $lte: now } },
      { startDate: null }
    ],
    $or: [
      { endDate: { $gte: now } },
      { endDate: null }
    ]
  }).sort({ order: 1, createdAt: -1 });
};

// Index for performance
announcementSchema.index({ isActive: 1, order: 1 });
announcementSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);
