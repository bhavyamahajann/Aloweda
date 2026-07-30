import { useRef, useState } from 'react'
import './ProductCard3D.css'

/* ── 3D Tilt Product Card with Floating Animation ── */
export default function ProductCard3D({ 
  product, 
  onNavigate, 
  onAddToCart, 
  className = '',
  showTag = true 
}) {
  const cardRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    
    // Calculate mouse position relative to card center
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Calculate rotation angles (max ±15 degrees)
    const rotateX = ((y - centerY) / centerY) * -15
    const rotateY = ((x - centerX) / centerX) * 15
    
    // Apply 3D transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    setShowPopup(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setShowPopup(false)
    if (cardRef.current) {
      // Reset to floating state
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
    }
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    console.log('Add to Cart clicked for:', product)
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate('product', { productId: product.id })
    }
  }

  return (
    <div 
      ref={cardRef}
      className={`product-card-3d ${className} ${isHovering ? 'is-hovering' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className="product-card-3d__inner">
        {/* Image Container */}
        <div className="product-card-3d__img-wrap">
          <img 
            src={product.img} 
            alt={product.name} 
            className="product-card-3d__img" 
          />
          {showTag && product.tag && (
            <span className="product-card-3d__tag">{product.tag}</span>
          )}
          
          {/* Hover Overlay */}
          <div className="product-card-3d__overlay">
            <button 
              className="btn btn--white" 
              onClick={(e) => { e.stopPropagation(); handleCardClick() }}
            >
              Quick View
            </button>
          </div>

          {/* Glare Effect */}
          <div className="product-card-3d__glare" />
        </div>

        {/* Hover Popup */}
        {showPopup && (
          <div className="product-popup-3d">
            <div className="product-popup__content">
              <div className="product-popup__header">
                <h3>{product.name}</h3>
                <span className="product-popup__category">{product.category || 'Product'}</span>
              </div>
              <div className="product-popup__details">
                <div className="product-popup__price-section">
                  <span className="popup-price">{product.price}</span>
                  {product.mrp && <span className="popup-mrp">{product.mrp}</span>}
                </div>
                <div className="product-popup__info">
                  <p>✓ Premium Quality Product</p>
                  <p>✓ Cruelty-Free & Vegan</p>
                  <p>✓ GMP Certified</p>
                  <p>✓ Free Shipping on Orders Above ₹499</p>
                </div>
              </div>
              <button className="product-popup__btn" onClick={handleCardClick}>View Details</button>
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="product-card-3d__body">
          <h3 className="product-card-3d__name">{product.name}</h3>
          <div className="product-card-3d__footer">
            <div className="product-card-3d__prices">
              <span className="product-card-3d__price">{product.price}</span>
              {product.mrp && <span className="product-card-3d__mrp">{product.mrp}</span>}
            </div>
            <button 
              className="btn btn--outline-dark btn--sm" 
              onClick={handleAddToCart}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
