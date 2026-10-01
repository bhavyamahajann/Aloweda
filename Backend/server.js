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

// Health check - no DB needed
app.get('/', (req, res) => {
  res.send('Auth backend is running ✅');
});

// MongoDB connection
let cachedConn = null;

async function connectDB() {
  if (cachedConn && mongoose.connection.readyState === 1) return cachedConn;
  
  cachedConn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    family: 4,
  });
  console.log('MongoDB connected ✅');
  return cachedConn;
}

// DB middleware - runs before every route except health check
app.use(async (req, res, next) => {
  if (req.path === '/') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB error:', err.message);
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

app.get('/api/profile', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

// Local dev server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
}

module.exports = app;
