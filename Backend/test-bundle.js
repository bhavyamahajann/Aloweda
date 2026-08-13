// Quick Bundle Creator Script
// Run: node test-bundle.js

require('dotenv').config();
const mongoose = require('mongoose');
const Bundle = require('./models/Bundle');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Sample Bundles
const sampleBundles = [
  {
    name: "Starter Kit Bundle - 20% OFF",
    description: "Buy any 2 products and get 20% instant discount!",
    bundleType: "percentage",
    rules: {
      discountPercentage: 20
    },
    minOrderValue: 500,
    active: true,
    priority: 1
  },
  {
    name: "Premium Care - Flat ₹200 OFF",
    description: "Shop for ₹1000 or more and save ₹200",
    bundleType: "fixed",
    rules: {
      fixedDiscount: 200
    },
    minOrderValue: 1000,
    active: true,
    priority: 2
  },
  {
    name: "Mega Saver - 25% OFF",
    description: "Buy 3 or more products and get 25% discount!",
    bundleType: "percentage",
    rules: {
      discountPercentage: 25
    },
    minOrderValue: 800,
    active: true,
    priority: 3
  }
];

// Create Bundles
async function createBundles() {
  try {
    // Clear existing bundles (optional)
    await Bundle.deleteMany({});
    console.log('🗑️ Existing bundles cleared');

    // Create new bundles
    const created = await Bundle.insertMany(sampleBundles);
    console.log(`✅ ${created.length} bundles created successfully!`);
    
    created.forEach((bundle, index) => {
      console.log(`\n${index + 1}. ${bundle.name}`);
      console.log(`   Type: ${bundle.bundleType}`);
      console.log(`   Min Order: ₹${bundle.minOrderValue}`);
      console.log(`   Active: ${bundle.active}`);
    });

    console.log('\n🎉 All done! Bundles ready to use.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating bundles:', error);
    process.exit(1);
  }
}

createBundles();
