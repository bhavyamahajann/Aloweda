import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AlowedaLogo from '../assets/AlowedaLogo.png'
import './PageTransition.css'

export default function PageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Show transition when route changes
    setIsTransitioning(true)

    // Hide transition after animation
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 1000) // 1 second

    return () => clearTimeout(timer)
  }, [location.pathname])

  if (!isTransitioning) return null

  return (
    <div className="page-transition-overlay">
      <div className="page-transition-content">
        <img 
          src={AlowedaLogo} 
          alt="Aloweda" 
          className="page-transition-logo"
        />
        <div className="page-transition-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    </div>
  )
}
