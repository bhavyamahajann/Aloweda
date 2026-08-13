import { skinConcerns } from '../data/regimenOptions'
import './StepStyles.css'

export default function SkinCareStep({ selected, onSelect }) {
  const toggleConcern = (concernId) => {
    if (selected.includes(concernId)) {
      onSelect(selected.filter(id => id !== concernId))
    } else {
      onSelect([...selected, concernId])
    }
  }

  return (
    <div className="step-container">
      <h2 className="step-heading">What would you like to improve?</h2>
      <p className="step-description">Select all that apply to your skin concerns</p>

      <div className="selection-grid">
        {skinConcerns.map((concern) => (
          <button
            key={concern.id}
            className={`selection-card ${selected.includes(concern.id) ? 'selected' : ''}`}
            onClick={() => toggleConcern(concern.id)}
          >
            <span className="card-label">{concern.label}</span>
            {selected.includes(concern.id) && (
              <span className="card-check">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
