# 🐛 Bundle Discount Debugging Guide

## Problem: Discount dikhai nahi de raha

Agar discount apply ho raha hai par amount change nahi ho raha, toh ye steps follow karo:

---

## ✅ Step 1: Backend Test Karo

### Method A: Quick Bundle Creator Script

```bash
cd Backend
node test-bundle.js
```

Ye script 3 sample bundles create kar dega:
1. Starter Kit - 20% OFF
2. Premium Care - ₹200 OFF
3. Mega Saver - 25% OFF

### Method B: Manual Bundle Creation

**Postman/Thunder Client mein:**

```bash
POST http://localhost:5000/api/bundles
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Test Bundle - 20% OFF",
  "description": "Testing discount calculation",
  "bundleType": "percentage",
  "rules": {
    "discountPercentage": 20
  },
  "minOrderValue": 100,
  "active": true
}
```

### Method C: Direct MongoDB Insert

```javascript
// MongoDB Compass ya Shell
use aloweda

db.bundles.insertOne({
  "name": "Test Bundle - 20% OFF",
  "description": "Testing discount",
  "bundleType": "percentage",
  "rules": {
    "discountPercentage": 20
  },
  "minOrderValue": 100,
  "active": true,
  "priority": 1,
  "usageCount": 0,
  "createdAt": new Date(),
  "updatedAt": new Date()
})
```

---

## ✅ Step 2: Check Bundle API Response

**Browser Console mein:**

```javascript
// Open browser console (F12)
// Go to Network tab
// Add products to cart
// Watch for API call to /api/bundles/validate

// Response should look like:
{
  "success": true,
  "hasApplicableBundles": true,
  "recommendedBundle": {
    "bundleId": "xxx",
    "name": "Test Bundle - 20% OFF",
    "description": "Testing discount",
    "discount": 239,        // ← Ye number hona chahiye!
    "finalPrice": 958
  }
}
```

---

## ✅ Step 3: Console Logs Check Karo

Cart page par jao aur browser console (F12) open karo:

```
Bundle Applied: {bundleId: "xxx", bundleName: "Test Bundle", discount: 239}
Bundle Discount: 239
```

Agar ye logs nahi dikhe, toh bundle apply nahi hua!

---

## ✅ Step 4: Manual Testing

### Test Case 1: Small Cart (< ₹500)

**Cart:**
- Product 1: ₹249
- Product 2: ₹199
- **Total: ₹448**

**Expected:**
- No bundle (minimum ₹500 nahi hai)

### Test Case 2: Medium Cart (₹500-₹1000)

**Cart:**
- Day Cream: ₹249
- Night Cream: ₹399
- **Subtotal: ₹648**

**Bundle:** 20% OFF
**Expected Discount:** ₹129.60 (20% of ₹648)
**Expected Total:** ₹518.40

### Test Case 3: Large Cart (> ₹1000)

**Cart:**
- Face Oil: ₹799
- Serum: ₹549
- Cream: ₹399
- **Subtotal: ₹1,747**

**Bundle:** 25% OFF
**Expected Discount:** ₹436.75 (25% of ₹1,747)
**Expected Total:** ₹1,310.25

---

## 🔍 Common Issues & Solutions

### Issue 1: Bundle Not Showing

**Symptoms:**
- BundleSelector component nahi dikha raha
- Console mein "No bundles available"

**Solutions:**

✅ **Check 1:** Cart items exist?
```javascript
// Cart.jsx mein
console.log('Cart Items:', cart);
console.log('Cart Length:', cart.length);
```

✅ **Check 2:** Bundle active hai?
```javascript
// MongoDB check
db.bundles.find({ active: true })
```

✅ **Check 3:** Minimum order value cross kiya?
```javascript
// BundleSelector.jsx mein
console.log('Cart Total:', cartTotal);
console.log('Bundle Min Order:', bundle.minOrderValue);
```

---

### Issue 2: Discount Showing But Not Applying

**Symptoms:**
- Bundle card dikha raha hai
- "Apply" button click kiya
- Par Order Summary mein discount nahi dikha

**Solutions:**

✅ **Check 1:** appliedBundle state set ho raha hai?
```javascript
// Cart.jsx mein
console.log('Applied Bundle:', appliedBundle);
```

✅ **Check 2:** Discount value correct hai?
```javascript
// Cart.jsx mein
console.log('Bundle Discount:', bundleDiscount);
console.log('Subtotal:', subtotal);
console.log('Total:', total);
```

✅ **Check 3:** CSS properly load ho raha hai?
```css
/* Check if .discount class exists */
.summary-row.discount {
  color: #28a745;
}
```

---

### Issue 3: Wrong Discount Amount

**Symptoms:**
- Discount apply ho raha hai
- Par amount galat aa raha hai

**Solutions:**

