import { useState } from 'react'
import './FeatureList.css'
import SkinCareImg from '../../assets/FeaturedListSkinCare.png'
import HairCareImg from '../../assets/HairCareFeaturedList.png'
import LipCareImg from '../../assets/FeaturedListLipCare.jpg'

const features = [
  { id: 1, number: '01', label: 'SKIN CARE', page: 'skincare', img: SkinCareImg, blurb: 'Sensible rituals for radiant, healthy skin.' },
  { id: 2, number: '02', label: 'HAIR CARE', page: 'hair', img: HairCareImg, blurb: 'Nourishing formulas for stronger, fuller hair.' },
  { id: 3, number: '03', label: 'LIP CARE', page: 'lip', img: LipCareImg, blurb: 'Soft, nourished lips — naturally, every day.' },
]

export default function FeatureList({ onNavigate }) {
  const [selectedFeature, setSelectedFeature] = useState(1)

  const activeFeature = features.find(f => f.id === selectedFeature) || features[0]

  const handleFeatureClick = (featureId) => {
    setSelectedFeature(featureId)
  }

  const handleShopNow = () => {
    if (activeFeature && onNavigate) {
      onNavigate(activeFeature.page)
    }
  }

  return (
    <section className="feature-list-section">
      <div className="feature-list-container">
        {/* Left: Image with crossfade */}
        <div className="feature-list-image">
          {features.map((feature) => (
            <img
              key={feature.id}
              src={feature.img}
              alt={feature.label}
              className={`feature-list-image__img ${selectedFeature === feature.id ? 'is-active' : ''}`}
            />
          ))}
          <div className="feature-list-image__tag">{activeFeature.label}</div>
        </div>

        {/* Right: Feature List */}
        <div className="feature-list-content">
          <h2 className="feature-list-title">Discover Your Ritual</h2>

          <div className="feature-items">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`feature-item ${selectedFeature === feature.id ? 'feature-item--active' : ''}`}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <span className="feature-number">{feature.number}</span>
                <div className="feature-item__text">
                  <span className="feature-label">{feature.label}</span>
                  <span className="feature-blurb">{feature.blurb}</span>
                </div>
                <span className="feature-indicator" />
              </div>
            ))}
          </div>

          <button className="feature-shop-btn" onClick={handleShopNow}>
            Shop {activeFeature.label}
          </button>
        </div>
      </div>
    </section>
  )
}