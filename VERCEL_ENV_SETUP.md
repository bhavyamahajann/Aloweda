# 🚀 Vercel Environment Variables Setup

## Required Environment Variables for Backend

Vercel Dashboard → Your Project → Settings → Environment Variables mein yeh add karo:

### 1. MongoDB Connection
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aloweda?retryWrites=true&w=majority
```
**Important:** Apna actual MongoDB Atlas connection string use karo (Atlas dashboard se copy karo)

### 2. JWT Secret
```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_xyz123
```

### 3. Client URL
```
CLIENT_URL=https://aloweda-smoky.vercel.app
```

### 4. SMTP Email (Titan Email)
```
EMAIL_USER=orders@aloweda.com
EMAIL_PASS=your_actual_titan_email_password
```

### 5. Admin Configuration
```
ADMIN_EMAILS=admin@aloweda.com,mahajanbhavya22@gmail.com
```

### 6. Feature Configuration
```
FREE_SHIPPING_THRESHOLD=999
ONLINE_DISCOUNT_PERCENTAGE=10
```

### 7. Node Environment
```
NODE_ENV=production
```

### 8. Port (optional)
```
PORT=5000
```

---

## ✅ Steps to Add in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your **Backend** project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `MONGO_URI`
   - Value: `your_mongodb_connection_string`
   - Environment: Select **Production**, **Preview**, **Development** (all three)
   - Click **Save**
5. Repeat for all variables above

---

## 🔄 After Adding Variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋯** (three dots) → **Redeploy**
4. Wait for deployment to complete

---

## 🔍 MongoDB Atlas Cluster Resume:

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Select your cluster (Cluster0)
3. If paused, click **Resume** or **Connect** button
4. Cluster will be active in 1-2 minutes

---

## 📧 Titan Email SMTP Settings:

If you need to verify Titan email settings:
- **Host:** smtp.titan.email
- **Port:** 465
- **Secure:** true (SSL/TLS)
- **Username:** orders@aloweda.com
- **Password:** Your Titan email password

---

## 🧪 Testing After Deployment:

Test these endpoints:
```bash
# Health check
https://your-backend.vercel.app/

# Get bundles
https://your-backend.vercel.app/api/bundles

# Create account (from frontend)
https://aloweda-smoky.vercel.app/
```

---

## 🐛 Common Issues:

### Issue: "Database connection failed"
**Fix:** Resume MongoDB Atlas cluster + verify MONGO_URI in Vercel

### Issue: "Email not sending"
**Fix:** Add EMAIL_USER and EMAIL_PASS in Vercel environment variables

### Issue: "CORS error"
**Fix:** Verify CLIENT_URL matches your frontend URL

---

## 📝 Notes:

- Environment variables mein **NO SPACES** around `=` sign
- Strings with special characters ko quotes mein na rakho Vercel dashboard mein
- Har variable ke liye **Production**, **Preview**, aur **Development** select karo
- Changes ke baad **Redeploy** zaruri hai

