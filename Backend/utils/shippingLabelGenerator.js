const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Generate shipping label PDF
 * Optimized for A5, A6, and thermal printer formats
 */
class ShippingLabelGenerator {
  constructor(order, format = 'A5') {
    this.order = order;
    this.format = format;
    
    // Define label dimensions
    this.dimensions = {
      'A5': { width: 420, height: 595 }, // A5 in points (148mm x 210mm)
      'A6': { width: 298, height: 420 }, // A6 in points (105mm x 148mm)
      'thermal': { width: 288, height: 432 } // 4x6 inch thermal label
    };
    
    const size = this.dimensions[format] || this.dimensions['A5'];
    this.doc = new PDFDocument({
      size: [size.width, size.height],
      margin: 20,
      compress: true
    });
  }

  async generate(outputPath) {
    const stream = fs.createWriteStream(outputPath);
    this.doc.pipe(stream);

    await this.addContent();

    this.doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    });
  }

  async addContent() {
    const { width, height } = this.dimensions[this.format] || this.dimensions['A5'];
    const margin = 20;
    const contentWidth = width - (margin * 2);

    // Header with logo placeholder
    this.doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('ALOWEDA', margin, margin, { align: 'center' })
      .fontSize(8)
      .font('Helvetica')
      .text('Premium Ayurvedic Skincare', { align: 'center' })
      .moveDown(0.5);

    // Order ID prominently displayed
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(`Order ID: ${this.order.orderId}`, margin, undefined, {
        align: 'center'
      })
      .moveDown(1);

    // Line separator
    this.doc
      .moveTo(margin, this.doc.y)
      .lineTo(width - margin, this.doc.y)
      .stroke();
    
    this.doc.moveDown(0.5);

    // SHIP TO section
    const { customerInfo } = this.order;
    
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('SHIP TO:', margin)
      .moveDown(0.3);

    // Customer name (large and bold)
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(customerInfo.name.toUpperCase(), margin)
      .moveDown(0.5);

    // Address
    this.doc
      .fontSize(11)
      .font('Helvetica');

    if (customerInfo.address) {
      const addr = customerInfo.address;
      this.doc
        .text(addr.street, margin, undefined, { width: contentWidth })
        .text(`${addr.city}, ${addr.state}`, margin)
        .text(`PIN: ${addr.pincode}`, margin)
        .text(addr.country || 'India', margin);
    }

    this.doc.moveDown(0.5);

    // Phone number (large)
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`Phone: ${customerInfo.phone}`, margin)
      .moveDown(1);

    // Line separator
    this.doc
      .moveTo(margin, this.doc.y)
      .lineTo(width - margin, this.doc.y)
      .stroke();
    
    this.doc.moveDown(0.5);

    // Order details
    this.doc
      .fontSize(9)
      .font('Helvetica')
      .text(`Order Date: ${new Date(this.order.createdAt).toLocaleDateString('en-IN')}`, margin)
      .text(`Payment: ${this.order.paymentMethod}`, margin)
      .text(`Items: ${this.order.items.length}`, margin)
      .text(`Total: ₹${this.order.pricing.total}`, margin)
      .moveDown(1);

    // QR Code
    await this.addQRCode(margin, width, contentWidth);

    // Tracking info if available
    if (this.order.trackingInfo && this.order.trackingInfo.trackingNumber) {
      this.doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`Tracking: ${this.order.trackingInfo.trackingNumber}`, margin, undefined, {
          align: 'center'
        });
    }

    // Footer
    this.doc
      .fontSize(7)
      .font('Helvetica')
      .text('Handle with care | Fragile', margin, height - 40, {
        align: 'center'
      });
  }

  async addQRCode(margin, width, contentWidth) {
    try {
      // Generate QR code data
      const qrData = JSON.stringify({
        orderId: this.order.orderId,
        customer: this.order.customerInfo.name,
        phone: this.order.customerInfo.phone,
        total: this.order.pricing.total
      });

      // Generate QR code as buffer
      const qrCodeBuffer = await QRCode.toBuffer(qrData, {
        width: 150,
        margin: 1
      });

      // Calculate center position
      const qrSize = 150;
      const qrX = (width - qrSize) / 2;

      // Add QR code to PDF
      this.doc.image(qrCodeBuffer, qrX, this.doc.y, {
        width: qrSize,
        height: qrSize
      });

      this.doc.moveDown(8); // Move past QR code
    } catch (error) {
      console.error('Error generating QR code:', error);
      this.doc.text('QR Code generation failed', { align: 'center' });
    }
  }
}

/**
 * Generate shipping label PDF for an order
 * @param {object} order - Order object
 * @param {string} format - Label format: 'A5', 'A6', or 'thermal'
 * @param {string} outputDir - Output directory path
 * @returns {Promise<string>} Path to generated PDF
 */
exports.generateShippingLabel = async (order, format = 'A5', outputDir = './labels') => {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `label_${order.orderId}_${format}.pdf`;
  const outputPath = path.join(outputDir, filename);

  const generator = new ShippingLabelGenerator(order, format);
  await generator.generate(outputPath);

  return outputPath;
};

/**
 * Generate shipping labels in multiple formats
 * @param {object} order - Order object
 * @param {array} formats - Array of formats ['A5', 'A6', 'thermal']
 * @param {string} outputDir - Output directory path
 * @returns {Promise<object>} Paths to generated PDFs
 */
exports.generateMultipleLabels = async (order, formats = ['A5'], outputDir = './labels') => {
  const results = {};

  for (const format of formats) {
    try {
      const path = await exports.generateShippingLabel(order, format, outputDir);
      results[format] = path;
    } catch (error) {
      console.error(`Error generating ${format} label:`, error);
      results[format] = null;
    }
  }

  return results;
};
