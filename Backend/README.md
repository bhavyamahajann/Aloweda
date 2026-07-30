# Aloweda Backend API

Authentication aur user management ke liye Express.js backend.

## 🚀 Features

- ✅ User Registration (Signup)
- ✅ User Login with JWT
- ✅ Password Hashing (bcrypt)
- ✅ Protected Routes
- ✅ MongoDB Database
- ✅ CORS enabled

## 📦 Installation

### 1. Dependencies install karo:

```bash
cd Backend
npm install
```

### 2. Environment Variables setup karo:

`.env` file banao aur ye variables add karo:

```env
MONGO_URI=mongodb://localhost:27017/aloweda
JWT_SECRET=your_super_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. MongoDB setup karo:

**Option A: Local MongoDB**
- MongoDB install karo (https://www.mongodb.com/try/download/community)
- MongoDB service start karo

**Option B: MongoDB Atlas (Cloud)**
- MongoDB Atlas account banao (https://www.mongodb.com/cloud/atlas)
- Cluster banao aur connection string copy karo
- `.env` file mein `MONGO_URI` update karo

## 🏃 Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server chalega: `http://localhost:5000`

## 📡 API Endpoints

### 1. Health Check
```
GET /
```
Response: "Auth backend chal raha hai ✅"

### 2. User Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Success Response:
```json
{
  "message": "Account successfully ban gaya",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Success Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 4. Get User Profile (Protected Route)
```
GET /api/profile
Authorization: Bearer your_jwt_token_here
```

Success Response:
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔐 JWT Token Usage

Login ya signup ke baad jo token milta hai, usse protected routes access karne ke liye use karo:

```
Authorization: Bearer <your_token_here>
```

Token 7 days ke liye valid rehta hai.

## 📁 Project Structure

```
Backend/
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   └── user.js           # User schema (MongoDB)
├── routes/
│   └── auth.js           # Auth routes (signup, login)
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore file
├── package.json         # Dependencies
├── README.md            # Documentation
└── server.js            # Main server file
```

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin requests

## 🐛 Troubleshooting

### MongoDB connection error:
- Check karo ki MongoDB service chal rahi hai
- `.env` file mein `MONGO_URI` sahi hai
- Network connectivity check karo

### JWT token invalid:
- Token expire ho gaya ho sakta hai (7 days ke baad)
- Dobara login karke nayi token lo

### CORS error:
- `.env` file mein `CLIENT_URL` sahi set karo
- Frontend ka URL exact match hona chahiye

## 📝 Notes

- Password minimum 6 characters ka hona chahiye
- Email unique honi chahiye
- Token secure jagah store karo (localStorage ya httpOnly cookie)
- Production mein strong JWT_SECRET use karo

## 🚀 Deployment

### Vercel/Railway/Render pe deploy karne ke liye:
1. GitHub pe push karo
2. Platform pe project connect karo
3. Environment variables set karo
4. Deploy button click karo

Environment variables deploy karte waqt zaroor set karo! 🔥
