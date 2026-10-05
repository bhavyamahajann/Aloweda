# 🔍 Vercel Environment Variable Check

## Database Connection Failed - Debug Steps:

### 1️⃣ Check Vercel Environment Variables
```
Go to: https://vercel.com/dashboard
→ Select Backend Project
→ Settings → Environment Variables
```

**Look for these variables:**
- ✅ `MONGO_URI` - MongoDB connection string
- ✅ `JWT_SECRET` - Any random string
- ✅ `CLIENT_URL` - https://aloweda-smoky.vercel.app
- ✅ `EMAIL_USER` - Your email
- ✅ `EMAIL_PASS` - Your email password

### 2️⃣ MONGO_URI Should Look Like:
```
mongodb+srv://aloweda_admin:YOUR_PASSWORD@cluster0.zvplwpb.mongodb.net/aloweda?retryWrites=true&w=majority
```

**Important:**
- Replace `YOUR_PASSWORD` with actual MongoDB password
- Add `/aloweda` database name before `?`
- Must have `?retryWrites=true&w=majority`

### 3️⃣ Check Deployment Logs
```
Vercel Dashboard → Deployments → Latest Deployment → Runtime Logs
```

Look for errors like:
- ❌ "MongoServerSelectionError"
- ❌ "MONGO_URI is not defined"
- ❌ "Database connection failed"

### 4️⃣ After Adding/Fixing Variables:
```
1. Go to Deployments tab
2. Click latest deployment
3. Click ⋯ (three dots) → Redeploy
4. Wait 30-60 seconds
5. Test signup again
```

---

## 🔧 Quick Fix Commands:

### Add MONGO_URI via Vercel CLI (if you have it):
```bash
vercel env add MONGO_URI production
```

### Or use Vercel Dashboard (easier):
```
Settings → Environment Variables → Add New
Name: MONGO_URI
Value: mongodb+srv://aloweda_admin:PASSWORD@cluster0.zvplwpb.mongodb.net/aloweda?retryWrites=true&w=majority
Select: Production, Preview, Development (all three)
Click: Save
```

---

## 🧪 Test Connection:

After redeployment, test:
```
https://your-backend-url.vercel.app/
```

Should show: "Auth backend is running ✅"

Then test signup on:
```
https://aloweda-smoky.vercel.app/
```

---

## Common Mistakes:

1. ❌ Forgot to add `/aloweda` database name in connection string
2. ❌ Wrong password in MONGO_URI
3. ❌ MongoDB cluster is paused (we already fixed this!)
4. ❌ Forgot to redeploy after adding environment variables
5. ❌ Added variables only to Production, not Preview/Development

