require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const bundleRoutes = require('./routes/bundle');
const couponRoutes = require('./routes/coupon');
const announcementRoutes = require('./routes/announcement');
const reviewRoutes = require('./routes/review');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');
const codRoutes = require('./routes/cod');
const protect = require('./middleware/auth');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors({ 
  origin: [
    'https://aloweda-smoky.vercel.app',
    'http://localhost:5173',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Ensure DB connected before each request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cod', codRoutes);

// Example protected route - only accessible after login
app.get('/api/profile', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

// Health check
app.get('/', (req, res) => {
  res.send('Auth backend is running ✅');
});

// Debug route - remove after testing
app.get('/api/debug', (req, res) => {
  const uri = process.env.MONGO_URI || 'NOT SET';
  res.json({ 
    mongoUriSet: !!process.env.MONGO_URI,
    mongoUriLength: uri.length,
    mongoUriStart: uri.substring(0, 30),
    dbState: mongoose.connection.readyState
  });
});

// MongoDB se connect karo
const PORT = process.env.PORT || 5000;

// MongoDB connection - Vercel serverless optimized
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    isConnected = true;
    console.log('MongoDB connected ✅');
  } catch (err) {
    console.error('MongoDB connection error ❌:', err.message);
    throw err;
  }
}

// Connect on startup
connectDB();

// Local development server start
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;
