import { useState, useEffect, useRef, useCallback } from 'react'
import AlowedaLogo from '../assets/AlowedaLogo.png'
import Slide1 from '../assets/HomeSlider1.png'
import Slide2 from '../assets/HomeSlider2.png'
import Slide3 from '../assets/HomeSlider3.png'
// import Slide4 from '../assets/HomeSlider4.png'
import Slide5 from '../assets/HomeSlider5.png'
import SmartSkinCareLookBook from '../assets/SmartSkinCareLookBook.png'
import HairCareLookBook from '../assets/HairCareLookBook.png'
import FaceWashBG from '../assets/FaceWashBG.png'
import { handleNavigation } from '../utils/navigation'
import SC1 from '../SkinCareImg/SkinCare1.png'
import SC2 from '../SkinCareImg/SkinCare2.png'
import SC3 from '../SkinCareImg/SkinCare3.jpg'
import SC10 from '../SkinCareImg/SkinCare10.jpg'
import SC11 from '../SkinCareImg/SkinCare11.jpg'
import LC2 from '../LipCareImg/LipCare2.jpg'
import HairCareImg from '../assets/HairCare.png'
import Navbar from '../Navbar/navbar'
import BestSellers from './BestSeller'
import BuildRegimenCTA from './BuildRegimenCTA'
import ImageCarousel from './ImageCarousel'
import CategorySlider from './CategorySlider'
import ShopByCategory from './ShopBYCategory'
import FeatureList from './FeatureList/FeatureList'
import Footer from '../Footer/Footer'
import './HomePage.css'

/* ─────────────── DATA ─────────────── */

const slides = [
  {
    id: 1,
    image: Slide1,
    tag: 'Science-Based',
    heading: 'What is Aloweda',
    sub: 'Modern dermatology meets proven ingredients. We promise results, not miracles!',
    cta: 'SHOP NOW',
    position: 'center',
    targetPage: 'shop', // Navigate to all products page
  },
  {
    id: 2,
    image: Slide2,
    tag: 'Best Seller',
    heading: 'Lip Care',
    sub: 'Day & Night Ritual',
    cta: 'SHOP NOW',
    position: 'center',
    targetPage: 'shop', // Navigate to all products page
  },
    {
    id: 3,
    image: Slide3,
    tag: 'New Launch',
    heading: 'Hair Care',
    sub: 'Glow Essence',
    cta: 'SHOP NOW',
    position: 'center',
    targetPage: 'shop', // Navigate to all products page
  },
//   {
//     id: 4,
//     image: Slide4,
//     tag: 'Trending',
//     heading: 'Dietary Supplements',
//     sub: 'Advanced Formula',
//     cta: 'Shop Now',
//     position: 'right center',
//   },
  {
    id: 5,
    image: Slide5,
    tag: 'Bestseller',
    heading: 'Smart Skin Care',
    sub: 'Anti-Aging Range',
    cta: 'Shop Now',
    position: 'top center',
    targetPage: 'shop', // Navigate to all products page
  },
]

const categories = [
  { label: 'Face Serums', icon: '✦' },
  { label: 'Moisturisers', icon: '✦' },
  { label: 'Face Wash', icon: '✦' },
  { label: 'Eye Care', icon: '✦' },
  { label: 'Sunscreen', icon: '✦' },
  { label: 'Hair Care', icon: '✦' },
]

/* ─────────────── HERO SLIDER ─────────────── */
/* Full-bleed background-image slides with text overlay (matches aloweda.com reference) */

