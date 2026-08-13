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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

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

// MongoDB se connect karo
const PORT = process.env.PORT || 5000;

// MongoDB connection - Vercel optimized
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected ✅');
    })
    .catch((err) => {
      console.error('MongoDB connection error ❌:', err.message);
    });
}

// Local development server start
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;
