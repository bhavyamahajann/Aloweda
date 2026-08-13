const mongoose = require('mongoose');

const couponUsageSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true,
    index: true
  },
  couponCode: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  orderValue: {
    type: Number,
    required: true
  },
  discountApplied: {
    type: Number,
    required: true
  },
  finalAmount: {
    type: Number,
    required: true
  },
  source: {
    type: String
  },
  campaign: {
    type: String
  },
  usedAt: {
    type: Date,
    default: Date.now
  },
  customerEmail: {
    type: String
  },
  customerPhone: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index for analytics queries
couponUsageSchema.index({ couponId: 1, usedAt: -1 });
couponUsageSchema.index({ couponCode: 1, usedAt: -1 });
couponUsageSchema.index({ userId: 1, couponId: 1 });

// Static method to get analytics for a coupon
couponUsageSchema.statics.getAnalytics = async function(couponId, startDate, endDate) {
  const match = { couponId: mongoose.Types.ObjectId(couponId) };
  
  if (startDate || endDate) {
    match.usedAt = {};
    if (startDate) match.usedAt.$gte = new Date(startDate);
    if (endDate) match.usedAt.$lte = new Date(endDate);
  }

  const analytics = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalUses: { $sum: 1 },
        totalRevenue: { $sum: '$finalAmount' },
        totalDiscount: { $sum: '$discountApplied' },
        avgOrderValue: { $avg: '$orderValue' },
        avgDiscount: { $avg: '$discountApplied' }
      }
    }
  ]);

  return analytics[0] || {
    totalUses: 0,
    totalRevenue: 0,
    totalDiscount: 0,
    avgOrderValue: 0,
    avgDiscount: 0
  };
};

// Static method to check user usage count
couponUsageSchema.statics.getUserUsageCount = async function(userId, couponId) {
  return await this.countDocuments({ userId, couponId });
};

module.exports = mongoose.model('CouponUsage', couponUsageSchema);
