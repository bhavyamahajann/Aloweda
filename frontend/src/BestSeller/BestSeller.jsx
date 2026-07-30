import { useState, useMemo } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import './BestSeller.css'

// Import product images
import SC1 from '../SkinCareImg/SkinCare1.png'
import SC2 from '../SkinCareImg/SkinCare2.png'
import SC3 from '../SkinCareImg/SkinCare3.jpg'
import SC8 from '../SkinCareImg/SkinCare8.jpg'
import SC12 from '../SkinCareImg/SkinCare12.jpg'
import HairCareImg from '../assets/HairCare.png'
import LipCareImg from '../assets/LipCare.png'
import SmartSkinCareImg from '../assets/SmartSkinCare.png'

const BEST_SELLER_PRODUCTS = [
  { id: 1, img: SC1, name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', category: 'Combo', price: '₹ 799', tag: 'Best Seller' },
  { id: 2, img: SC2, name: 'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream + Complexion Cream + Smooth Perfection Serum', category: 'Combo', price: '₹ 999', tag: 'Best Seller' },
  { id: 3, img: SC3, name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', category: 'Combo', price: '₹ 999', tag: 'Best Seller' },
  { id: 8, img: SC8, name: 'Vitamin C 15%, Ferulic Acid 1% & Niacinamide 5% : Super Glow Serum 30 ml', category: 'Serum', price: '₹ 549', tag: 'Best Seller' },
  { id: 12, img: SC12, name: 'Niacinamide 10 %, Acetyl Glucosamine & Ceramides: Tone & Texture Serum 30 ml', category: 'Serum', price: '₹ 375', mrp: '₹ 545', tag: 'Best Seller' },
  { id: 16, img: HairCareImg, name: 'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', category: 'Hair Serum', price: '₹ 575', tag: 'Best Seller' },
]

export default function BestSellerPage({ onNavigate }) {
  const [sortBy, setSortBy] = useState('featured')

  const sortedProducts = useMemo(() => {
    let sorted = [...BEST_SELLER_PRODUCTS]
    
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9]/g, ''))
        const priceB = parseFloat(b.price.replace(/[^0-9]/g, ''))
        return priceA - priceB
      })
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9]/g, ''))
        const priceB = parseFloat(b.price.replace(/[^0-9]/g, ''))
        return priceB - priceA
      })
    }
    
    return sorted
  }, [sortBy])

  return (
    <div className="bestseller-page">
      <Navbar onNavigate={onNavigate} />

      {/* Best Sellers Heading */}
      <div className="bestseller-heading">
        <h1>Best Sellers</h1>
        <p>Discover our most loved products</p>
      </div>

      {/* Hero Section with 3 Product Images */}
      <div className="bestseller-hero">
        <div className="bestseller-hero__container">
          <div 
            className="hero-product"
            onClick={() => onNavigate('hair')}
          >
            <img src={HairCareImg} alt="Hair Care" />
          </div>
          <div 
            className="hero-product"
            onClick={() => onNavigate('lip')}
          >
            <img src={LipCareImg} alt="Lip Care" />
          </div>
          <div 
            className="hero-product"
            onClick={() => onNavigate('skincare')}
          >
            <img src={SmartSkinCareImg} alt="Smart Skincare" />
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bestseller-topbar">
        <div className="bestseller-topbar-left">
          <button className="filter-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            Filter
          </button>
          <span className="product-count">{sortedProducts.length} Products</span>
        </div>

        <div className="bestseller-topbar-right">
          <label htmlFor="sort-select" className="sort-label">Sort by</label>
          <select 
            id="sort-select"
            className="sort-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bestseller-grid">
        {sortedProducts.map((product) => (
          <div 
            key={product.id} 
            className="bestseller-card"
            onClick={() => onNavigate('product', { productId: product.id })}
          >
            {product.tag && (
              <div className="product-tag">{product.tag}</div>
            )}
            <div className="bestseller-card__img-wrap">
              <img src={product.img} alt={product.name} className="bestseller-card__img" />
            </div>
            <div className="bestseller-card__body">
              <p className="bestseller-card__category">{product.category}</p>
              <p className="bestseller-card__name">{product.name}</p>
              <div className="bestseller-card__footer">
                <div className="price-group">
                  <span className="bestseller-card__price">{product.price}</span>
                  {product.mrp && <span className="bestseller-card__mrp">{product.mrp}</span>}
                </div>
                <button 
                  className="bestseller-add-btn"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    alert('Added to cart!') 
                  }}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}
