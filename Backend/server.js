require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const protect = require('./middleware/auth');
const User = require('./models/user');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
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
  res.send('Auth backend chal raha hai ✅');
});

// MongoDB se connect karo, phir server start karo
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');
    app.listen(PORT, () => {
      console.log(`Server chal raha hai: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error ❌:', err.message);
  });