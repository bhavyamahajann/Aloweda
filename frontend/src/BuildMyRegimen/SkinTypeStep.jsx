import { skinTypes } from '../data/regimenOptions'
import './StepStyles.css'

export default function SkinTypeStep({ selected, onSelect }) {
  return (
    <div className="step-container">
      <h2 className="step-heading">What is your skin type?</h2>
      <p className="step-description">Select the option that best describes your skin</p>

      <div className="selection-grid">
        {skinTypes.map((type) => (
          <button
            key={type.id}
            className={`selection-card ${selected === type.id ? 'selected' : ''}`}
            onClick={() => onSelect(type.id)}
          >
            <span className="card-label">{type.label}</span>
            {selected === type.id && (
              <span className="card-check">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
