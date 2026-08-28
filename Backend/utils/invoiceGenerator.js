const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate optimized invoice PDF
 * Compact, professional design with reduced file size
 */
class InvoiceGenerator {
  constructor(order) {
    this.order = order;
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 30,
      compress: true // Enable compression for smaller file size
    });
  }

  async generate(outputPath) {
    const stream = fs.createWriteStream(outputPath);
    this.doc.pipe(stream);

    this.addHeader();
    this.addCompanyInfo();
    this.addCustomerInfo();
    this.addOrderInfo();
    this.addItemsTable();
    this.addPricingSummary();
    this.addFooter();

    this.doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }

  addHeader() {
    // Invoice title
    this.doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('TAX INVOICE', { align: 'center' })
      .moveDown(0.3);
  }

  addCompanyInfo() {
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('ALOWEDA', { align: 'left' })
      .font('Helvetica')
      .fontSize(8)
      .text('Premium Dermatologist-Tested Skincare', { align: 'left' })
      .text('GST: [YOUR_GST_NUMBER]', { align: 'left' })
      .text('Email: support@aloweda.com', { align: 'left' })
      .text('Phone: +91-XXXXXXXXXX', { align: 'left' })
      .moveDown(0.5);

    // Horizontal line
    this.doc
      .moveTo(30, this.doc.y)
      .lineTo(565, this.doc.y)
      .stroke();
    
    this.doc.moveDown(0.5);
  }

  addCustomerInfo() {
    const { customerInfo } = this.order;
    const startY = this.doc.y;

    // Billing Address
    this.doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('BILL TO:', 30, startY)
      .font('Helvetica')
      .text(customerInfo.name, 30)
      .text(customerInfo.email, 30)
      .text(customerInfo.phone, 30);

    if (customerInfo.address) {
      const addr = customerInfo.address;
      this.doc
        .text(`${addr.street}, ${addr.city}`, 30)
        .text(`${addr.state} - ${addr.pincode}`, 30);
    }

    // Shipping Address (same column, below)
    this.doc
      .moveDown(0.3)
      .font('Helvetica-Bold')
      .text('SHIP TO:', 30)
      .font('Helvetica')
      .text('Same as billing address', 30);

    // Order details on the right
    this.doc
      .font('Helvetica-Bold')
      .text('Invoice No:', 350, startY)
      .font('Helvetica')
      .text(this.order.orderId, 450, startY, { align: 'right' })
      .font('Helvetica-Bold')
      .text('Invoice Date:', 350)
      .font('Helvetica')
      .text(new Date(this.order.createdAt).toLocaleDateString('en-IN'), 450, undefined, { align: 'right' })
      .font('Helvetica-Bold')
      .text('Order Date:', 350)
      .font('Helvetica')
      .text(new Date(this.order.createdAt).toLocaleDateString('en-IN'), 450, undefined, { align: 'right' })
      .font('Helvetica-Bold')
      .text('Payment Method:', 350)
      .font('Helvetica')
      .text(this.order.paymentMethod, 450, undefined, { align: 'right' });

    this.doc.moveDown(1);
  }

  addOrderInfo() {
    // Horizontal line
    this.doc
      .moveTo(30, this.doc.y)
      .lineTo(565, this.doc.y)
      .stroke();
    
    this.doc.moveDown(0.5);
  }

  addItemsTable() {
    const tableTop = this.doc.y;
    const itemCodeX = 30;
    const descriptionX = 120;
    const quantityX = 380;
    const priceX = 450;
    const amountX = 520;

    // Table header
    this.doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('ITEM', itemCodeX, tableTop)
      .text('DESCRIPTION', descriptionX, tableTop)
      .text('QTY', quantityX, tableTop)
      .text('PRICE', priceX, tableTop)
      .text('AMOUNT', amountX, tableTop);

    // Header underline
    this.doc
      .moveTo(30, tableTop + 15)
      .lineTo(565, tableTop + 15)
      .stroke();

    let y = tableTop + 20;

    // Table rows
    this.doc.font('Helvetica').fontSize(7);

    this.order.items.forEach((item, index) => {
      if (y > 700) {
        this.doc.addPage();
        y = 50;
      }

      const itemTotal = item.price * item.quantity;

      this.doc
        .text(index + 1, itemCodeX, y)
        .text(item.name, descriptionX, y, {
          width: 250,
          height: 30,
          ellipsis: true
        })
        .text(item.quantity, quantityX, y)
        .text(`₹${item.price}`, priceX, y)
        .text(`₹${itemTotal}`, amountX, y);

      y += 25;
    });

    // Bottom line
    this.doc
      .moveTo(30, y)
      .lineTo(565, y)
      .stroke();

    this.doc.y = y + 10;
  }

  addPricingSummary() {
    const { pricing } = this.order;
    const labelX = 380;
    const valueX = 520;
    let y = this.doc.y;

    this.doc.fontSize(8).font('Helvetica');

    // Subtotal
    this.doc
      .text('Subtotal:', labelX, y)
      .text(`₹${pricing.subtotal}`, valueX, y, { align: 'right' });
    y += 15;

    // Bundle discount
    if (pricing.bundleDiscount > 0) {
      this.doc
        .text('Bundle Discount:', labelX, y)
        .text(`- ₹${pricing.bundleDiscount}`, valueX, y, { align: 'right' });
      y += 15;
    }

    // Coupon discount
    if (pricing.couponDiscount > 0) {
      this.doc
        .text('Coupon Discount:', labelX, y)
        .text(`- ₹${pricing.couponDiscount}`, valueX, y, { align: 'right' });
      y += 15;
    }

    // Online payment discount
    if (pricing.onlinePaymentDiscount > 0) {
      this.doc
        .text('Online Payment Discount:', labelX, y)
        .text(`- ₹${pricing.onlinePaymentDiscount}`, valueX, y, { align: 'right' });
      y += 15;
    }

    // Shipping
    if (pricing.shippingCharges > 0) {
      this.doc
        .text('Shipping Charges:', labelX, y)
        .text(`₹${pricing.shippingCharges}`, valueX, y, { align: 'right' });
      y += 15;
    }

    // Tax
    if (pricing.tax > 0) {
      this.doc
        .text('Tax (GST):', labelX, y)
        .text(`₹${pricing.tax}`, valueX, y, { align: 'right' });
      y += 15;
    }

    // Line before total
    this.doc
      .moveTo(380, y)
      .lineTo(565, y)
      .stroke();
    y += 10;

    // Total
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Total Amount:', labelX, y)
      .text(`₹${pricing.total}`, valueX, y, { align: 'right' });

    this.doc.moveDown(2);
  }

  addFooter() {
    this.doc
      .fontSize(7)
      .font('Helvetica')
      .text('Thank you for shopping with Aloweda!', { align: 'center' })
      .text('For support: support@aloweda.com | +91-XXXXXXXXXX', { align: 'center' })
      .moveDown(0.5)
      .fontSize(6)
      .text('This is a computer-generated invoice and does not require a signature.', { align: 'center' });
  }
}

/**
 * Generate invoice PDF for an order
 * @param {object} order - Order object
 * @param {string} outputDir - Output directory path
 * @returns {Promise<string>} Path to generated PDF
 */
exports.generateInvoice = async (order, outputDir = './invoices') => {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `invoice_${order.orderId}.pdf`;
  const outputPath = path.join(outputDir, filename);

  const generator = new InvoiceGenerator(order);
  await generator.generate(outputPath);

  return outputPath;
};