✅ **Check 1:** Backend calculation verify karo
```javascript
// bundleController.js mein
console.log('Cart Total:', cartTotal);
console.log('Discount %:', bundle.rules.discountPercentage);
console.log('Calculated Discount:', discount);
```

✅ **Check 2:** Price parsing correct hai?
```javascript
// BundleSelector.jsx mein
const price = parseInt(item.price.replace('₹ ', '').replace(',', ''));
console.log('Parsed Price:', price);
```

---

## 🧪 Quick Test Script

Browser console mein ye paste karo:

```javascript
// Test Bundle Calculation
const testCart = [
  { name: "Product 1", price: "₹ 249", quantity: 1 },
  { name: "Product 2", price: "₹ 399", quantity: 1 }
];

const subtotal = testCart.reduce((sum, item) => {
  const price = parseInt(item.price.replace('₹ ', '').replace(',', ''));
  return sum + (price * item.quantity);
}, 0);

console.log('Subtotal:', subtotal);

const discountPercent = 20;
const discount = Math.round((subtotal * discountPercent) / 100);
console.log('20% Discount:', discount);

const total = subtotal - discount;
console.log('Final Total:', total);

// Expected Output:
// Subtotal: 648
// 20% Discount: 129.6 → 130
// Final Total: 518
```

---

## 📊 Visual Verification

### Before Bundle Apply:
```
╔════════════════════════════════╗
║ Order Summary                  ║
╠════════════════════════════════╣
║ Subtotal:           ₹648.00    ║
║ Shipping:           FREE       ║
║─────────────────────────────── ║
║ Total:              ₹648.00    ║
╚════════════════════════════════╝
```

### After Bundle Apply (20% OFF):
```
╔════════════════════════════════╗
║ Order Summary                  ║
╠════════════════════════════════╣
║ Subtotal:           ₹648.00    ║
║ Bundle Discount:   -₹129.60    ║ ← New line
║ Shipping:           FREE       ║
║─────────────────────────────── ║
║ Total:              ₹518.40    ║ ← Reduced
╚════════════════════════════════╝
```

---

## 🎯 Checklist

Run ye checklist ek-ek karke:

- [ ] Backend running (`npm run dev` in Backend folder)
- [ ] Frontend running (`npm run dev` in frontend folder)
- [ ] At least 1 bundle created in MongoDB
- [ ] Bundle is active (`active: true`)
- [ ] Cart has 2+ products
- [ ] Cart total > bundle's minOrderValue
- [ ] BundleSelector component visible in cart
- [ ] Bundle card showing with discount
- [ ] "Apply This Bundle" button clickable
- [ ] Console shows "Bundle Applied" log
- [ ] Order Summary shows "Bundle Discount" row
- [ ] Total amount is reduced

---

## 💡 Pro Debug Tips

### Tip 1: Network Tab
```
1. Open Dev Tools (F12)
2. Go to Network tab
3. Filter: Fetch/XHR
4. Watch for /api/bundles/validate call
5. Check Response data
```

### Tip 2: React DevTools
```
1. Install React DevTools extension
2. Check Cart component state
3. Look for 'appliedBundle' state
4. Verify discount value
```

### Tip 3: MongoDB Compass
```
1. Connect to your database
2. Check 'bundles' collection
3. Verify document structure
4. Check 'active' field
```

---

## 🚨 Emergency Reset

Agar kuch bhi kaam nahi kar raha:

### Step 1: Clear Everything
```bash
# MongoDB
db.bundles.deleteMany({})

# Browser
localStorage.clear()
sessionStorage.clear()
# Hard refresh: Ctrl + Shift + R
```

### Step 2: Fresh Start
```bash
# Backend
cd Backend
npm install
node test-bundle.js  # Creates sample bundles
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Step 3: Test Again
```
1. Clear browser cache
2. Go to http://localhost:5173
3. Add 2 products to cart
4. Go to cart page
5. Should see bundle offer!
```

---

## 📞 Still Not Working?

Agar abhi bhi issue hai, toh ye check karo:

1. **Backend logs dekho:**
```bash
# Backend terminal mein kya errors aa rahe?
```

2. **Frontend console dekho:**
```javascript
// Browser console (F12) mein kya errors?
```

3. **MongoDB check karo:**
```bash
# Bundles collection exist karta hai?
db.bundles.find()
```

4. **Environment variables check karo:**
```bash
# Frontend .env
VITE_API_URL=http://localhost:5000

# Backend .env
MONGO_URI=your_connection_string
```

---

## ✅ Success Indicators

Jab sab kaam kar raha ho:

✅ Bundle card dikhta hai  
✅ Discount amount clear hai  
✅ Apply button responsive hai  
✅ Order Summary update hota hai  
✅ Total amount reduce hota hai  
✅ Console mein errors nahi hai  
✅ Checkout pe jane par discount carry forward hota hai  

---

**Happy Testing! 🎉**

Agar koi specific error aa raha hai, toh error message screenshot share karo!
