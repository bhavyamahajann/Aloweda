import { useState } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import './Cart.css'

export default function Cart({ cart = [], onNavigate, onUpdateQuantity, onRemoveItem, onLoginClick, cartCount = 0 }) {
  // Early return for testing - this will show if component is even rendering
  console.log('🔥 CART COMPONENT LOADING...', { cart, cartCount });
  
  const [promoCode, setPromoCode] = useState('')
  const [appliedBundle, setAppliedBundle] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cod') // 'cod' or 'online'
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  
  // Safety check for cart
  const safeCart = Array.isArray(cart) ? cart : [];
  
  console.log('=== CART COMPONENT RENDER ===');
  console.log('Cart prop:', safeCart);
  console.log('Cart length:', safeCart.length);
  console.log('Cart count:', cartCount);
  console.log('===========================');

  // Calculate totals - with safety checks
  const subtotal = safeCart.reduce((total, item) => {
    try {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
      return total + (price * (item.quantity || 1))
    } catch (error) {
      console.error('Error calculating price for item:', item, error);
      return total;
    }
  }, 0)

  // Multi-buy discount (3+ items get ₹70 off)
  const totalItems = safeCart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const multiBuyDiscount = totalItems >= 3 ? 70 : 0

  // COD payment discount (10% if COD payment selected)
  const codPaymentDiscount = paymentMethod === 'cod' ? subtotal * 0.10 : 0

  // Coupon discount
  const couponDiscount = appliedCoupon ? parseFloat(appliedCoupon.discount) || 0 : 0

  const bundleDiscount = appliedBundle ? parseFloat(appliedBundle.discount) || 0 : 0
  const shipping = subtotal > 999 ? 0 : 50
  const total = subtotal - bundleDiscount - multiBuyDiscount - codPaymentDiscount - couponDiscount + shipping

  // Debug logs
  console.log('=== CART CALCULATION DEBUG ===');
  console.log('Cart Items:', safeCart.length);
  console.log('Total Items:', totalItems);
  console.log('Subtotal:', subtotal);
  console.log('Multi-buy Discount (3+ items):', multiBuyDiscount);
  console.log('Payment Method:', paymentMethod);
  console.log('COD Payment Discount (10%):', codPaymentDiscount);
  console.log('Applied Bundle:', appliedBundle);
  console.log('Bundle Discount:', bundleDiscount);
  console.log('Shipping:', shipping);
  console.log('Total:', total);
  console.log('============================');

  const handleBundleApply = (bundleData) => {
    console.log('Bundle Applied:', bundleData);
    console.log('Bundle Discount:', bundleData?.discount);
    console.log('Discount Type:', typeof bundleData?.discount);
    console.log('Discount Value:', bundleData?.discount);
    setAppliedBundle(bundleData)
  }

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    setCouponError('')
    
    // Simulate API call (replace with actual API when backend ready)
    const validCoupons = {
      'WELCOME10': { code: 'WELCOME10', discount: subtotal * 0.10, type: 'percentage' },
      'SAVE50': { code: 'SAVE50', discount: 50, type: 'fixed' },
      'SAVE100': { code: 'SAVE100', discount: 100, type: 'fixed' },
      'FIRST20': { code: 'FIRST20', discount: subtotal * 0.20, type: 'percentage' }
    }

    const coupon = validCoupons[promoCode.toUpperCase()]
    
    if (coupon) {
      setAppliedCoupon(coupon)
      setCouponError('')
    } else {
      setCouponError('Invalid coupon code')
      setAppliedCoupon(null)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setPromoCode('')
    setCouponError('')
  }

  const handleCheckout = () => {
    // Check if total items exceed limit
    if (totalItems > 4) {
      alert('⚠️ Maximum 4 items allowed per order!\n\nYou currently have ' + totalItems + ' items in cart.\nPlease reduce the quantity to proceed to checkout.')
      return
    }
    
    alert('Checkout functionality coming soon!')
    // TODO: Implement checkout
  }

  return (
    <div className="cart-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />
      
      <div className="cart-container" style={{ minHeight: '80vh', background: '#faf8f4' }}>
        <div className="cart-header">
          <h1 style={{ color: '#2c2416', fontSize: '2.5rem' }}>Shopping Cart</h1>
          <p style={{ color: '#6b5f4e' }}>{safeCart.length} {safeCart.length === 1 ? 'item' : 'items'} ({totalItems} total quantity)</p>
          {totalItems > 4 && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffc107',
              padding: '8px 12px',
              borderRadius: '6px',
              marginTop: '10px',
              fontSize: '13px',
              color: '#856404'
            }}>
              ⚠️ <strong>Maximum 4 items per order.</strong> Please reduce quantity to checkout.
            </div>
          )}
        </div>

        {safeCart.length === 0 ? (
          <div className="cart-empty" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: '#9b8e7c', marginBottom: '24px' }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#2c2416', marginBottom: '12px' }}>Your cart is empty</h2>
            <p style={{ fontSize: '1rem', color: '#6b5f4e', marginBottom: '32px' }}>Add some products to get started!</p>
            <button 
              className="shop-now-btn" 
              onClick={() => onNavigate('shop')}
              style={{
                background: 'linear-gradient(135deg, #e8dcc4 0%, #d4c5a9 100%)',
                color: '#2c2416',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer'
              }}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              {safeCart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  
                  <div className="cart-item__details">
                    <h3 className="cart-item__name">{item.name}</h3>
                    <p className="cart-item__category">{item.category}</p>
                    <p className="cart-item__price">{item.price}</p>
                  </div>

                  <div className="cart-item__actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => {
                          if (totalItems >= 4) {
                            alert('⚠️ Maximum 4 items allowed per order!\n\nYou already have 4 items in cart.')
                            return
                          }
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }}
                        aria-label="Increase"
                        disabled={totalItems >= 4}
                        style={{
                          opacity: totalItems >= 4 ? 0.5 : 1,
                          cursor: totalItems >= 4 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className="remove-btn" 
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle Selector - Temporarily disabled */}
            {/* {cart.length > 0 && (
              <BundleSelector 
                cartItems={cart}
                onApplyBundle={handleBundleApply}
              />
            )} */}

            {/* Order Summary */}
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({safeCart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>

              {/* Multi-buy Discount */}
              {multiBuyDiscount > 0 && (
                <div className="summary-row discount" style={{color: '#28a745', fontWeight: 'bold'}}>
                  <span>Multi-Buy Discount (3+ items)</span>
                  <span style={{color: '#dc3545'}}>- ₹ {multiBuyDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* COD Payment Discount */}
              {codPaymentDiscount > 0 && (
                <div className="summary-row discount" style={{color: '#28a745', fontWeight: 'bold'}}>
                  <span>Cash on Delivery Discount (10%)</span>
                  <span style={{color: '#dc3545'}}>- ₹ {codPaymentDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Coupon Discount */}
              {couponDiscount > 0 && appliedCoupon && (
                <div className="summary-row discount" style={{color: '#28a745', fontWeight: 'bold'}}>
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span style={{color: '#dc3545'}}>- ₹ {couponDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Debug Panel - Shows calculation details */}
              {process.env.NODE_ENV === 'development' && appliedBundle && (
                <div style={{
                  background: '#f8f9fa',
                  border: '1px dashed #6c757d',
                  padding: '10px',
                  margin: '10px 0',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}>
                  <strong>🔍 DEBUG INFO:</strong>
                  <div>Subtotal: {subtotal}</div>
                  <div>Bundle Discount: {bundleDiscount} (type: {typeof bundleDiscount})</div>
                  <div>Shipping: {shipping}</div>
                  <div>Calculation: {subtotal} - {bundleDiscount} + {shipping} = {total}</div>
                  <div>Applied Bundle: {JSON.stringify(appliedBundle, null, 2)}</div>
                </div>
              )}

              {appliedBundle && bundleDiscount > 0 && (
                <div className="summary-row discount" style={{color: '#28a745', fontWeight: 'bold'}}>
                  <span>Bundle Discount ({appliedBundle.bundleName})</span>
                  <span style={{color: '#dc3545'}}>- ₹ {bundleDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹ ${shipping}`}</span>
              </div>

              {(bundleDiscount > 0 || multiBuyDiscount > 0 || codPaymentDiscount > 0 || couponDiscount > 0) && (
                <div style={{
                  background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                  padding: '12px',
                  borderRadius: '8px',
                  margin: '10px 0',
                  textAlign: 'center',
                  border: '2px solid #28a745'
                }}>
                  <strong style={{color: '#155724', fontSize: '14px'}}>
                    🎉 You're saving ₹{(bundleDiscount + multiBuyDiscount + codPaymentDiscount + couponDiscount).toFixed(2)}!
                  </strong>
                </div>
              )}

              {subtotal < 999 && (
                <p className="free-shipping-note">
                  Add ₹ {(999 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              )}

              {totalItems === 2 && (
                <p className="free-shipping-note" style={{color: '#ff6b6b'}}>
                  🎁 Add 1 more item to get ₹70 Multi-Buy Discount!
                </p>
              )}

              {totalItems >= 3 && multiBuyDiscount > 0 && (
                <p className="free-shipping-note" style={{color: '#28a745'}}>
                  ✅ Multi-Buy Discount Applied! You saved ₹{multiBuyDiscount}
                </p>
              )}

              {/* Premium Coupon Code Section */}
              <div className="coupon-section">
                {!appliedCoupon ? (
                  <div className="coupon-input-wrapper">
                    <div className="coupon-input-container">
                      <div className="coupon-input-group">
                        <div className="input-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value.toUpperCase())
                            setCouponError('')
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="coupon-input"
                        />
                        <button onClick={handleApplyCoupon} className="coupon-apply-btn">
                          Apply
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {couponError && (
                      <div className="coupon-error-toast">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#dc3545" strokeWidth="2" />
                          <line x1="12" y1="8" x2="12" y2="12" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="12" cy="16" r="1" fill="#dc3545" />
                        </svg>
                        <span>{couponError}</span>
                      </div>
                    )}
                    
                    <div className="coupon-suggestions">
                      <div className="suggestions-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span>Available Offers</span>
                      </div>
                      <div className="suggestions-grid">
                        {[
                          { code: 'WELCOME10', desc: '10% off on first order', color: '#667eea' },
                          { code: 'SAVE50', desc: 'Flat ₹50 discount', color: '#764ba2' },
                          { code: 'SAVE100', desc: 'Flat ₹100 discount', color: '#f093fb' },
                          { code: 'FIRST20', desc: '20% off for new users', color: '#4facfe' }
                        ].map(({ code, desc, color }) => (
                          <button
                            key={code}
                            onClick={() => {
                              setPromoCode(code)
                              setCouponError('')
                            }}
                            className="suggestion-card"
                            style={{ '--card-color': color }}
                          >
                            <div className="suggestion-code">{code}</div>
                            <div className="suggestion-desc">{desc}</div>
                            <div className="suggestion-action">
                              <span>Apply</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="coupon-applied-card">
                    <div className="applied-content">
                      <div className="applied-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="#28a745" />
                          <polyline points="9 12 11 14 15 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="applied-details">
                        <div className="applied-code">{appliedCoupon.code}</div>
                        <div className="applied-message">Coupon applied successfully</div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="remove-coupon-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>

              {totalItems > 4 && (
                <div style={{
                  background: '#fff3cd',
                  border: '2px solid #ffc107',
                  padding: '12px',
                  borderRadius: '8px',
                  margin: '10px 0',
                  textAlign: 'center'
                }}>
                  <strong style={{color: '#856404', fontSize: '14px', display: 'block', marginBottom: '5px'}}>
                    ⚠️ Order Limit Exceeded
                  </strong>
                  <span style={{color: '#856404', fontSize: '13px'}}>
                    You have {totalItems} items. Maximum 4 items allowed per order.
                    <br />
                    Please reduce quantity to checkout.
                  </span>
                </div>
              )}

              {/* Payment Method Selection */}
              <div style={{margin: '20px 0'}}>
                <h3 style={{fontSize: '16px', marginBottom: '12px', fontWeight: '600'}}>Select Payment Method</h3>
                
                {/* COD Option with Discount Badge */}
                <div 
                  onClick={() => setPaymentMethod('cod')}
                  style={{
                    border: paymentMethod === 'cod' ? '2px solid #28a745' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    background: paymentMethod === 'cod' ? '#f0f9f4' : '#fff',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Discount Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '12px',
                    background: '#28a745',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    SAVE 10%
                  </div>
                  
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid ' + (paymentMethod === 'cod' ? '#28a745' : '#999'),
                      background: paymentMethod === 'cod' ? '#28a745' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {paymentMethod === 'cod' && <span style={{color: '#fff', fontSize: '12px'}}>✓</span>}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '600', fontSize: '15px', marginBottom: '4px'}}>
                        💵 Cash on Delivery
                      </div>
                      <div style={{fontSize: '13px', color: '#666'}}>
                        Pay when you receive your order
                      </div>
                      {paymentMethod === 'cod' && (
                        <div style={{
                          marginTop: '8px',
                          color: '#28a745',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          ✓ You save ₹{codPaymentDiscount.toFixed(2)} with Cash on Delivery!
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Online Payment Option */}
                <div 
                  onClick={() => setPaymentMethod('online')}
                  style={{
                    border: paymentMethod === 'online' ? '2px solid #28a745' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    background: paymentMethod === 'online' ? '#f0f9f4' : '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '2px solid ' + (paymentMethod === 'online' ? '#28a745' : '#999'),
                      background: paymentMethod === 'online' ? '#28a745' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {paymentMethod === 'online' && <span style={{color: '#fff', fontSize: '12px'}}>✓</span>}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '600', fontSize: '15px', marginBottom: '4px'}}>
                        💳 Online Payment
                      </div>
                      <div style={{fontSize: '13px', color: '#666'}}>
                        UPI, Cards, Net Banking
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="checkout-btn" 
                onClick={handleCheckout}
                disabled={totalItems > 4}
                style={{
                  opacity: totalItems > 4 ? 0.5 : 1,
                  cursor: totalItems > 4 ? 'not-allowed' : 'pointer'
                }}
              >
                {totalItems > 4 ? '⚠️ Reduce Items to Checkout' : 'Proceed to Checkout'}
              </button>

              <button className="continue-shopping-btn" onClick={() => onNavigate('shop')}>
                Continue Shopping
              </button>

              <div className="cart-features">
                <div className="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Fast Delivery</span>
                </div>
                <div className="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}
