const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: 1
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTo: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    trim: true
  },
  campaign: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: String
  }],
  excludedProducts: [{
    type: String
  }]
}, {
  timestamps: true
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  
  if (this.validFrom > now) {
    return { valid: false, message: 'Coupon is not yet active' };
  }
  
  if (this.validTo < now) {
    return { valid: false, message: 'Coupon has expired' };
  }
  
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  
  return { valid: true, message: 'Coupon is valid' };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(orderValue) {
  if (orderValue < this.minOrderValue) {
    return {
      discount: 0,
      message: `Minimum order value of ₹${this.minOrderValue} required`
    };
  }

  let discount = 0;
  
  if (this.type === 'percentage') {
    discount = (orderValue * this.discount) / 100;
    if (this.maxDiscount) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else if (this.type === 'fixed') {
    discount = Math.min(this.discount, orderValue);
  }

  return {
    discount: Math.round(discount),
    message: 'Discount applied successfully'
  };
};

// Index for faster queries
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ validTo: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
