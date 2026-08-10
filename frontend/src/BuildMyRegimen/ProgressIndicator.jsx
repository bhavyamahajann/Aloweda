import './ProgressIndicator.css'

const steps = [
  { number: 1, label: 'Skin Care' },
  { number: 2, label: 'Bundle' },
  { number: 3, label: 'Skin Type' },
  { number: 4, label: 'Photo' },
  { number: 5, label: 'Consultation' }
]

export default function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div className="progress-indicator">
      <div className="progress-steps">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`progress-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
          >
            <div className="step-circle">
              {currentStep > step.number ? '✓' : `0${step.number}`}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
      <div className="progress-text">Step {currentStep} of {totalSteps}</div>
    </div>
  )
}
