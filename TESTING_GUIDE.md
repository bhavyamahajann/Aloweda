# Testing Guide - Quick Reference

## 🚀 Start Services

```bash
# Terminal 1: Backend
cd Backend
npm start

# Terminal 2: Frontend  
cd frontend
npm run dev
```

---

## ✅ Test Bundle Discount

### Setup:
```bash
cd Backend
node test-bundle.js
```

### Test:
1. Open: http://localhost:5173
2. Add products (total > ₹1000)
3. Go to Cart
4. Click "Apply This Bundle"
5. **Check:** Total should reduce by discount amount

### Debug:
- Open browser console (F12)
- Look for: "Bundle Applied" logs
- Check gray debug panel in cart

---

## ✅ Test Announcement Bar

### Create Announcement via API:
```bash
POST http://localhost:5000/api/announcements
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Free Shipping",
  "message": "Free Shipping on Orders Above ₹999",
  "active": true,
  "priority": 1
}
```

### Verify:
- Announcement should appear at top of site
- Should auto-rotate if multiple announcements
- Can close with X button

---

## ✅ Test About Page

### Navigate:
http://localhost:5173/about

### Check:
- [ ] Hero section loads
- [ ] Story section visible
- [ ] Consultation section shows
- [ ] Dr. Ajay card displays
- [ ] "Book Consultation" button works

### Add Image:
1. Place image in: `frontend/public/images/`
   - `dr-ajay.jpg`
2. Refresh page

---

## ⚠️ Test Coupon (Not Integrated Yet)

### Create Coupon via API:
```bash
POST http://localhost:5000/api/coupons
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "code": "SAVE10",
  "discountType": "percentage",
  "discountValue": 10,
  "expiresAt": "2026-12-31",
  "usageLimit": 100,
  "active": true
}
```

### Note:
CouponInput component exists but NOT integrated in Cart yet.

---

## 📊 Check What's Working

| Feature | Test URL/Method | Status |
|---------|-----------------|--------|
| Bundle Discount | Cart page | ✅ Test now |
| Announcement Bar | Any page (top) | ✅ Working |
| About Page | /about | ✅ Working |
| Reviews | ProductDetail | ❌ Not integrated |
| Coupons | Cart | ❌ Not integrated |
| Checkout | /checkout | ⚠️ Partial |

---

## 🐛 Common Issues

### Bundle not showing:
- Check: Backend running?
- Check: Cart total > ₹1000?
- Fix: Run `node test-bundle.js`

### About page 404:
- Check: Frontend running?
- Check: URL is /about (lowercase)

### Announcement not showing:
- Check: Created via API?
- Check: `active: true`?
- Check: Browser cache cleared?

---

## 📸 Client Data Checklist

Before final deployment, get from client:

- [ ] Dr. Ajay photo
- [ ] WhatsApp number
- [ ] Company social media links
- [ ] SEO keywords
- [ ] Customer reviews (if any)

---

**Quick Test Time:** 15 minutes
**Full Test Time:** 30 minutes


---

## ✅ Test Build My Regimen

### Navigate:
http://localhost:5173/build-my-regimen

### Test All Steps:

**Step 1 - Skin Concerns:**
- [ ] Can select multiple concerns
- [ ] Selected items highlighted
- [ ] Can proceed only if at least 1 selected

**Step 2 - Bundle Type:**
- [ ] Can select routine type
- [ ] Only one selection allowed
- [ ] Can proceed after selection

**Step 3 - Skin Type:**
- [ ] Can select skin type
- [ ] Only one selection allowed
- [ ] Options: Oily, Dry, Combination, Sensitive, Normal

**Step 4 - Photo Upload:**
- [ ] Can upload image (JPG/PNG)
- [ ] Shows error if file > 5MB
- [ ] Shows error if wrong file type
- [ ] Can replace/remove image
- [ ] Can skip (optional step)

**Step 5 - Consultation Form:**
- [ ] Name field required
- [ ] Email field required (with validation)
- [ ] Phone field required
- [ ] Age optional
- [ ] Additional concerns optional
- [ ] Current routine optional
- [ ] Allergies optional
- [ ] Consent checkbox required
- [ ] Can't submit without required fields

**Results Page:**
- [ ] Shows after completing all steps
- [ ] Displays personalized recommendations
- [ ] Can navigate to products

### Backend Integration Needed:
- ❌ API endpoint to save regimen data
- ❌ Email service integration (send recommendations)
- ❌ Photo upload to cloud storage (AWS S3/Cloudinary)
- ❌ Product recommendation algorithm
