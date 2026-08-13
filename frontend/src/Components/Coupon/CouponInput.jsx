import { useState } from 'react';
import './CouponInput.css';

const CouponInput = ({ cartTotal, cartItems, onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          orderValue: cartTotal,
          cartItems: cartItems || []
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppliedCoupon(data.data);
        setMessage({ 
          type: 'success', 
          text: `Coupon applied! You saved ₹${data.data.discount}` 
        });
        
        // Notify parent component
        if (onApplyCoupon) {
          onApplyCoupon(data.data);
        }
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to apply coupon. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setMessage({ type: '', text: '' });
    
    if (onApplyCoupon) {
      onApplyCoupon(null);
    }
  };

  return (
    <div className="coupon-input-container">
      <div className="coupon-header">
        <span className="coupon-icon">🎫</span>
        <h3>Have a Coupon Code?</h3>
      </div>

      {appliedCoupon ? (
        <div className="applied-coupon">
          <div className="applied-coupon-info">
            <span className="coupon-code-badge">{appliedCoupon.code}</span>
            <span className="coupon-savings">
              You saved ₹{appliedCoupon.discount}
            </span>
          </div>
          <button 
            className="remove-coupon-btn"
            onClick={handleRemoveCoupon}
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="coupon-input-group">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="coupon-input"
            disabled={loading}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={loading || !couponCode.trim()}
            className="apply-coupon-btn"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </div>
      )}

      {message.text && (
        <div className={`coupon-message ${message.type}`}>
          {message.type === 'success' ? '✓' : '✕'} {message.text}
        </div>
      )}

      <div className="popular-coupons">
        <p>Popular Coupons:</p>
        <div className="coupon-chips">
          <button className="coupon-chip" onClick={() => setCouponCode('WELCOME10')}>
            WELCOME10
          </button>
          <button className="coupon-chip" onClick={() => setCouponCode('SAVE20')}>
            SAVE20
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponInput;
