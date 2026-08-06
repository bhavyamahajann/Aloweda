import { useState, useRef, useEffect } from 'react'
import './BestSeller.css'
import ProductCard3D from './ProductCard3D'

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
import LipCareImg  from '../assets/LipCare.png'

import LC1 from '../LipCareImg/LipCare1.jpg'
import LC2 from '../LipCareImg/LipCare2.jpg'

/* ── Product data per tab ─────────────────────────────────────────────── */
const productsByTab = {
  skincare: [
    { id:1,  img: SC1,  name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter',                                            price: '₹ 799', mrp: '',        tag: 'Best Seller' },
    { id:2,  img: SC2,  name: 'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream + Complexion Cream + Smooth Perfection Serum', price: '₹ 999', mrp: '',        tag: 'Best Seller' },
    { id:3,  img: SC3,  name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram',                          price: '₹ 999', mrp: '',        tag: 'Best Seller' },
    { id:4,  img: SC4,  name: 'Hyaluronic Acid, SPF 30 & Vitamin E : The Day Cream 50 G',                                                     price: '₹ 249', mrp: '',        tag: 'Best Seller' },
    { id:5,  img: SC5,  name: 'Retinol 1%, Niacinamide 10 %, Aloe Vera Extract & Carrot oil: The Night Cream 50 G',                           price: '₹ 399', mrp: '',        tag: 'Best Seller' },
    { id:6,  img: SC6,  name: 'Saffron Face Oil 30 ml: Saffron Essential Oil, Sweet Almond oil, Grape Seed Oil, Honey & Ghee',                price: '₹ 799', mrp: '',        tag: 'Best Seller' },
    { id:7,  img: SC7,  name: 'Alpha Arbutin 2%, Vitamin C 15 % & Micro Crystalline Wax: Complexion Cream 50 G',                              price: '₹ 399', mrp: '',        tag: 'Best Seller' },
    { id:8,  img: SC8,  name: 'Vitamin C 15%, Ferulic Acid 1% & Niacinamide 5% : Super Glow Serum 30 ml',                                     price: '₹ 549', mrp: '',        tag: 'Best Seller' },
    { id:9,  img: SC9,  name: 'Alpha Arbutin 2%, Aloe Vera Extract, Ceramides & Kojic Acid 1%: Pigment Control Serum 30 ml',                  price: '₹ 399', mrp: '',        tag: 'Best Seller' },
    { id:10, img: SC10, name: 'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin & Niacinamide: Wrinkles & Lines Cream 50 G',                    price: '₹ 449', mrp: '',        tag: 'Best Seller' },
    { id:11, img: SC11, name: 'Encapsulated Retinol 1 %, Grape Seed Extract, & Ceramides : Lines & Wrinkles Serum 30 ml',                     price: '₹ 499', mrp: '',        tag: 'Best Seller' },
    { id:12, img: SC12, name: 'Niacinamide 10 %, Acetyl Glucosamine & Ceramides: Tone & Texture Serum 30 ml',                                 price: '₹ 375', mrp: '₹ 545',  tag: 'Best Seller' },
    { id:13, img: SC13, name: 'Salicylic Acid 2%, Witch Hazel Extract & Squalene: Smooth Perfection Serum 30 ml',                             price: '₹ 449', mrp: '',        tag: 'Best Seller' },
    { id:14, img: SC14, name: 'Vitamin C 20%, Kojic Acid, Avocado Extract & Argan Oil : Radiance Cream 50 G',                                 price: '₹ 399', mrp: '',        tag: 'Best Seller' },
    { id:15, img: SC15, name: 'Anti Acne Face wash: 100 ml, Salicylic Acid 2% for Oily & Acne Prone Skin',                                    price: '₹ 185', mrp: '',        tag: 'Best Seller' },
  ],
  lipcare: [
    { id:17, img: LC1, name: 'Lip Butter 8 Gram: Butters, Oils & Honey. ZERO CHEMICALS, NO PRESERVATIVES',                   price: '₹ 75',  mrp: '', tag: 'Best Seller' },
    { id:18, img: LC2, name: 'Lip Butter 15 Gram: Butters, Oils & Honey. NO CHEMICALS, NO PRESERVATIVES. NOT LIP BALM',  price: 'From ₹ 165', mrp: '', tag: 'Best Seller' },
  ],
  haircare: [
    { id:16, img: HairCareImg, name: 'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', price: '₹ 575', mrp: '', tag: 'Best Seller' },
  ],
}

const tabs = [
  { id: 'skincare', label: 'Skin Care' },
  { id: 'lipcare',  label: 'Lip Care'  },
  { id: 'haircare', label: 'Hair Care' },
]

const VISIBLE = 4 // cards visible at a time
const SKINCARE_LIMIT = 10 // max skincare products before View More

export default function BestSellers({ onNavigate, onAddToCart, allProducts }) {
  const [activeTab, setActiveTab] = useState('skincare')
  const [startIdx, setStartIdx] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef(null)
  const gridRef = useRef(null)

  const handleTab = (id) => {
    setActiveTab(id)
    setStartIdx(0)
    setIsAutoPlaying(true) // Restart autoplay on tab change
  }

  // For skincare, cap at SKINCARE_LIMIT then add a View More slot
  const rawProducts = productsByTab[activeTab]
  const products = activeTab === 'skincare'
    ? rawProducts.slice(0, SKINCARE_LIMIT)
    : rawProducts

  // showViewMore = skincare tab AND user has scrolled to the last window
  const showViewMore = activeTab === 'skincare'

  const canPrev = startIdx > 0
  const canNext = startIdx + VISIBLE < products.length + (showViewMore ? 1 : 0)

  const prev = () => { 
    if (canPrev) {
      setStartIdx(i => i - 1)
      setIsAutoPlaying(false) // Pause autoplay on manual interaction
    }
  }
  
  const next = () => { 
    if (canNext) {
      setStartIdx(i => i + 1)
    } else {
      // Loop back to start when reaching the end
      setStartIdx(0)
    }
  }

  // Auto-scroll effect (only on mobile)
  useEffect(() => {
    if (!isAutoPlaying) return

    // Only auto-play on mobile devices
    const isMobile = window.innerWidth <= 768
    if (!isMobile) return

    autoPlayRef.current = setInterval(() => {
      setStartIdx(currentIdx => {
        const maxIdx = products.length + (showViewMore ? 1 : 0) - VISIBLE
        if (currentIdx >= maxIdx) {
          return 0 // Loop back to start
        }
        return currentIdx + 1
      })
    }, 3000) // Change slide every 3 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, products.length, showViewMore])

  // Pause autoplay when user scrolls manually
  const handleScroll = () => {
    setIsAutoPlaying(false)
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }

  // Slots: product cards + optional View More card
  const slots = [...products, ...(showViewMore ? [{ id: 'viewmore' }] : [])]
  const visible = slots.slice(startIdx, startIdx + VISIBLE)

  // Function to handle add to bag
  const handleAddToBag = (e, product) => {
    if (e) e.stopPropagation()
    if (onAddToCart && product) {
      // Pass the product directly - the parent will handle the cart logic
      onAddToCart(product, 1)
    }
  }

  return (
    <section className="section best-sellers">
      {/* Header */}
      <div className="bs__top">
        <h2 className="section__title">Best Sellers</h2>

        {/* Tabs */}
        <div className="best-sellers__tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`best-sellers__tab ${activeTab === tab.id ? 'best-sellers__tab--active' : ''}`}
              onClick={() => handleTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="bs__grid" ref={gridRef} onTouchStart={handleScroll} onMouseDown={handleScroll}>
        {visible.map(p => {
          if (p.id === 'viewmore') {
            return (
              <div key="viewmore" className="product-card product-card--viewmore" onClick={() => onNavigate && onNavigate('skincare')}>
                <span className="bs__viewmore-text">View More</span>
              </div>
            )
          }
          return (
            <ProductCard3D
              key={p.id}
              product={p}
              onNavigate={onNavigate}
              onAddToCart={(product) => handleAddToBag(null, product)}
              showTag={true}
            />
          )
        })}
      </div>

      {/* Bottom bar: divider + arrows */}
      <div className="bs__footer">
        <div className="bs__footer-line" />
        
        {/* Slide Indicators (Mobile Only) */}
        <div className="bs__indicators">
          {Array.from({ length: Math.ceil((products.length + (showViewMore ? 1 : 0)) / VISIBLE) }).map((_, idx) => (
            <button
              key={idx}
              className={`bs__indicator ${startIdx === idx * VISIBLE || (startIdx >= idx * VISIBLE && startIdx < (idx + 1) * VISIBLE) ? 'bs__indicator--active' : ''}`}
              onClick={() => {
                setStartIdx(idx * VISIBLE)
                setIsAutoPlaying(false)
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="bs__arrows">
          <button
            className={`bs__arrow ${!canPrev ? 'bs__arrow--disabled' : ''}`}
            onClick={prev}
            aria-label="Previous"
          >
            ←
          </button>
          <button
            className={`bs__arrow ${!canNext ? 'bs__arrow--disabled' : ''}`}
            onClick={next}
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
