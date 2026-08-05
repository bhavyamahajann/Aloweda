# 🚀 Backend Authentication System - Complete Guide

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Files Explanation](#files-explanation)
4. [Security Best Practices](#security-best-practices)
5. [Environment Variables](#environment-variables)
6. [Deployment on Vercel](#deployment-on-vercel)
7. [Common Interview Questions](#common-interview-questions)
8. [API Endpoints Summary](#api-endpoints-summary)
9. [Testing with Postman](#testing-with-postman)

---

## 1. Tech Stack

- **Backend Framework:** Express.js (Node.js)
- **Database:** MongoDB Atlas (Cloud Database)
- **ODM:** Mongoose (MongoDB Object Data Modeling)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs (Password Hashing)
- **CORS:** Cross-Origin Resource Sharing middleware
- **Deployment:** Vercel (Serverless Functions)

---

## 2. Project Structure

```
Backend/
├── server.js           # Main application entry point
├── routes/
│   └── auth.js         # Authentication routes (signup, login)
├── models/
│   └── User.js         # User database schema
├── middleware/
│   └── auth.js         # JWT verification middleware
├── .env                # Environment variables (secrets)
├── package.json        # Dependencies
└── vercel.json         # Vercel deployment config
```

---

## 3. Files Explanation

### A. `server.js` - Main Application File

**Purpose:** Application entry point, sets up Express server, connects to MongoDB

**Key Components:**

#### 1. Dependencies Import
```javascript
require('dotenv').config();        // Load environment variables
const express = require('express'); // Web framework
const cors = require('cors');       // Enable cross-origin requests
const mongoose = require('mongoose'); // MongoDB ODM
```

#### 2. CORS Configuration
```javascript
app.use(cors({ 
  origin: [
    'https://aloweda-smoky.vercel.app',  // Production frontend
    'http://localhost:5173',              // Local development
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
```
**Why?** Allows frontend (different domain) to make requests to backend

#### 3. MongoDB Connection
```javascript
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));
```

#### 4. Routes
```javascript
app.use('/api/auth', authRoutes);  // Mount auth routes at /api/auth
```

#### 5. Vercel Serverless Export
```javascript
module.exports = app;  // Export for Vercel Functions
```

---

### B. `models/User.js` - User Schema

**Purpose:** Define database structure for users

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

**Key Points:**
- `unique: true` on email prevents duplicate accounts
- `timestamps: true` adds `createdAt` and `updatedAt` automatically
- Password is stored as **hashed** (never plain text!)

---

### C. `routes/auth.js` - Authentication Routes

**Purpose:** Handle signup and login requests

#### 1. Signup Flow

```javascript
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  // 1. Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password too short' });
  }
  
  // 2. Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  // 3. Hash password (NEVER store plain text!)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // 4. Create user in database
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });
  
  // 5. Generate JWT token
  const token = generateToken(user._id);
  
  // 6. Send response
  res.status(201).json({
    message: 'Account created successfully',
    token,
    user: { id: user._id, name: user.name, email: user.email }
  });
});
```

#### 2. Login Flow

```javascript
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  
  // 2. Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  // 3. Compare password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
