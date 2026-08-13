const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  bundleType: {
    type: String,
    enum: ['buyXgetY', 'fixed', 'percentage', 'category'],
    required: true
  },
  products: [{
    productId: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  rules: {
    buyQuantity: {
      type: Number,
      default: 1
    },
    getQuantity: {
      type: Number,
      default: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    fixedDiscount: {
      type: Number,
      min: 0
    },
    fixedPrice: {
      type: Number,
      min: 0
    },
    categoryName: String
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number
  },
  active: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTo: {
    type: Date
  },
  usageCount: {
    type: Number,
    default: 0
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Method to check if bundle is currently valid
bundleSchema.methods.isValid = function() {
  const now = new Date();
  if (!this.active) return false;
  if (this.validFrom && this.validFrom > now) return false;
  if (this.validTo && this.validTo < now) return false;
  return true;
};

// Method to calculate discount
bundleSchema.methods.calculateDiscount = function(cartTotal, products) {
  if (!this.isValid()) return 0;

  switch (this.bundleType) {
    case 'percentage':
      let discount = (cartTotal * this.rules.discountPercentage) / 100;
      if (this.maxDiscount) {
        discount = Math.min(discount, this.maxDiscount);
      }
      return discount;
    
    case 'fixed':
      return Math.min(this.rules.fixedDiscount, cartTotal);
    
    case 'buyXgetY':
      // Calculate based on product quantity
      return 0; // Implementation based on specific product logic
    
    default:
      return 0;
  }
};

module.exports = mongoose.model('Bundle', bundleSchema);