function HeroSlider({ onNavigate }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef(null)

  const goTo = useCallback((index) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 700)
  }, [animating])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  useEffect(() => {
    timerRef.current = setInterval(next, 5000)
    return () => clearInterval(timerRef.current)
  }, [next])

  const resetTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 5000)
  }

  const handleShopNowClick = (targetPage) => {
    if (targetPage && onNavigate) {
      onNavigate(targetPage)
    }
  }

  return (
    <section className="hero">
      <div className="hero__track">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero__slide ${i === current ? 'hero__slide--active' : ''}`}
          >
            <div
              className="hero__bg"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: slide.position || 'center',
              }}
            />
            <div className="hero__overlay" />
            <div className="hero__content">
              <span className="hero__tag">{slide.tag}</span>
              <h1 className="hero__heading">{slide.heading}</h1>
              <p className="hero__sub">{slide.sub}</p>
              <button 
                className="btn btn--dark"
                onClick={() => handleShopNowClick(slide.targetPage)}
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="hero__arrow hero__arrow--prev"
        onClick={() => { prev(); resetTimer() }}
        aria-label="Previous"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className="hero__arrow hero__arrow--next"
        onClick={() => { next(); resetTimer() }}
        aria-label="Next"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
            onClick={() => { goTo(i); resetTimer() }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

/* ─────────────── MARQUEE STRIP ─────────────── */

function MarqueeStrip() {
  const items = ['Free Shipping Above ₹999', 'Science-Backed Formulas', 'Clinically Proven Ingredients', 'Dermatologist Tested', 'No Parabens · No Sulphates', 'Made in India ✦']
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </div>
  )
}

/* ─────────────── CATEGORIES ─────────────── */

function Categories() {
  return (
    <section className="section categories-section">
      <div className="section__header">
        <span className="section__eyebrow">Browse</span>
        <h2 className="section__title">Shop by Category</h2>
      </div>
      <div className="categories-grid">
        {categories.map((c) => (
          <a key={c.label} href="#" className="category-card">
            <div className="category-card__icon">{c.icon}</div>
            <span className="category-card__label">{c.label}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

/* ─────────────── WHY ALOWEDA ─────────────── */

function WhyAloweda() {
  const pillars = [
    { icon: '🌿', title: 'Proven Ingredients', desc: 'Evidence-based formulations blended with modern science for real results.' },
    { icon: '🧪', title: 'Dermatologist Tested', desc: 'Every formula is clinically evaluated for safety and efficacy.' },
    { icon: '✦', title: 'No Nasties', desc: 'Zero parabens, sulphates, or artificial fragrances. Ever.' },
    { icon: '📦', title: 'Sustainable Packaging', desc: 'Eco-conscious packaging that doesn\'t cost the planet.' },
  ]
  return (
    <section className="section why-section">
      <div className="why-section__inner">
        <div className="section__header section__header--left">
          <span className="section__eyebrow">Our Promise</span>
          <h2 className="section__title">Why Aloweda?</h2>
          <p className="section__desc">Sensible. Simple. Synergy. — That's not just a tagline, it's our formula.</p>
        </div>
        <div className="pillars-grid">
          {pillars.map((p) => (
            <div key={p.title} className="pillar-card">
              <div className="pillar-card__icon">{p.icon}</div>
              <h3 className="pillar-card__title">{p.title}</h3>
              <p className="pillar-card__desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────── ALOWEDA INTRO SECTION ─────────────── */

function AlowedaIntro({ onNavigate }) {
  const fullTitle = "Aloweda: Science-Based Wellness and Skincare Solutions"
  const fullDesc = "Aloweda is a wellness brand offering a diverse range of scientifically-formulated products, including skincare, hair care, and dietary supplements. Our formulations emphasize proven ingredients like aloe vera, kokum butter, and turmeric, aiming to provide effective solutions for various health and beauty needs. With products such as lip butter, eyebrow serum, and turmeric curcumin capsules, Aloweda combines evidence-based research with effective formulations to promote holistic well-being. All products are 100% cruelty-free, ensuring ethical and conscious self-care."

  // Check localStorage on mount
  const hasTypedBefore = localStorage.getItem('aloweda_hero_typed') === 'true'
  
  const [titleText, setTitleText] = useState(hasTypedBefore ? fullTitle : '')
  const [descText, setDescText] = useState(hasTypedBefore ? fullDesc : '')
  const [isTypingComplete, setIsTypingComplete] = useState(hasTypedBefore)
  const sectionRef = useRef(null)
  const hasTypedRef = useRef(hasTypedBefore)

  useEffect(() => {
    // If already typed before, don't set up observer
    if (hasTypedBefore) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTypedRef.current) {
            hasTypedRef.current = true
            
            // Type title first
            let titleIndex = 0
            const titleInterval = setInterval(() => {
              if (titleIndex < fullTitle.length) {
                setTitleText(fullTitle.slice(0, titleIndex + 1))
                titleIndex++
              } else {
                clearInterval(titleInterval)
                
                // Then type description
                let descIndex = 0
                const descInterval = setInterval(() => {
                  if (descIndex < fullDesc.length) {
                    setDescText(fullDesc.slice(0, descIndex + 1))
                    descIndex++
                  } else {
                    clearInterval(descInterval)
                    setIsTypingComplete(true)
                    // Save to localStorage after typing completes
                    localStorage.setItem('aloweda_hero_typed', 'true')
                  }
                }, 15)
              }
            }, 50)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [hasTypedBefore, fullTitle, fullDesc])

  return (
    <section ref={sectionRef} className="aloweda-intro">
      <div className="aloweda-intro__container">
        <h2 className={`aloweda-intro__title ${!isTypingComplete && titleText ? 'typing' : ''}`}>
          {titleText}
        </h2>
        <p className={`aloweda-intro__description ${!isTypingComplete && descText ? 'typing' : ''}`}>
          {descText}
        </p>
        {isTypingComplete && (
          <button 
            className="aloweda-intro__btn"
            onClick={() => onNavigate('shop')}
          >
            SHOP NOW
          </button>
        )}
      </div>
    </section>
  )
}

/* ─────────────── LOOK BOOK SLIDER ─────────────── */

function LookBookSlider({ onNavigate, onAddToCart, allProducts }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const lookBookSlides = [
    {
      id: 1,
      background: SmartSkinCareLookBook,
      category: 'Smart Skincare',
      products: [
        { id: 1, img: SC1, name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', price: 'Rs. 799.00' },
        { id: 2, img: SC2, name: 'PERFECT COMPLEXION RITUAL: Pigment Control Serum + The Day Cream+ Complexion Cream + Smooth Perfection Serum', price: 'Rs. 999.00' },
        { id: 3, img: SC3, name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', price: 'Rs. 999.00' },
      ]
    },
    {
      id: 2,
      background: FaceWashBG,
      category: 'Face Wash',
      products: [
        { id: 10, img: SC10, name: 'Retinol 0.3%, Copper Tripeptide, Alpha Arbutin & Niacinamide: Wrinkles & Lines Cream 50 G', price: 'Rs. 449.00' },
        { id: 11, img: SC11, name: 'Encapsulated Retinol 1.9%, Grape Seed Extract, & Ceramides : Lines & Wrinkles Serum 30 ml', price: 'Rs. 499.00' },
        { id: 17, img: LC2, name: 'Lip Butter 15 Gram: Butters, Oils & Honey. NO CHEMICALS, NO PRESERVATIVES. NOT LIP BALM', price: 'From Rs. 165.00' },
      ]
    },
    {
      id: 3,
      background: HairCareLookBook,
      category: 'Hair Care',
      products: [
        { id: 16, img: HairCareImg, name: 'Redensyl 5%, Anagain 5%, Rice water & Biotin: Total Hair Therapy Serum 50 ml', price: 'Rs. 575.00' },
        { id: 1, img: SC1, name: 'YOUR SIMPLE ROUTINE: The Day Cream + The Night Cream + Lip Butter', price: 'Rs. 799.00' },
        { id: 3, img: SC3, name: 'RITUAL OF RADIANCE: Super Glow Serum 30 ml + The Day Cream + Radiance Cream 50 gram', price: 'Rs. 999.00' },
      ]
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % lookBookSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + lookBookSlides.length) % lookBookSlides.length)
  }

  const currentData = lookBookSlides[currentSlide]

  // Function to handle add to cart
  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    if (onAddToCart && allProducts) {
      const fullProduct = allProducts.find(p => p.id === product.id)
      if (fullProduct) {
        onAddToCart(fullProduct, 1)
      }
    }
  }

  return (
    <section className="lookbook-section">
      <div className="lookbook-container">
        {/* Left side - Background image with slider */}
        <div className="lookbook-left">
          <div className="lookbook-bg" style={{ backgroundImage: `url(${currentData.background})` }}>
            <div className="lookbook-overlay" />
            <div className="lookbook-category">{currentData.category}</div>
          </div>
          
          {/* Slider arrows */}
          <button className="lookbook-arrow lookbook-arrow--prev" onClick={prevSlide} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="lookbook-arrow lookbook-arrow--next" onClick={nextSlide} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Right side - Products list */}
        <div className="lookbook-right">
          <h2 className="lookbook-title">Look Book</h2>
          <div className="lookbook-products">
            {currentData.products.map((product) => (
              <div 
                key={product.id} 
                className="lookbook-product"
              >
                <div 
                  className="lookbook-product__img" 
                  onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: product.id })}
                  onAuxClick={(e) => e.button === 1 && handleNavigation(e, onNavigate, 'product', { productId: product.id })}
                >
                  <img src={product.img} alt={product.name} />
                </div>
                <div className="lookbook-product__info">
                  <h3 
                    className="lookbook-product__name" 
                    onClick={(e) => handleNavigation(e, onNavigate, 'product', { productId: product.id })}
                    onAuxClick={(e) => e.button === 1 && handleNavigation(e, onNavigate, 'product', { productId: product.id })}
                  >{product.name}</h3>
                  <div className="lookbook-product__footer">
                    <p className="lookbook-product__price">{product.price}</p>
                    <button className="btn btn--outline-dark btn--sm" onClick={(e) => handleAddToCart(e, product)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────── TESTIMONIALS ─────────────── */

function Testimonials() {
  const reviews = [
    { name: 'Priya S.', loc: 'Mumbai', text: 'My skin has never felt this balanced. The Glow Serum is genuinely life-changing.', stars: 5 },
    { name: 'Arjun M.', loc: 'Delhi', text: 'I was sceptical at first but three weeks in — my pigmentation has visibly reduced.', stars: 5 },
    { name: 'Sneha R.', loc: 'Bangalore', text: 'Clean ingredients, beautiful packaging, and the results speak for themselves.', stars: 5 },
  ]
  return (
    <section className="section testimonials-section">
      <div className="section__header">
        <span className="section__eyebrow">Reviews</span>
        <h2 className="section__title">What People Say</h2>
      </div>
      <div className="testimonials-grid">
        {reviews.map((r) => (
          <div key={r.name} className="testimonial-card">
            <div className="testimonial-card__stars">{'★'.repeat(r.stars)}</div>
            <p className="testimonial-card__text">"{r.text}"</p>
            <div className="testimonial-card__author">
              <span className="testimonial-card__name">{r.name}</span>
              <span className="testimonial-card__loc">{r.loc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────── ROOT ─────────────── */

export default function HomePage({ onNavigate, onLoginClick, cartCount, onAddToCart, allProducts }) {
  return (
    <div className="page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />
      <main>
        <HeroSlider onNavigate={onNavigate} />
        <MarqueeStrip />
        <BestSellers onNavigate={onNavigate} onAddToCart={onAddToCart} allProducts={allProducts} />
        <BuildRegimenCTA onNavigate={onNavigate} />
        <ImageCarousel />
        <LookBookSlider onNavigate={onNavigate} onAddToCart={onAddToCart} allProducts={allProducts} />
        <AlowedaIntro onNavigate={onNavigate} />
        <CategorySlider onNavigate={onNavigate} />
        <Categories />
        <WhyAloweda />
        <FeatureList onNavigate={onNavigate} />
        <Testimonials />
      </main>
      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}