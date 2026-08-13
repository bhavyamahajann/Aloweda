import { useState, useEffect } from 'react';
import './BundleSelector.css';

const BundleSelector = ({ cartItems, onApplyBundle }) => {
  const [availableBundles, setAvailableBundles] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      checkBundleEligibility();
    }
  }, [cartItems]);

  const checkBundleEligibility = async () => {
    setLoading(true);
    try {
      const cartTotal = cartItems.reduce((sum, item) => {
        const price = parseInt(item.price.replace('₹ ', '').replace(',', ''));
        return sum + (price * (item.quantity || 1));
      }, 0);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/bundles/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            productId: item.id.toString(),
            name: item.name,
            price: parseInt(item.price.replace('₹ ', '').replace(',', '')),
            quantity: item.quantity || 1,
            category: item.category
          })),
          cartTotal
        }),
      });

      const data = await response.json();

      console.log('=== BUNDLE API RESPONSE ===');
      console.log('Response:', data);
      console.log('Has bundles:', data.hasApplicableBundles);
      if (data.recommendedBundle) {
        console.log('Recommended Bundle:', data.recommendedBundle);
        console.log('Discount:', data.recommendedBundle.discount);
        console.log('Discount Type:', typeof data.recommendedBundle.discount);
      }
      console.log('===========================');

      if (data.success && data.hasApplicableBundles) {
        setAvailableBundles(data.allApplicableBundles || [data.recommendedBundle]);
      } else {
        setAvailableBundles([]);
      }
    } catch (error) {
      console.error('Error checking bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBundle = (bundle) => {
    console.log('=== BUNDLE SELECTOR: APPLY ===');
    console.log('Bundle object received:', bundle);
    console.log('Bundle discount:', bundle.discount);
    console.log('Bundle discount type:', typeof bundle.discount);
    console.log('=============================');
    
    setSelectedBundle(bundle);
    if (onApplyBundle) {
      const bundleData = {
        bundleId: bundle.bundleId,
        bundleName: bundle.name,
        discount: bundle.discount
      };
      console.log('Sending to Cart:', bundleData);
      onApplyBundle(bundleData);
    }
  };

  const handleRemoveBundle = () => {
    setSelectedBundle(null);
    if (onApplyBundle) {
      onApplyBundle(null);
    }
  };

  if (loading) {
    return (
      <div className="bundle-selector-loading">
        <p>Checking for bundle offers...</p>
      </div>
    );
  }

  if (availableBundles.length === 0) {
    return null; // Don't show if no bundles available
  }

  return (
    <div className="bundle-selector-container">
      <div className="bundle-header">
        <span className="bundle-icon">🎁</span>
        <h3>Special Bundle Offers</h3>
      </div>

      {selectedBundle ? (
        <div className="applied-bundle">
          <div className="applied-bundle-info">
            <div className="bundle-badge">✓ Bundle Applied</div>
            <h4>{selectedBundle.name}</h4>
            <p className="bundle-description">{selectedBundle.description}</p>
            <div className="bundle-savings">
              <span className="savings-label">You're saving:</span>
              <span className="savings-amount">₹{selectedBundle.discount}</span>
            </div>
          </div>
          <button 
            className="remove-bundle-btn"
            onClick={handleRemoveBundle}
          >
            Remove Bundle
          </button>
        </div>
      ) : (
        <div className="bundle-options">
          {availableBundles.map((bundle, index) => (
            <div key={index} className="bundle-card">
              <div className="bundle-tag">Best Deal</div>
              <h4>{bundle.name}</h4>
              <p className="bundle-description">{bundle.description}</p>
              
              <div className="bundle-details">
                <div className="bundle-discount">
                  <span className="discount-amount">₹{bundle.discount}</span>
                  <span className="discount-label">OFF</span>
                </div>
                
                <div className="bundle-final-price">
                  <span className="original-price">₹{bundle.finalPrice + bundle.discount}</span>
                  <span className="arrow">→</span>
                  <span className="final-price">₹{bundle.finalPrice}</span>
                </div>
              </div>

              <button 
                className="apply-bundle-btn"
                onClick={() => handleApplyBundle(bundle)}
              >
                Apply This Bundle
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bundle-info-note">
        💡 <strong>Tip:</strong> Bundle discounts are automatically applied to your cart total!
      </div>
    </div>
  );
};

export default BundleSelector;
