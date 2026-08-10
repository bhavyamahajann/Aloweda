import { useState, useEffect } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import { concernToProducts, bundleToProducts, skinTypeToProducts, productDatabase } from '../data/productRecommendations'
import { skinConcerns, bundles, skinTypes } from '../data/regimenOptions'
import './RecommendationResults.css'

export default function RecommendationResults({ formData, onNavigate }) {
  const [recommendations, setRecommendations] = useState({ morning: [], evening: [], optional: [] })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    calculateRecommendations()
    // Simulate submission
    setTimeout(() => setSuccess(true), 500)
  }, [])

  const calculateRecommendations = () => {
    const productScores = {}

    // Score products based on concerns
    formData.skinConcerns.forEach(concern => {
      const products = concernToProducts[concern] || []
      products.forEach(productId => {
        productScores[productId] = (productScores[productId] || 0) + 3
      })
    })

    // Score products based on bundle
    if (formData.bundle) {
      const products = bundleToProducts[formData.bundle] || []
      products.forEach(productId => {
        productScores[productId] = (productScores[productId] || 0) + 2
      })
    }

    // Score products based on skin type
    if (formData.skinType && formData.skinType !== 'notsure') {
      const products = skinTypeToProducts[formData.skinType] || []
      products.forEach(productId => {
        productScores[productId] = (productScores[productId] || 0) + 2
      })
    }

    // Sort by score and categorize
    const sortedProducts = Object.entries(productScores)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => productDatabase[id])
      .filter(Boolean)

    const morning = sortedProducts.filter(p => p.routine === 'morning').slice(0, 3)
    const evening = sortedProducts.filter(p => p.routine === 'evening').slice(0, 3)
    const optional = sortedProducts.filter(p => p.routine === 'optional' || p.routine === 'special').slice(0, 2)

    setRecommendations({ morning, evening, optional })
  }

  const getSelectedConcernLabels = () => {
    return formData.skinConcerns
      .map(id => skinConcerns.find(c => c.id === id)?.label)
      .filter(Boolean)
      .join(', ')
  }

  const getSelectedBundleLabel = () => {
    return bundles.find(b => b.id === formData.bundle)?.label || ''
  }

  const getSelectedSkinTypeLabel = () => {
    return skinTypes.find(t => t.id === formData.skinType)?.label || ''
  }

  if (success) {
    return (
      <div className="results-page">
        <Navbar onNavigate={onNavigate} />
        <div className="results-container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h1>Thank You!</h1>
            <p>Your skincare consultation request has been submitted successfully. Our team will review your details and get back to you.</p>
          </div>

          <div className="results-content">
            <h2 className="results-heading">Your Personalized Skincare Regimen</h2>

            <div className="results-summary">
              <div className="summary-item">
                <h3>Your Concerns</h3>
                <p>{getSelectedConcernLabels()}</p>
              </div>
              <div className="summary-item">
                <h3>Selected Bundle</h3>
                <p>{getSelectedBundleLabel()}</p>
              </div>
              <div className="summary-item">
                <h3>Skin Type</h3>
                <p>{getSelectedSkinTypeLabel()}</p>
              </div>
            </div>

            {recommendations.morning.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Morning Routine</h3>
                <div className="product-grid">
                  {recommendations.morning.map((product, idx) => (
                    <div key={idx} className="product-rec-card">
                      <div className="product-number">{idx + 1}</div>
                      <h4>{product.name}</h4>
                      <p className="product-size">{product.size}</p>
                      <p className="product-purpose">{product.purpose}</p>
                      <p className="product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.evening.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Evening Routine</h3>
                <div className="product-grid">
                  {recommendations.evening.map((product, idx) => (
                    <div key={idx} className="product-rec-card">
                      <div className="product-number">{idx + 1}</div>
                      <h4>{product.name}</h4>
                      <p className="product-size">{product.size}</p>
                      <p className="product-purpose">{product.purpose}</p>
                      <p className="product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.optional.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Optional / As Needed</h3>
                <div className="product-grid">
                  {recommendations.optional.map((product, idx) => (
                    <div key={idx} className="product-rec-card">
                      <h4>{product.name}</h4>
                      <p className="product-size">{product.size}</p>
                      <p className="product-purpose">{product.purpose}</p>
                      <p className="product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="results-disclaimer">
              <p><strong>Disclaimer:</strong> These are skincare suggestions based on your selected concerns. This is not a medical diagnosis. For specific skin conditions, please consult a dermatologist.</p>
            </div>

            <button className="results-btn" onClick={() => onNavigate('home')}>
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return <div className="loading">Processing your regimen...</div>
}
