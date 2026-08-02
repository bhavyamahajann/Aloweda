require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
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

// Example protected route - login ke baad hi access hoga
app.get('/api/profile', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ message: 'User nahi mila' });
  res.json({ user });
});

// Health check
app.get('/', (req, res) => {
  res.send('Backend is working ✅');
});

// MongoDB se connect karo
const PORT = process.env.PORT || 5000;

// MongoDB connection - Vercel ke liye optimize
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

// Local development ke liye server start karo
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server chal raha hai: http://localhost:${PORT}`);
  });
}

// Vercel ke liye app export karo
module.exports = app;
