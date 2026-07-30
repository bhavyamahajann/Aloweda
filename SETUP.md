# 🚀 Aloweda Setup Guide

Complete setup guide for Aloweda E-commerce platform with authentication.

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas account)
- Git

## 🔧 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/bhavyamahajann/Aloweda.git
cd Aloweda
```

### 2. Backend Setup

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
npm install

# Create .env file (if not exists)
# Copy from .env.example and fill in your values
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# Use any text editor
notepad .env  # Windows
nano .env     # Linux/Mac
```

**.env Configuration:**
```env
MONGO_URI=mongodb://localhost:27017/aloweda
# Or use MongoDB Atlas connection string:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aloweda

JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
# Start backend server
npm run dev

# Server will run on http://localhost:5000
```

### 3. Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file (if not exists)
cp .env.example .env

# Edit .env with backend URL
notepad .env  # Windows
nano .env     # Linux/Mac
```

**.env Configuration:**
```env
VITE_API_URL=http://localhost:5000
```

```bash
# Start frontend development server
npm run dev

# Frontend will run on http://localhost:5173
```

## 🗄️ MongoDB Setup

### Option A: Local MongoDB

1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   - **Windows**: Services → MongoDB → Start
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

### Option B: MongoDB Atlas (Cloud - Free)

1. Create account: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGO_URI` in Backend `.env`

## ✅ Verification

### Backend Running Successfully:
1. Open browser: http://localhost:5000
2. Should see: "Auth backend chal raha hai ✅"

### Frontend Running Successfully:
1. Open browser: http://localhost:5173
2. Should see Aloweda homepage
3. Try signing up/logging in

### Test API:
```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🎯 Features

### Backend (Express.js + MongoDB)
- ✅ User Registration (Signup)
- ✅ User Login with JWT
- ✅ Password Hashing (bcrypt)
- ✅ Protected Routes
- ✅ Token-based Authentication

### Frontend (React + Vite)
- ✅ Product Catalog
- ✅ Product Hover Popups
- ✅ Shopping Cart
- ✅ User Authentication UI
- ✅ Responsive Design
- ✅ Search Functionality

## 📁 Project Structure

```
Aloweda/
├── Backend/
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── models/
│   │   └── user.js           # User schema
│   ├── routes/
│   │   └── auth.js           # Auth endpoints
│   ├── .env                  # Environment variables
│   ├── .env.example          # Template
│   ├── package.json
│   └── server.js             # Main server
│
├── frontend/
│   ├── src/
│   │   ├── Auth/
│   │   │   ├── Login.jsx     # Login/Signup modal
│   │   │   └── Login.css
│   │   ├── Component/        # Reusable components
│   │   ├── ShopPages/        # Product pages
│   │   ├── utils/
│   │   │   └── api.js        # API utilities
│   │   └── App.jsx           # Main app
│   ├── .env                  # Environment variables
│   ├── .env.example          # Template
│   └── package.json
│
└── README.md
```

## 🔐 Authentication Flow

1. **Signup**: User creates account → Password hashed → JWT token generated
2. **Login**: User logs in → Password verified → JWT token generated
3. **Protected Routes**: Token sent in header → Verified by middleware → Access granted

## 🐛 Troubleshooting

### Backend won't start:
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use: `netstat -ano | findstr :5000`

### Frontend won't connect to Backend:
- Check backend is running on port 5000
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS settings in `Backend/server.js`

### MongoDB connection error:
- Local: Check MongoDB service is running
- Atlas: Verify connection string and network access
- Check firewall settings

### Login not working:
- Open browser console (F12) for error messages
- Check network tab for API calls
- Verify backend logs

## 🚀 Deployment

### Backend (Railway/Render/Vercel):
1. Push code to GitHub
2. Connect repository
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify):
1. Push code to GitHub
2. Connect repository
3. Add `VITE_API_URL` (your backend URL)
4. Deploy

## 📝 Notes

- Default backend port: **5000**
- Default frontend port: **5173**
- JWT token expires in **7 days**
- Passwords must be **minimum 6 characters**

## 🆘 Need Help?

If you encounter issues:
1. Check error messages in terminal
2. Review this guide
3. Check browser console (F12)
4. Verify all environment variables are set

---

Happy Coding! 🎉
