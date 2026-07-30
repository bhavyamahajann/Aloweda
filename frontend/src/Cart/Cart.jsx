import { useState } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import './Cart.css'

export default function Cart({ cart, onNavigate, onUpdateQuantity, onRemoveItem, onLoginClick, cartCount }) {
  const [promoCode, setPromoCode] = useState('')

  // Calculate totals
  const subtotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ''))
    return total + (price * item.quantity)
  }, 0)

  const shipping = subtotal > 999 ? 0 : 50
  const total = subtotal + shipping

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!')
    // TODO: Implement checkout
  }

  return (
    <div className="cart-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />
      
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button className="shop-now-btn" onClick={() => onNavigate('shop')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              {cart.map((item) => (
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
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase"
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

            {/* Order Summary */}
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹ ${shipping}`}</span>
              </div>

              {subtotal < 999 && (
                <p className="free-shipping-note">
                  Add ₹ {(999 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              )}

              <div className="promo-code">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button>Apply</button>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
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

      <Footer />
    </div>
  )
}
