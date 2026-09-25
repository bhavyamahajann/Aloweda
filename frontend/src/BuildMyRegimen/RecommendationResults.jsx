import { useState, useEffect } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import { concernToProducts, bundleToProducts, skinTypeToProducts, productDatabase } from '../data/productRecommendations'
import { skinConcerns, bundles, skinTypes, tattooConcerns, hairConcerns, lipConcerns } from '../data/regimenOptions'
import { PRODUCTS } from '../data/products'
import TattooCleanser from '../assets/TattooCleanser.png'
import TattooButter from '../assets/TattooButter.png'
import './RecommendationResults.css'

// Tattoo product data (pulled directly — not through the scoring engine)
const TATTOO_PRODUCTS_MAP = {
  'tattoo-cleanser': {
    id: 19,
    name: 'Tattoo Cleanser 100 ml',
    size: '100 ml',
    ingredients: 'Orange, Lemon & Tangerine Extracts, Aloe Vera, Vitamin E',
    purpose: 'Gently cleanses tattooed skin without stripping moisture',
    price: 'Rs. 299.00',
    mrp: 'Rs. 349.00',
    img: TattooCleanser,
    routine: 'tattoo'
  },
  'tattoo-butter': {
    id: 20,
    name: 'Tattoo Butter 50 Grams',
    size: '50 G',
    ingredients: 'Shea, Cocoa, Mango & Kokum Butter, Beeswax, Fig Honey',
    purpose: 'Nourishes & protects tattooed skin, preserves ink vibrancy',
    price: 'Rs. 799.00',
    mrp: 'Rs. 899.00',
    img: TattooButter,
    routine: 'tattoo'
  }
}

const TATTOO_CONCERN_TO_PRODUCTS = {
  fadingink:    ['tattoo-cleanser', 'tattoo-butter'],
  itching:      ['tattoo-cleanser', 'tattoo-butter'],
  dryness:      ['tattoo-butter', 'tattoo-cleanser'],
  notHealing:   ['tattoo-cleanser', 'tattoo-butter'],
  colorsFading: ['tattoo-butter', 'tattoo-cleanser'],
}

