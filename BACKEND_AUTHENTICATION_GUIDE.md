# Backend Authentication System - Complete Guide

## 🚀 Tech Stack

- **Backend Framework:** Express.js (Node.js)
- **Database:** MongoDB Atlas (Cloud Database)
- **ODM:** Mongoose (MongoDB Object Data Modeling)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcryptjs (Password Hashing)
- **CORS:** Cross-Origin Resource Sharing middleware
- **Deployment:** Vercel (Serverless Functions)

---

## 📁 Project Structure

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

## 📝 Files Explanation

### **1. `server.js` - Main Application File**

**Purpose:** Application entry point, sets up Express server, connects to MongoDB

#### Key Components:

**Dependencies Import:**
```javascript
require('dotenv').config();        // Load environment variables
const express = require('express'); // Web framework
const cors = require('cors');       // Enable cross-origin requests
const mongoose = require('mongoose'); // MongoDB ODM
```

**CORS Configuration:**
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

**MongoDB Connection:**
```javascript
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));
```

**Routes:**
```javascript
app.use('/api/auth', authRoutes);  // Mount auth routes at /api/auth
```

**Vercel Serverless Export:**
```javascript
module.exports = app;  // Export for Vercel Functions
```

---

### **2. `models/User.js` - User Schema**

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

### **3. `routes/auth.js` - Authentication Routes**

**Purpose:** Handle signup and login requests

#### **A. Signup Flow:**

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

