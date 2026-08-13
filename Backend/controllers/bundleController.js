const Bundle = require('../models/Bundle');

// @desc    Create a new bundle
// @route   POST /api/bundles
// @access  Admin
exports.createBundle = async (req, res) => {
  try {
    const bundle = new Bundle(req.body);
    await bundle.save();
    
    res.status(201).json({
      success: true,
      message: 'Bundle created successfully',
      data: bundle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bundles
// @route   GET /api/bundles
// @access  Public
exports.getAllBundles = async (req, res) => {
  try {
    const { active } = req.query;
    const query = active ? { active: true } : {};
    
    const bundles = await Bundle.find(query)
      .sort({ priority: -1, createdAt: -1 });
    
    // Filter by validity
    const validBundles = bundles.filter(bundle => bundle.isValid());
    
    res.json({
      success: true,
      count: validBundles.length,
      data: validBundles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get bundle by ID
// @route   GET /api/bundles/:id
// @access  Public
exports.getBundleById = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }
    
    res.json({
      success: true,
      data: bundle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update bundle
// @route   PUT /api/bundles/:id
// @access  Admin
exports.updateBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Bundle updated successfully',
      data: bundle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete bundle
// @route   DELETE /api/bundles/:id
// @access  Admin
exports.deleteBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findByIdAndDelete(req.params.id);
    
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Bundle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Validate cart for bundle discounts
// @route   POST /api/bundles/validate
// @access  Public
exports.validateCartForBundles = async (req, res) => {
  try {
    const { cartItems, cartTotal } = req.body;
    
    if (!cartItems || !cartTotal) {
      return res.status(400).json({
        success: false,
        message: 'Cart items and total are required'
      });
    }
    
    // Get all active bundles
    const bundles = await Bundle.find({ active: true })
      .sort({ priority: -1 });
    
    // Find applicable bundles
    const applicableBundles = [];
    
    for (const bundle of bundles) {
      if (!bundle.isValid()) continue;
      
      // Check minimum order value
      if (bundle.minOrderValue && cartTotal < bundle.minOrderValue) continue;
      
      let isApplicable = false;
      let discount = 0;
      
      switch (bundle.bundleType) {
        case 'percentage':
        case 'fixed':
          isApplicable = true;
          discount = bundle.calculateDiscount(cartTotal, cartItems);
          break;
          
        case 'buyXgetY':
          // Check if required products are in cart
          const hasRequiredProducts = bundle.products.every(bundleProduct => {
            const cartItem = cartItems.find(item => item.productId === bundleProduct.productId);
            return cartItem && cartItem.quantity >= bundleProduct.quantity;
          });
          
          if (hasRequiredProducts) {
            isApplicable = true;
            // Calculate discount for free/discounted products
          }
          break;
          
        case 'category':
          // Check if cart has items from the specified category
          const hasCategoryItems = cartItems.some(item => 
            item.category === bundle.rules.categoryName
          );
          
          if (hasCategoryItems) {
            isApplicable = true;
            discount = bundle.calculateDiscount(cartTotal, cartItems);
          }
          break;
      }
      
      if (isApplicable && discount > 0) {
        applicableBundles.push({
          bundleId: bundle._id,
          name: bundle.name,
          description: bundle.description,
          discount: discount,
          finalPrice: cartTotal - discount
        });
      }
    }
    
    // Return the best bundle (highest discount)
    if (applicableBundles.length > 0) {
      applicableBundles.sort((a, b) => b.discount - a.discount);
      
      res.json({
        success: true,
        hasApplicableBundles: true,
        recommendedBundle: applicableBundles[0],
        allApplicableBundles: applicableBundles
      });
    } else {
      res.json({
        success: true,
        hasApplicableBundles: false,
        message: 'No applicable bundles for this cart'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Increment bundle usage count
// @route   POST /api/bundles/:id/use
// @access  Private
exports.incrementBundleUsage = async (req, res) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(
      req.params.id,
      { $inc: { usageCount: 1 } },
      { new: true }
    );
    
    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: 'Bundle not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Bundle usage incremented'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
