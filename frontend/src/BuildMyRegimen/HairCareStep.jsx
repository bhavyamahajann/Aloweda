import { hairConcerns } from '../data/regimenOptions'
import './StepStyles.css'

export default function HairCareStep({ selected, onSelect }) {
  const toggleConcern = (concernId) => {
    // If "No Hair Concerns" is selected, clear all and select only "none"
    if (concernId === 'none') {
      onSelect(['none'])
      return
    }

    // If any other concern is selected, remove "none" if it exists
    let newSelected = selected.filter(id => id !== 'none')
    
    if (newSelected.includes(concernId)) {
      newSelected = newSelected.filter(id => id !== concernId)
    } else {
      newSelected = [...newSelected, concernId]
    }
    
    onSelect(newSelected)
  }

  return (
    <div className="step-container">
      <h2 className="step-heading">What are your hair concerns?</h2>
      <p className="step-description">Select all that apply (or skip if you don't need hair care products)</p>

      <div className="selection-grid">
        {hairConcerns.map((concern) => (
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
