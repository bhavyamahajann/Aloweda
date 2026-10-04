const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send order notification email to admin + confirmation to customer (if email provided)
 */
async function sendOrderEmail({ customer, items, total, paymentMethod, orderId }) {
  // Temporarily disabled until Gmail App Password is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️ Email not configured. Skipping email notification.');
    return;
  }
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0ebe3;">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0ebe3;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0ebe3;text-align:right;">${item.price}</td>
    </tr>
  `).join('');

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf8f4;padding:32px;border-radius:12px;">
      <div style="background:#2c2416;padding:20px 32px;border-radius:8px;margin-bottom:24px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🛒 New Order Received!</h1>
        <p style="color:#c8a96e;margin:4px 0 0;">Order ID: #${orderId}</p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <h3 style="color:#2c2416;margin-top:0;">Customer Details</h3>
        <p style="margin:4px 0;color:#4a3728;"><strong>Name:</strong> ${customer.name}</p>
        <p style="margin:4px 0;color:#4a3728;"><strong>Phone:</strong> ${customer.phone}</p>
        <p style="margin:4px 0;color:#4a3728;"><strong>Email:</strong> ${customer.email || 'Not provided'}</p>
        <p style="margin:4px 0;color:#4a3728;"><strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}</p>
        <p style="margin:4px 0;color:#4a3728;"><strong>Payment:</strong> <span style="color:${paymentMethod === 'COD' ? '#e67e22' : '#27ae60'};font-weight:bold;">${paymentMethod}</span></p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <h3 style="color:#2c2416;margin-top:0;">Order Items</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f0ebe3;">
              <th style="padding:8px 12px;text-align:left;color:#2c2416;">Product</th>
              <th style="padding:8px 12px;text-align:center;color:#2c2416;">Qty</th>
              <th style="padding:8px 12px;text-align:right;color:#2c2416;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align:right;margin-top:16px;font-size:18px;font-weight:bold;color:#2c2416;">
          Total: ₹${total}
        </div>
      </div>

      <p style="color:#6b5f4e;font-size:13px;text-align:center;">
        Order placed on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </p>
    </div>
  `;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf8f4;padding:32px;border-radius:12px;">
      <div style="background:#2c2416;padding:20px 32px;border-radius:8px;margin-bottom:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">✅ Order Confirmed!</h1>
        <p style="color:#c8a96e;margin:4px 0 0;">Thank you for shopping with Aloweda</p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <p style="color:#4a3728;">Hi <strong>${customer.name}</strong>,</p>
        <p style="color:#4a3728;">Your order <strong>#${orderId}</strong> has been placed successfully!</p>
        <p style="color:#4a3728;"><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p style="color:#4a3728;"><strong>Delivering to:</strong> ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}</p>
      </div>

      <div style="background:#fff;padding:24px;border-radius:8px;margin-bottom:16px;">
        <h3 style="color:#2c2416;margin-top:0;">Your Order</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f0ebe3;">
              <th style="padding:8px 12px;text-align:left;color:#2c2416;">Product</th>
              <th style="padding:8px 12px;text-align:center;color:#2c2416;">Qty</th>
              <th style="padding:8px 12px;text-align:right;color:#2c2416;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="text-align:right;margin-top:16px;font-size:18px;font-weight:bold;color:#2c2416;">
          Total: ₹${total}
        </div>
      </div>

      <div style="background:#c8a96e20;padding:16px 24px;border-radius:8px;border-left:4px solid #c8a96e;">
        <p style="color:#4a3728;margin:0;font-size:14px;">
          📦 We will process your order within 1 business day.<br/>
          Delivery typically takes 5–7 business days.
        </p>
      </div>

      <p style="color:#6b5f4e;font-size:13px;text-align:center;margin-top:24px;">
        Questions? Email us at ajay@aloweda.com
      </p>
    </div>
  `;

  // Send to admin
  await transporter.sendMail({
    from: `"Aloweda Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🛒 New Order #${orderId} — ₹${total} (${paymentMethod})`,
    html: adminHtml,
  });

  // Send to customer if email provided
  if (customer.email) {
    await transporter.sendMail({
      from: `"Aloweda" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `✅ Order Confirmed — Aloweda #${orderId}`,
      html: customerHtml,
    });
  }
}

module.exports = { sendOrderEmail };
