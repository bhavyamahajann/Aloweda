import { useState, useRef, useEffect } from 'react'
import './Product360View.css'

/* ── 360° Rotating Product View ── */
export default function Product360View({ productImage, productName }) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const containerRef = useRef(null)

  // Auto rotation effect
  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360)
    }, 50) // Smooth rotation

    return () => clearInterval(interval)
  }, [autoRotate])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setAutoRotate(false)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    setRotation(prev => (prev + deltaX * 0.5) % 360)
    setStartX(e.clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e) => {
    setIsDragging(true)
    setAutoRotate(false)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return

    const deltaX = e.touches[0].clientX - startX
    setRotation(prev => (prev + deltaX * 0.5) % 360)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate)
  }

  return (
    <div className="product-360">
      <div 
        ref={containerRef}
        className={`product-360__container ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 3D Scene */}
        <div 
          className="product-360__scene"
          style={{ transform: `perspective(1200px) rotateY(${rotation}deg)` }}
        >
          {/* Main Product Image */}
          <div className="product-360__image-wrapper">
            <img 
              src={productImage} 
              alt={productName}
              className="product-360__image"
              draggable="false"
            />
            
            {/* Reflection/Shadow */}
            <div className="product-360__reflection" />
          </div>
        </div>

        {/* Circular Platform */}
        <div className="product-360__platform">
          <div className="product-360__platform-ring" />
          <div className="product-360__platform-dot" style={{ transform: `rotate(${rotation}deg)` }} />
        </div>

        {/* Instructions Overlay */}
        {!isDragging && (
          <div className="product-360__instructions">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>Drag to rotate</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="product-360__controls">
        <button 
          className={`product-360__control-btn ${autoRotate ? 'active' : ''}`}
          onClick={toggleAutoRotate}
          title={autoRotate ? 'Pause rotation' : 'Auto rotate'}
        >
          {autoRotate ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        <button 
          className="product-360__control-btn"
          onClick={() => setRotation(0)}
          title="Reset view"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>

        <div className="product-360__rotation-indicator">
          {Math.round(rotation)}°
        </div>
      </div>
    </div>
  )
}
