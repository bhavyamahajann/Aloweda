import { useState, useMemo, useEffect } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import { handleNavigation } from '../utils/navigation'
import './ShopPage.css'
import './SkinCare.css'
import './AllProducts.css'

// Import all product images
import SC1  from '../SkinCareImg/SkinCare1.png'
import SC2  from '../SkinCareImg/SkinCare2.png'
import SC3  from '../SkinCareImg/SkinCare3.jpg'
import SC4  from '../SkinCareImg/SkinCare4.jpg'
import SC5  from '../SkinCareImg/SkinCare5.jpg'
import SC6  from '../SkinCareImg/SkinCare6.jpg'
import SC7  from '../SkinCareImg/SkinCare7.jpg'
import SC8  from '../SkinCareImg/SkinCare8.jpg'
import SC9  from '../SkinCareImg/SkinCare9.jpg'
import SC10 from '../SkinCareImg/SkinCare10.jpg'
import SC11 from '../SkinCareImg/SkinCare11.jpg'
import SC12 from '../SkinCareImg/SkinCare12.jpg'
import SC13 from '../SkinCareImg/SkinCare13.jpg'
import SC14 from '../SkinCareImg/SkinCare14.jpg'
import SC15 from '../SkinCareImg/SkinCare15.jpg'
import HairCareImg from '../assets/HairCare.png'
import LC1 from '../LipCareImg/LipCare1.jpg'
import LC2 from '../LipCareImg/LipCare2.jpg'

// All products from all categories
const allProducts = [
  // Skin Care Products
  { id:1,  img:SC1,  name:'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', category: 'Combo', keywords: 'day cream night cream lip butter routine combo kit', price:'₹ 799' },
  { id:2,  img:SC2,  name:'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream + Complexion Cream + Smooth Perfection Serum', category: 'Combo', keywords: 'pigment control serum day cream complexion smooth perfection ritual combo kit', price:'₹ 999' },
  { id:3,  img:SC3,  name:'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', category: 'Combo', keywords: 'super glow serum day cream radiance ritual combo kit glow', price:'₹ 999' },
  { id:4,  img:SC4,  name:'Hyaluronic Acid, SPF 30 & Vitamin E : The Day Cream 50 G', category: 'Cream', keywords: 'hyaluronic acid spf vitamin e day cream moisturizer sunscreen protection', price:'₹ 249' },
  { id:5,  img:SC5,  name:'Retinol 1%, Niacinamide 10 %, Aloe Vera Extract & Carrot oil: The Night Cream 50 G', category: 'Cream', keywords: 'retinol niacinamide aloe vera carrot oil night cream anti aging', price:'₹ 399' },
  { id:6,  img:SC6,  name:'Saffron Face Oil 30 ml: Saffron Essential Oil, Sweet Almond oil, Grape Seed Oil, Honey & Ghee', category: 'Oil', keywords: 'saffron face oil almond grape seed honey ghee natural glow', price:'₹ 799' },
  { id:7,  img:SC7,  name:'Alpha Arbutin 2%, Vitamin C 15 % & Micro Crystalline Wax: Complexion Cream 50 G', category: 'Cream', keywords: 'alpha arbutin vitamin c complexion brightening pigmentation dark spots', price:'₹ 399' },
  { id:8,  img:SC8,  name:'Vitamin C 15%, Ferulic Acid 1% & Niacinamide 5% : Super Glow Serum 30 ml', category: 'Serum', keywords: 'vitamin c ferulic acid niacinamide super glow serum brightening radiance', price:'₹ 549' },
  { id:9,  img:SC9,  name:'Alpha Arbutin 2%, Aloe Vera Extract, Ceramides & Kojic Acid 1%: Pigment Control Serum 30 ml', category: 'Serum', keywords: 'alpha arbutin aloe vera ceramides kojic acid pigment control dark spots', price:'₹ 399' },
  { id:10, img:SC10, name:'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin & Niacinamide: Wrinkles & Lines Cream 50 G', category: 'Cream', keywords: 'retinol copper tripeptide alpha arbutin niacinamide wrinkles lines anti aging', price:'₹ 449' },
  { id:11, img:SC11, name:'Encapsulated Retinol 1 %, Grape Seed Extract, & Ceramides : Lines & Wrinkles Serum 30 ml', category: 'Serum', keywords: 'retinol grape seed ceramides lines wrinkles anti aging serum', price:'₹ 499' },
  { id:12, img:SC12, name:'Niacinamide 10 %, Acetyl Glucosamine & Ceramides: Tone & Texture Serum 30 ml', category: 'Serum', keywords: 'niacinamide acetyl glucosamine ceramides tone texture smooth skin', price:'₹ 375', mrp:'₹ 545' },
  { id:13, img:SC13, name:'Salicylic Acid 2%, Witch Hazel Extract & Squalene: Smooth Perfection Serum 30 ml', category: 'Serum', keywords: 'salicylic acid witch hazel squalene smooth perfection acne pores', price:'₹ 449' },
  { id:14, img:SC14, name:'Vitamin C 20%, Kojic Acid, Avocado Extract & Argan Oil : Radiance Cream 50 G', category: 'Cream', keywords: 'vitamin c kojic acid avocado argan oil radiance brightening glow', price:'₹ 399' },
  { id:15, img:SC15, name:'Anti Acne Face wash: 100 ml, Salicylic Acid 2% for Oily & Acne Prone Skin', category: 'Face Wash', keywords: 'anti acne face wash salicylic acid oily acne prone cleanser', price:'₹ 185' },
  
  // Hair Care Products
  { id:16, img:HairCareImg, name:'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', category: 'Hair Serum', keywords: 'redensyl anagain rice water biotin hair therapy serum growth hair fall', price:'₹ 575' },
  
  // Lip Care Products
  { id:17, img:LC1, name:'Lip Butter 8 Gram: Butters, Oils & Honey. ZERO CHEMICALS, NO PRESERVATIVES', category: 'Lip Butter', keywords: 'lip butter butters oils honey natural organic chemical free preservative free', price:'Rs. 75.00' },
  { id:18, img:LC2, name:'Lip Butter 15 Gram: Butters, Oils & Honey. NO CHEMICALS, NO PRESERVATIVES. NOT LIP BALM', category: 'Lip Butter', keywords: 'lip butter butters oils honey natural organic chemical free preservative free balm', price:'From Rs. 165.00' },
]