export default function RecommendationResults({ formData, onNavigate, onAddToCart }) {
  const [recommendations, setRecommendations] = useState({ morning: [], evening: [], optional: [], tattoo: [], hair: [], lip: [] })
  const [success, setSuccess] = useState(false)
  const [addedProducts, setAddedProducts] = useState(new Set())

  useEffect(() => {
    calculateRecommendations()
    setTimeout(() => setSuccess(true), 500)
  }, [])

  const calculateRecommendations = () => {
    const productScores = {}

    // ── Skin concerns (+3 each) ──────────────────────────────────
    formData.skinConcerns.forEach(concern => {
      const products = concernToProducts[concern] || []
      products.forEach(productId => {
        productScores[productId] = (productScores[productId] || 0) + 3
      })
    })

    // ── Bundle (+2 each) ─────────────────────────────────────────
    if (formData.bundle) {
      const products = bundleToProducts[formData.bundle] || []
      products.forEach(productId => {
        productScores[productId] = (productScores[productId] || 0) + 2
      })
    }

    // ── Skin type (+2 each) ──────────────────────────────────────
    if (formData.skinType && formData.skinType !== 'notsure') {
      const products = skinTypeToProducts[formData.skinType] || []
      products.forEach(productId => {
        productScores[productId] = (productScores[productId] || 0) + 2
      })
    }

    // ── Hair concerns → hair-serum ───────────────────────────────
    const hasHairConcern = formData.hairConcerns?.length > 0 &&
      !formData.hairConcerns.includes('none')
    if (hasHairConcern) {
      productScores['hair-serum'] = (productScores['hair-serum'] || 0) + 4
    }

    // ── Lip concerns → lip-butter ────────────────────────────────
    const hasLipConcern = formData.lipConcerns?.length > 0 &&
      !formData.lipConcerns.includes('none')
    if (hasLipConcern) {
      productScores['lip-butter'] = (productScores['lip-butter'] || 0) + 4
    }

    // ── Sort & hydrate skin/hair/lip products ────────────────────
    const sortedProducts = Object.entries(productScores)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => {
        const recProduct = productDatabase[id]
        if (!recProduct) return null
        const fullProduct = PRODUCTS.find(p => p.id === recProduct.id)
        return { ...recProduct, ...fullProduct }
      })
      .filter(Boolean)

    const morning  = sortedProducts.filter(p => p.routine === 'morning').slice(0, 3)
    const evening  = sortedProducts.filter(p => p.routine === 'evening').slice(0, 3)
    const optional = sortedProducts.filter(p => p.routine === 'optional').slice(0, 2)
    const hair     = hasHairConcern ? sortedProducts.filter(p => p.routine === 'special' && p.name?.toLowerCase().includes('hair')).slice(0, 1) : []
    const lip      = hasLipConcern  ? sortedProducts.filter(p => p.routine === 'special' && p.name?.toLowerCase().includes('lip')).slice(0, 1)  : []

    // ── Tattoo products (separate scoring) ───────────────────────
    const hasTattooConcern = formData.tattooConcerns?.length > 0 &&
      !formData.tattooConcerns.includes('none')

    let tattoo = []
    if (hasTattooConcern) {
      const tattooScores = {}
      formData.tattooConcerns.forEach(concern => {
        const products = TATTOO_CONCERN_TO_PRODUCTS[concern] || []
        products.forEach((slug, index) => {
          tattooScores[slug] = (tattooScores[slug] || 0) + (index === 0 ? 3 : 2)
        })
      })
      tattoo = Object.entries(tattooScores)
        .sort(([, a], [, b]) => b - a)
        .map(([slug]) => TATTOO_PRODUCTS_MAP[slug])
        .filter(Boolean)
    }

    setRecommendations({ morning, evening, optional, tattoo, hair, lip })
  }

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product)
      setAddedProducts(prev => new Set([...prev, product.id]))
      setTimeout(() => {
        setAddedProducts(prev => {
          const newSet = new Set(prev)
          newSet.delete(product.id)
          return newSet
        })
      }, 2500)
    }
  }

  // ── Label helpers ──────────────────────────────────────────────
  const getSelectedConcernLabels = () =>
    formData.skinConcerns.map(id => skinConcerns.find(c => c.id === id)?.label).filter(Boolean).join(', ')

  const getSelectedBundleLabel = () =>
    bundles.find(b => b.id === formData.bundle)?.label || ''

  const getSelectedSkinTypeLabel = () =>
    skinTypes.find(t => t.id === formData.skinType)?.label || ''

  const getTattooConcernLabels = () =>
    (formData.tattooConcerns || [])
      .filter(id => id !== 'none')
      .map(id => tattooConcerns.find(c => c.id === id)?.label)
      .filter(Boolean)
      .join(', ')

  const getHairConcernLabels = () =>
    (formData.hairConcerns || [])
      .filter(id => id !== 'none')
      .map(id => hairConcerns.find(c => c.id === id)?.label)
      .filter(Boolean)
      .join(', ')

  const getLipConcernLabels = () =>
    (formData.lipConcerns || [])
      .filter(id => id !== 'none')
      .map(id => lipConcerns.find(c => c.id === id)?.label)
      .filter(Boolean)
      .join(', ')

  // ── Reusable product card ──────────────────────────────────────
  const ProductCard = ({ product, idx, showNumber = false }) => (
    <div className="product-rec-card">
      {showNumber && <div className="product-number">{idx + 1}</div>}
      {product.img && (
        <img src={product.img} alt={product.name} className="product-rec-image" />
      )}
      <h4>{product.name}</h4>
      {product.size && <p className="product-size">{product.size}</p>}
      <p className="product-purpose">{product.purpose}</p>
      <p className="product-ingredients"><strong>Key Ingredients:</strong> {product.ingredients}</p>
      {product.price && (
        <div className="product-price-section">
          <div className="product-pricing">
            <span className="product-price">{product.price}</span>
            {product.mrp && <span className="product-mrp">{product.mrp}</span>}
          </div>
          <button
            className={`add-to-cart-btn ${addedProducts.has(product.id) ? 'added' : ''}`}
            onClick={() => handleAddToCart(product)}
            disabled={addedProducts.has(product.id)}
          >
            {addedProducts.has(product.id) ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )

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
              {getTattooConcernLabels() && (
                <div className="summary-item">
                  <h3>Tattoo Concerns</h3>
                  <p>{getTattooConcernLabels()}</p>
                </div>
              )}
              {getHairConcernLabels() && (
                <div className="summary-item">
                  <h3>Hair Concerns</h3>
                  <p>{getHairConcernLabels()}</p>
                </div>
              )}
              {getLipConcernLabels() && (
                <div className="summary-item">
                  <h3>Lip Concerns</h3>
                  <p>{getLipConcernLabels()}</p>
                </div>
              )}
            </div>

            {/* Morning Routine */}
            {recommendations.morning.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Morning Routine</h3>
                <div className="product-grid">
                  {recommendations.morning.map((product, idx) => (
                    <ProductCard key={idx} product={product} idx={idx} showNumber />
                  ))}
                </div>
              </div>
            )}

            {/* Evening Routine */}
            {recommendations.evening.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Evening Routine</h3>
                <div className="product-grid">
                  {recommendations.evening.map((product, idx) => (
                    <ProductCard key={idx} product={product} idx={idx} showNumber />
                  ))}
                </div>
              </div>
            )}

            {/* Optional */}
            {recommendations.optional.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Optional / As Needed</h3>
                <div className="product-grid">
                  {recommendations.optional.map((product, idx) => (
                    <ProductCard key={idx} product={product} idx={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Hair Care */}
            {recommendations.hair.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Hair Care</h3>
                <div className="product-grid">
                  {recommendations.hair.map((product, idx) => (
                    <ProductCard key={idx} product={product} idx={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Lip Care */}
            {recommendations.lip.length > 0 && (
              <div className="routine-section">
                <h3 className="routine-heading">Lip Care</h3>
                <div className="product-grid">
                  {recommendations.lip.map((product, idx) => (
                    <ProductCard key={idx} product={product} idx={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Tattoo Care — separate section */}
            {recommendations.tattoo.length > 0 && (
              <div className="routine-section routine-section--tattoo">
                <h3 className="routine-heading routine-heading--tattoo">🖤 Tattoo Care</h3>
                <p className="routine-subtext">Based on your tattoo concerns, here's what we recommend</p>
                <div className="product-grid">
                  {recommendations.tattoo.map((product, idx) => (
                    <ProductCard key={idx} product={product} idx={idx} />
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

  return (
    <div className="results-page">
      <Navbar onNavigate={onNavigate} />
      <div className="results-container">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Preparing your personalized regimen…</p>
        </div>
      </div>
    </div>
  )
}
