import { useState, useMemo } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import './ShopPage.css'
import './SkinCare.css'
import { handleNavigation } from '../utils/navigation'
import { PRODUCTS } from '../data/products'

// Format product data for display
const products = PRODUCTS.map(p => ({
  id: p.id,
  img: p.img,
  name: p.name,
  category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
  keywords: `${p.name} ${p.category} ${p.tag || ''} ${p.desc}`.toLowerCase(),
  price: `₹ ${p.price}`,
  mrp: p.mrp ? `₹ ${p.mrp}` : null,
  model3D: p.model3D
}))

export default function SkinCarePage({ onNavigate, searchQuery, categoryFilter, pageTitle, showAllProducts, onLoginClick }) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '')
  const [hoveredProduct, setHoveredProduct] = useState(null)

  // Search and category filter logic
  const filteredProducts = useMemo(() => {
    let result = products

    // First apply category filter if specified
    if (categoryFilter && !showAllProducts) {
      result = result.filter(product => {
        const productCategory = product.category.toLowerCase()
        const filter = categoryFilter.toLowerCase()
        
        // Map categories to match filter
        if (filter === 'serums') return productCategory === 'serum'
        if (filter === 'creams') return productCategory === 'cream'
        if (filter === 'moisturisers') return productCategory === 'moisturizer' || productCategory === 'moisturiser'
        if (filter === 'tattoo') return productCategory.includes('tattoo')
        if (filter === 'rituals') return productCategory === 'combo' || productCategory.includes('ritual')
        
        return productCategory === filter
      })
    }

    // Then apply search filter if query exists
    const query = (localSearchQuery || searchQuery || '').toLowerCase().trim()
    if (query) {
      result = result.filter(product => {
        const searchableText = `${product.name} ${product.category} ${product.keywords}`.toLowerCase()
        return searchableText.includes(query)
      })
    }

    return result
  }, [localSearchQuery, searchQuery, categoryFilter, showAllProducts])

  const handleClearSearch = () => {
    setLocalSearchQuery('')
  }

  // Determine page title
  const displayTitle = pageTitle || 'Smart Skincare'

  return (
    <div className="shop-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} />

      {/* Big page heading — reference style */}
      <div className="shop-page__hero">
        <h1 className="shop-page__hero-title">{displayTitle}</h1>
      </div>

      {/* Search Results Banner */}
      {(searchQuery || localSearchQuery) && (
        <div className="search-results-banner">
          <div className="search-results-content">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span className="search-results-text">
              Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{localSearchQuery || searchQuery}"
            </span>
            <button className="search-clear-btn" onClick={handleClearSearch} aria-label="Clear search">✕</button>
          </div>
        </div>
      )}

      <div className="shop-page__topbar">
        <span className="shop-page__meta">
          <strong>{filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}</strong>
        </span>
        
        {/* Local Search Bar */}
        <div className="shop-page__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={localSearchQuery}
            onChange={e => setLocalSearchQuery(e.target.value)}
            className="shop-page__search-input"
          />
          {localSearchQuery && (
            <button className="shop-page__search-clear" onClick={handleClearSearch}>✕</button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="shop-page__grid">
          {filteredProducts.map(p => (
            <div 
              key={p.id} 
              className="sp-card" 
              onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: p.id })}
              onAuxClick={(e) => e.button === 1 && handleNavigation(e, onNavigate, 'product', { productId: p.id })}
              onMouseEnter={() => setHoveredProduct(p.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="sp-card__img-wrap">
                <img src={p.img} alt={p.name} className="sp-card__img" />
              </div>
              <div className="sp-card__body">
                <p className="sp-card__category">{p.category}</p>
                <p className="sp-card__name">{p.name}</p>
                <div className="sp-card__footer">
                  <span className="sp-card__price">{p.price}</span>
                  {p.mrp && <span className="sp-card__mrp">{p.mrp}</span>}
                  <button className="sp-add-btn" onClick={(e) => { e.stopPropagation(); alert('Added to cart!') }}>Add to Bag</button>
                </div>
              </div>

              {/* Hover Popup */}
              {hoveredProduct === p.id && (
                <div className="product-popup">
                  <div className="product-popup__content">
                    <div className="product-popup__header">
                      <h3>{p.name}</h3>
                      <span className="product-popup__category">{p.category}</span>
                    </div>
                    <div className="product-popup__details">
                      <div className="product-popup__price-section">
                        <span className="popup-price">{p.price}</span>
                        {p.mrp && <span className="popup-mrp">{p.mrp}</span>}
                      </div>
                      <div className="product-popup__info">
                        <p>✓ Premium Quality Product</p>
                        <p>✓ Cruelty-Free & Vegan</p>
                        <p>✓ GMP Certified</p>
                        <p>✓ Free Shipping on Orders Above ₹499</p>
                      </div>
                    </div>
                    <button 
                      className="product-popup__btn" 
                      onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: p.id })}
                      onAuxClick={(e) => e.button === 1 && handleNavigation(e, onNavigate, 'product', { productId: p.id })}
                    >View Details</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <h3>No products found</h3>
          <p>Try searching with different keywords like "serum", "cream", "vitamin c", or "anti aging"</p>
          <button className="shop-page__quiz-btn" onClick={handleClearSearch}>Clear Search</button>
        </div>
      )}

      <div className="shop-page__info">
        <h2 className="shop-page__info-title">Smart Skincare</h2>
        <p className="shop-page__info-desc">
          We believe skincare should be simple, effective, and powered by nature. Our 
          smart skincare range combines proven ingredients with modern research 
          to target your skin's unique needs. Whether it's addressing dullness, acne care, or
          anti-aging, our formulations are designed to help you achieve long-lasting
          glow and confidence, naturally.
        </p>
        <button className="shop-page__quiz-btn">Start Quiz</button>
      </div>
      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}
