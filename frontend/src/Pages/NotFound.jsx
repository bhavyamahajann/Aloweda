import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__container">
        <div className="notfound__content">
          {/* 404 Text with Animation */}
          <div className="notfound__number">
            <span className="notfound__digit">4</span>
            <span className="notfound__digit notfound__digit--middle">0</span>
            <span className="notfound__digit">4</span>
          </div>

          {/* Message */}
          <h1 className="notfound__title">Page Not Found</h1>
          <p className="notfound__description">
            Oops! The page you're looking for seems to have wandered off. 
            Don't worry, let's get you back on track.
          </p>

          {/* Navigation Buttons */}
          <div className="notfound__actions">
            <Link to="/" className="notfound__btn notfound__btn--primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go Home
            </Link>
            <Link to="/shop" className="notfound__btn notfound__btn--secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Shop Now
            </Link>
          </div>

          {/* Quick Links */}
          <div className="notfound__links">
            <p className="notfound__links-title">Quick Links:</p>
            <div className="notfound__links-grid">
              <Link to="/bestsellers" className="notfound__link">Best Sellers</Link>
              <Link to="/skincare" className="notfound__link">Skin Care</Link>
              <Link to="/haircare" className="notfound__link">Hair Care</Link>
              <Link to="/lipcare" className="notfound__link">Lip Care</Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="notfound__decoration">
          <div className="notfound__circle notfound__circle--1"></div>
          <div className="notfound__circle notfound__circle--2"></div>
          <div className="notfound__circle notfound__circle--3"></div>
        </div>
      </div>
    </div>
  )
}
