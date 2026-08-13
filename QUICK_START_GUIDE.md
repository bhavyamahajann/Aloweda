# 🚀 Quick Start Guide - Aloweda E-Commerce Enhancements

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

---

## 📦 Step 1: Install Dependencies

### Backend
```bash
cd Backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## ⚙️ Step 2: Configure Environment Variables

### Backend Configuration

Create or update `Backend/.env`:

```env
# Database
MONGO_URI=mongodb://localhost:27017/aloweda
# OR use MongoDB Atlas
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aloweda

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Server Configuration
PORT=5000
NODE_ENV=development

# Client Configuration
CLIENT_URL=http://localhost:5173

# Admin Configuration
ADMIN_EMAILS=admin@aloweda.com

# Feature Configuration
FREE_SHIPPING_THRESHOLD=999
ONLINE_DISCOUNT_PERCENTAGE=10
```

### Frontend Configuration

Create or update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🗄️ Step 3: Set Up Database

### Option 1: Create Admin User via MongoDB

Open MongoDB shell or Compass and run:

```javascript
use aloweda

// Create an admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@aloweda.com",
  password: "$2a$10$YourHashedPasswordHere", // Hash using bcrypt
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Option 2: Register via API then Update Role

1. Register a user via `/api/auth/register`
2. Update the user's role in MongoDB:

```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🏃 Step 4: Start the Servers

### Terminal 1 - Backend
```bash
cd Backend
npm run dev
```

Backend will run on: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🧪 Step 5: Test the Implementation

### 1. Test Announcement Bar

**Create an announcement:**
```bash
curl -X POST http://localhost:5000/api/announcements \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "🎉 Free Shipping on Orders Above ₹999",
    "backgroundColor": "#ff6b6b",
    "textColor": "#ffffff",
    "isActive": true
  }'
```

**Visit frontend:** You should see the announcement bar at the top.

### 2. Test Coupon System

**Create a coupon:**
```bash
curl -X POST http://localhost:5000/api/coupons \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "type": "percentage",
    "discount": 10,
    "minOrderValue": 500,
    "validTo": "2025-12-31",
    "isActive": true
  }'
```

**Test validation:**
```bash
curl -X POST http://localhost:5000/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "orderValue": 1000,
    "cartItems": []
  }'
```

### 3. Test Bundle System

**Create a bundle:**
```bash
curl -X POST http://localhost:5000/api/bundles \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Care Bundle",
    "description": "Get 20% off on skincare products",
    "bundleType": "percentage",
    "rules": {
      "discountPercentage": 20
    },
    "minOrderValue": 500,
    "active": true
  }'
```

### 4. Test Review System

**Submit a review (requires authentication):**
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "1",
    "rating": 5,
    "title": "Amazing product!",
    "comment": "I love this product. Highly recommended!"
  }'
```

**Get product reviews:**
```bash
curl http://localhost:5000/api/reviews/product/1
```

---

## 🎨 Step 6: Integrate Components in Frontend

### Add Announcement Bar to App.jsx

```javascript
import AnnouncementBar from './Components/AnnouncementBar/AnnouncementBar';

function App() {
  return (
    <>
      <AnnouncementBar />
      {/* Rest of your app */}
    </>
  );
}
```

### Add Coupon Input to Cart/Checkout

```javascript
import CouponInput from './Components/Coupon/CouponInput';

function Cart() {
  const [cartTotal, setCartTotal] = useState(1000);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = (couponData) => {
    setAppliedCoupon(couponData);
    // Update pricing
  };

  return (
    <div>
      {/* Cart items */}
      <CouponInput 
        cartTotal={cartTotal}
        cartItems={[]}
        onApplyCoupon={handleApplyCoupon}
      />
    </div>
  );
}
```

### Add Payment Selector to Checkout

```javascript
import PaymentSelector from './Components/Payment/PaymentSelector';

function Checkout() {
  const [subtotal, setSubtotal] = useState(1000);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const handlePaymentChange = (info) => {
    setPaymentInfo(info);
    // Update final total with discount
  };

  return (
    <div>
      {/* Checkout form */}
      <PaymentSelector 
        subtotal={subtotal}
        onPaymentChange={handlePaymentChange}
      />
    </div>
  );
}
```

---

## 📊 Step 7: Access Admin Features

### Get Admin Token

1. Login as admin user via `/api/auth/login`
2. Copy the JWT token from response
3. Use this token in Authorization header for admin routes

### Example Admin API Calls

**View all coupons:**
```bash
curl http://localhost:5000/api/coupons \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Get coupon analytics:**
```bash
curl http://localhost:5000/api/coupons/analytics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Approve a review:**
```bash
curl -X PUT http://localhost:5000/api/reviews/REVIEW_ID/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "isApproved": true }'
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Cannot connect to MongoDB
**Solution:** 
- Check if MongoDB is running
- Verify MONGO_URI in .env
- Check network connectivity for MongoDB Atlas

### Issue 2: Admin routes return 403
**Solution:**
- Ensure user has role: 'admin' in database
- Check if email is in ADMIN_EMAILS env variable
- Verify JWT token is valid

### Issue 3: CORS errors
**Solution:**
- Verify CLIENT_URL in backend .env matches frontend URL
- Check cors configuration in server.js

### Issue 4: Announcements not showing
**Solution:**
- Check if any announcements are marked as active
- Verify startDate and endDate
- Check API response in browser console

---

## 📝 Creating Sample Data

### Sample Announcement
```javascript
{
  text: "🎉 Free Shipping on Orders Above ₹999",
  backgroundColor: "#ff6b6b",
  textColor: "#ffffff",
  isActive: true,
  order: 0
}
```

### Sample Coupon
```javascript
{
  code: "WELCOME10",
  description: "Welcome discount for new users",
  type: "percentage",
  discount: 10,
  minOrderValue: 500,
  maxDiscount: 200,
  usageLimit: 100,
  validFrom: new Date(),
  validTo: new Date('2025-12-31'),
  isActive: true
}
```

### Sample Bundle
```javascript
{
  name: "Summer Skincare Bundle",
  description: "Complete summer care at 25% off",
  bundleType: "percentage",
  rules: {
    discountPercentage: 25
  },
  minOrderValue: 1000,
  active: true,
  priority: 1
}
```

---

## 🎯 Next Steps

1. ✅ **Backend is ready** - All APIs are functional
2. ✅ **Basic frontend components created**
3. ⏳ **Integrate components in existing pages**
4. ⏳ **Build admin panel UI**
5. ⏳ **Add SEO optimization**
6. ⏳ **Implement review UI**
7. ⏳ **Add bundle selection UI**

---

## 📚 Resources

- **API Documentation**: See `IMPLEMENTATION_SUMMARY.md`
- **Full Roadmap**: See `IMPLEMENTATION_ROADMAP.md`
- **Model Schemas**: Check `Backend/models/` directory
- **API Routes**: Check `Backend/routes/` directory

---

## 💡 Tips

1. **Use Postman/Insomnia** for testing API endpoints
2. **Check browser console** for frontend errors
3. **Monitor backend logs** for API errors
4. **Use MongoDB Compass** for database visualization
5. **Install React DevTools** for component debugging

---

## 🆘 Need Help?

1. Check the implementation summary
2. Review the API endpoint documentation
3. Check server logs for errors
4. Verify environment variables
5. Test API endpoints directly with curl/Postman

---

**Version**: 1.0
**Last Updated**: Now
**Status**: Backend Complete, Frontend In Progress

Happy Coding! 🚀
