import { useState, useEffect } from 'react';
import './PaymentSelector.css';

const PaymentSelector = ({ subtotal, onPaymentChange }) => {
  const [selectedMethod, setSelectedMethod] = useState('COD');
  const [onlineDiscount, setOnlineDiscount] = useState(0);

  useEffect(() => {
    calculateDiscount(selectedMethod);
  }, [selectedMethod, subtotal]);

  const calculateDiscount = (method) => {
    if (method === 'Online' && subtotal > 0) {
      const discount = Math.round(subtotal * 0.10); // 10% discount
      setOnlineDiscount(discount);
      
      if (onPaymentChange) {
        onPaymentChange({
          paymentMethod: method,
          discount: discount
        });
      }
    } else {
      setOnlineDiscount(0);
      
      if (onPaymentChange) {
        onPaymentChange({
          paymentMethod: method,
          discount: 0
        });
      }
    }
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="payment-selector-container">
      <div className="payment-header">
        <h3>Select Payment Method</h3>
      </div>

      <div className="payment-methods">
        {/* Cash on Delivery */}
        <label className={`payment-method ${selectedMethod === 'COD' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={selectedMethod === 'COD'}
            onChange={() => handleMethodChange('COD')}
          />
          <div className="payment-method-content">
            <div className="payment-method-icon">💵</div>
            <div className="payment-method-details">
              <h4>Cash on Delivery</h4>
              <p>Pay when you receive your order</p>
            </div>
          </div>
          {selectedMethod === 'COD' && (
            <div className="selected-indicator">✓</div>
          )}
        </label>

        {/* Online Payment */}
        <label className={`payment-method ${selectedMethod === 'Online' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="Online"
            checked={selectedMethod === 'Online'}
            onChange={() => handleMethodChange('Online')}
          />
          <div className="payment-method-content">
            <div className="payment-method-icon">💳</div>
            <div className="payment-method-details">
              <h4>Online Payment</h4>
              <p>UPI, Cards, Net Banking, Wallets</p>
              <div className="online-discount-badge">
                🎉 Get 10% Instant Discount
              </div>
            </div>
          </div>
          {selectedMethod === 'Online' && (
            <div className="selected-indicator">✓</div>
          )}
        </label>
      </div>

      {/* Discount Info */}
      {selectedMethod === 'Online' && onlineDiscount > 0 && (
        <div className="discount-info">
          <div className="discount-content">
            <span className="discount-icon">🎁</span>
            <div className="discount-text">
              <strong>Congratulations!</strong>
              <p>You're saving ₹{onlineDiscount} with online payment</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Icons */}
      <div className="payment-icons">
        <span className="payment-icon-label">We accept:</span>
        <div className="payment-icon-list">
          <span className="payment-icon">💳 Visa</span>
          <span className="payment-icon">💳 Mastercard</span>
          <span className="payment-icon">📱 UPI</span>
          <span className="payment-icon">💰 Wallets</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelector;