#### **B. Login Flow:**

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
  
  // 4. Generate JWT token
  const token = generateToken(user._id);
  
  // 5. Send response
  res.json({
    message: 'Login successful',
    token,
    user: { id: user._id, name: user.name, email: user.email }
  });
});
```

#### **C. JWT Token Generation:**

```javascript
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },              // Payload
    process.env.JWT_SECRET,      // Secret key
    { expiresIn: '7d' }          // Token expires in 7 days
  );
};
```

---

### **4. `middleware/auth.js` - Protected Routes**

**Purpose:** Verify JWT token for protected routes

```javascript
const protect = (req, res, next) => {
  // 1. Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please login first' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // 2. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Attach user ID to request
    next();  // Continue to route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
```

**Usage Example:**
```javascript
app.get('/api/profile', protect, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ user });
});
```

---

## 🔒 Security Best Practices Implemented

✅ **Password Hashing:** bcrypt with salt (10 rounds)
✅ **JWT Authentication:** Stateless, scalable
✅ **CORS Protection:** Whitelist specific origins
✅ **Environment Variables:** Secrets stored in `.env`, never committed to Git
✅ **Input Validation:** Check required fields and constraints
✅ **Error Handling:** Try-catch blocks, proper HTTP status codes
✅ **URL Encoding:** Special characters in MongoDB password (`@` → `%40`)

---

## 🌍 Environment Variables

```env
MONGO_URI=mongodb+srv://aloweda_admin:Aloweda%402024@cluster0.2vp1wpb.mongodb.net/aloweda?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=https://aloweda-smoky.vercel.app
NODE_ENV=production
```

**Important Notes:**
- Never commit `.env` file to Git
- URL encode special characters in passwords (`@` becomes `%40`)
- Use strong JWT secret (random 32+ characters)

---

## 🚀 Deployment on Vercel

**`vercel.json` configuration:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Deployment Steps:**
1. Push code to GitHub
2. Connect Vercel to GitHub repository
3. Set root directory to `Backend`
4. Add environment variables in Vercel dashboard
5. Deploy!

**Why Vercel?**
- Serverless functions (no server management)
- Auto-scaling
- Global CDN
- Easy GitHub integration (auto-deploy on push)

---

## 📡 API Endpoints Summary

| Method | Endpoint | Purpose | Auth Required | Request Body |
|--------|----------|---------|---------------|--------------|
| GET | `/` | Health check | ❌ | - |
| POST | `/api/auth/signup` | Create new account | ❌ | `{ name, email, password }` |
| POST | `/api/auth/login` | Login user | ❌ | `{ email, password }` |
| GET | `/api/profile` | Get user profile | ✅ | - |

---

## 🧪 Testing with Postman/Thunder Client

### **Signup Request:**
```http
POST https://aloweda-scwy.vercel.app/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### **Login Request:**
```http
POST https://aloweda-scwy.vercel.app/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### **Protected Route (Profile):**
```http
GET https://aloweda-scwy.vercel.app/api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-08-05T10:30:00.000Z",
    "updatedAt": "2026-08-05T10:30:00.000Z"
  }
}
```

---

## 💡 Common Interview Questions & Answers

### **Q1: Why use JWT instead of sessions?**
**A:** JWT is stateless (no server storage needed), scalable (works across multiple servers), and mobile-friendly. Sessions require server memory and don't work well with load balancers.

### **Q2: Why hash passwords?**
**A:** If database is compromised, hackers can't see plain passwords. Bcrypt is one-way encryption (can't reverse). Even identical passwords produce different hashes due to salt.

### **Q3: What is bcrypt salt?**
**A:** Random data added to password before hashing. Prevents rainbow table attacks (precomputed hash tables). Each password gets unique hash even if same text.

### **Q4: Why CORS?**
**A:** Browsers block requests from different origins (domains) for security. CORS middleware allows trusted origins to make requests.

### **Q5: What if JWT token is stolen?**
**A:** 
- Use HTTPS (prevents man-in-the-middle attacks)
- Short expiry times (7 days max)
- Refresh tokens for long sessions
- Store in httpOnly cookies (not localStorage - vulnerable to XSS)
- Implement token blacklist on logout

### **Q6: How to handle MongoDB connection in serverless?**
**A:** Check connection state before connecting to avoid multiple connections. Serverless functions may reuse containers, so connection might already exist.

```javascript
if (mongoose.connection.readyState === 0) {
  await mongoose.connect(process.env.MONGO_URI);
}
```

### **Q7: What are HTTP status codes used?**
- **200:** Success (login, get profile)
- **201:** Created (signup)
- **400:** Bad request (validation errors)
- **401:** Unauthorized (invalid/missing token)
- **404:** Not found (user doesn't exist)
- **500:** Server error (database errors, crashes)

### **Q8: How does bcrypt.compare work?**
**A:** It extracts the salt from stored hash, hashes the input password with same salt, and compares results. No need to store salt separately!

### **Q9: What is middleware in Express?**
**A:** Functions that execute before route handlers. They have access to `req`, `res`, and `next()`. Used for authentication, logging, validation, etc.

### **Q10: Difference between authentication and authorization?**
- **Authentication:** Verifying who you are (login)
- **Authorization:** Verifying what you can access (permissions)

---

## 🛠️ Troubleshooting Common Issues

### **Issue 1: MongoDB Connection Error**
**Error:** `MongooseError: Operation 'users.findOne()' buffering...`

**Solutions:**
- Check `MONGO_URI` is correct (no typos in cluster name)
- URL encode special characters in password (`@` → `%40`)
- Verify IP whitelist in MongoDB Atlas (allow `0.0.0.0/0` for Vercel)
- Check database user has correct permissions

### **Issue 2: CORS Error**
**Error:** `Access to fetch has been blocked by CORS policy`

**Solutions:**
- Add frontend URL to CORS whitelist
- Include `credentials: true` in CORS config
- Check frontend sends correct origin header

### **Issue 3: JWT Token Invalid**
**Error:** `Invalid or expired token`

**Solutions:**
- Check `JWT_SECRET` is same in .env and Vercel
- Token might be expired (check `expiresIn`)
- Token format: `Bearer <token>` (space after Bearer)
- Don't include quotes in Authorization header

### **Issue 4: Password Not Matching**
**Error:** User can't login after signup

**Solutions:**
- Ensure password is hashed before saving
- Use `bcrypt.compare()` for login (not direct comparison)
- Check salt rounds (10 is standard)

---

## 📦 Dependencies (package.json)

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",      // Password hashing
    "cors": "^2.8.5",          // CORS middleware
    "dotenv": "^16.3.1",       // Environment variables
    "express": "^4.18.2",      // Web framework
    "jsonwebtoken": "^9.0.2",  // JWT tokens
    "mongoose": "^8.0.3"       // MongoDB ODM
  }
}
```

---

## 🎯 Key Takeaways

1. **Never store passwords in plain text** - always hash with bcrypt
2. **JWT tokens are stateless** - no server storage needed
3. **Environment variables keep secrets safe** - never commit to Git
4. **CORS protects against unauthorized origins** - whitelist trusted domains
5. **Middleware provides reusable logic** - authentication, validation, logging
6. **Proper error handling is crucial** - use try-catch and status codes
7. **MongoDB Atlas provides cloud database** - no server setup needed
8. **Vercel enables serverless deployment** - auto-scaling and CDN

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas)
- [Vercel Documentation](https://vercel.com/docs)

---

**Created by:** Bhavya Mahajan  
**Project:** Aloweda E-commerce Platform  
**Date:** August 5, 2026

---

**Good luck with your interviews! 💪🚀**
