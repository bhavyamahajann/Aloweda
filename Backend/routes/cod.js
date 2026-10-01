const express = require('express');
const router = express.Router();
const { sendOrderEmail } = require('../utils/emailService');

// @desc    Place COD order + send email notification
// @route   POST /api/cod/place-order
// @access  Public
router.post('/place-order', async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ success: false, message: 'Customer details required' });
    }

    const orderId = 'COD-' + Date.now();

    // Send email notification
    await sendOrderEmail({
      customer,
      items,
      total,
      paymentMethod: 'Cash on Delivery (COD)',
      orderId,
    });

    res.json({
      success: true,
      message: 'Order placed successfully!',
      orderId,
    });
  } catch (error) {
    console.error('COD order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
