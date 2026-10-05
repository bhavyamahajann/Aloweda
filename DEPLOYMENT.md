# Aloweda Deployment Configuration

## Current Setup (Working)

### Frontend
- **URL:** https://aloweda-smoky.vercel.app
- **Project:** aloweda
- **Environment Variables:**
  - `VITE_API_URL=https://aloweda-jitl.vercel.app`

### Backend (Working)
- **URL:** https://aloweda-jitl.vercel.app
- **Project:** aloweda-jitl
- **Configured with:**
  - MongoDB Atlas connection (MONGO_URI)
  - JWT Secret (JWT_SECRET)
  - Client URL for CORS

### Backend (Not Used)
- **URL:** https://aloweda-scwy.vercel.app
- **Project:** aloweda-scwy
- **Status:** Missing environment variables
- **Note:** This can be deleted or fixed later

## How to Update Production

### Frontend Changes
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Vercel auto-deploys

### Backend Changes
1. Test locally with `npm start`
2. Commit and push to GitHub
3. Vercel auto-deploys

## Environment Variables Setup (Vercel Dashboard)

### Frontend (aloweda)
```
VITE_API_URL=https://aloweda-jitl.vercel.app
```

### Backend (aloweda-jitl)
```
MONGO_URI=<MongoDB Atlas connection string>
JWT_SECRET=<strong random secret>
CLIENT_URL=https://aloweda-smoky.vercel.app
NODE_ENV=production
```

## Local Development

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env to use localhost:5000
npm install
npm run dev
```

### Backend
```bash
cd Backend
cp .env.example .env
# Add your MongoDB Atlas URI
npm install
npm start
```

## Important Notes
- `.env` files are gitignored for security
- Always set environment variables in Vercel dashboard for production
- Use `aloweda-jitl` backend (already configured with MongoDB)