export default function AllProductsPage({ onNavigate, searchQuery, onLoginClick }) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredProduct, setHoveredProduct] = useState(null)

  // Sync searchQuery prop with local state
  useEffect(() => {
    if (searchQuery) {
      setLocalSearchQuery(searchQuery)
    }
  }, [searchQuery])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(allProducts.map(p => p.category))]
    return cats
  }, [])

  // Filter logic
  const filteredProducts = useMemo(() => {
    let result = allProducts

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory)
    }

    // Search filter
    const query = (localSearchQuery || searchQuery || '').toLowerCase().trim()
    if (query) {
      result = result.filter(product => {
        const searchableText = `${product.name} ${product.category} ${product.keywords}`.toLowerCase()
        return searchableText.includes(query)
      })
    }

    return result
  }, [localSearchQuery, searchQuery, selectedCategory])

  const handleClearSearch = () => {
    setLocalSearchQuery('')
    // Navigate back to clear URL search params
    if (onNavigate) {
      onNavigate('shop')
    }
  }

  const handleProductClick = (e, productId) => {
    handleNavigation(e, onNavigate, 'product', { productId })
  }

  return (
    <div className="shop-page all-products-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} />

      {/* Simple Page Header */}
      <div className="all-products-header">
        <h1 className="all-products-title">All Products</h1>
        <p className="all-products-count">
          {allProducts.length} Products Available
        </p>
      </div>

      {/* Main Content */}
      <div className="shop-page__content">
        {/* Real-time Search Bar */}
        <div className="all-products-search">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
          {localSearchQuery && (
            <button 
              className="search-clear" 
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'category-pill--active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={(e) => handleProductClick(e, product.id)}
                onAuxClick={(e) => e.button === 1 && handleProductClick(e, product.id)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="product-card__img-wrap">
                  <img src={product.img} alt={product.name} className="product-card__img" />
                </div>
                <div className="product-card__body">
                  <p className="product-card__category">{product.category}</p>
                  <h3 className="product-card__name">{product.name}</h3>
                  <div className="product-card__footer">
                    <span className="product-card__price">{product.price}</span>
                    {product.mrp && (
                      <span className="product-card__mrp">{product.mrp}</span>
                    )}
                  </div>
                </div>

                {/* Hover Popup */}
                {hoveredProduct === product.id && (
                  <div className="product-popup">
                    <div className="product-popup__content">
                      <div className="product-popup__header">
                        <h3>{product.name}</h3>
                        <span className="product-popup__category">{product.category}</span>
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
                      <button 
                        className="product-popup__btn" 
                        onClick={(e) => handleProductClick(e, product.id)}
                        onAuxClick={(e) => e.button === 1 && handleProductClick(e, product.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
            <button className="btn-clear-all" onClick={() => { setLocalSearchQuery(''); setSelectedCategory('All'); }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
