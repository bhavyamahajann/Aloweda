import { bundles } from '../data/regimenOptions'
import './StepStyles.css'

export default function BundleStep({ selected, onSelect }) {
  return (
    <div className="step-container">
      <h2 className="step-heading">What type of skincare routine are you looking for?</h2>
      <p className="step-description">Choose the bundle that best fits your needs</p>

      <div className="selection-list">
        {bundles.map((bundle) => (
          <button
            key={bundle.id}
            className={`selection-card-large ${selected === bundle.id ? 'selected' : ''}`}
            onClick={() => onSelect(bundle.id)}
          >
            <div className="card-content">
              <h3 className="card-title">{bundle.label}</h3>
              <p className="card-description">{bundle.description}</p>
            </div>
            {selected === bundle.id && (
              <span className="card-check">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
