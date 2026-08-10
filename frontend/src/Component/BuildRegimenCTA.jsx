import './BuildRegimenCTA.css'

export default function BuildRegimenCTA({ onNavigate }) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate('build-my-regimen')
    }
  }

  return (
    <section className="build-regimen-cta">
      <div className="regimen-cta-container">
        <div className="regimen-cta-content">
          <h2 className="regimen-cta-heading">Build Your Personalized Skincare Routine</h2>
          <p className="regimen-cta-description">
            Answer a few simple questions and discover a skincare routine tailored to your skin's needs
          </p>
          <button className="regimen-cta-btn" onClick={handleClick}>
            Build My Regimen →
          </button>
        </div>
      </div>
    </section>
  )
}
