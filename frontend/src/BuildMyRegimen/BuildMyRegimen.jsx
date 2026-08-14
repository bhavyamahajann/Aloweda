import { useState } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import SkinCareStep from './SkinCareStep'
import BundleStep from './BundleStep'
import SkinTypeStep from './SkinTypeStep'
import PhotoUploadStep from './PhotoUploadStep'
import ConsultationStep from './ConsultationStep'
import RecommendationResults from './RecommendationResults'
import './BuildMyRegimen.css'

const STEPS = [
  { id: 1, label: 'Skin Concerns', title: 'What are your skin concerns?', subtitle: 'Select all that apply' },
  { id: 2, label: 'Routine Type', title: 'Choose your routine type', subtitle: 'What kind of skincare routine are you looking for?' },
  { id: 3, label: 'Skin Type', title: "What's your skin type?", subtitle: 'Select the one that best describes your skin' },
  { id: 4, label: 'Photo (Optional)', title: 'Upload a photo', subtitle: 'Optional — helps us understand your skin better' },
  { id: 5, label: 'Contact Details', title: 'Your contact details', subtitle: "We'll send your personalized regimen to your email" }
]

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BuildMyRegimen({ onNavigate, onLoginClick, cartCount, onAddToCart }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState({
    skinConcerns: [],
    bundle: '',
    skinType: '',
    photo: null,
    consultation: {
      name: '',
      email: '',
      phone: '',
      age: '',
      additionalConcerns: '',
      currentRoutine: '',
      allergies: '',
      consent: false
    }
  })

  const totalSteps = STEPS.length
  const activeStep = STEPS.find(s => s.id === currentStep)

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateConsultation = (field, value) => {
    setFormData(prev => ({
      ...prev,
      consultation: {
        ...prev.consultation,
        [field]: value
      }
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.skinConcerns.length > 0
      case 2:
        return formData.bundle !== ''
      case 3:
        return formData.skinType !== ''
      case 4:
        return true
      case 5:
        return (
          formData.consultation.name &&
          formData.consultation.email &&
          formData.consultation.phone &&
          formData.consultation.consent
        )
      default:
        return false
    }
  }

  if (showResults) {
    return <RecommendationResults formData={formData} onNavigate={onNavigate} onAddToCart={onAddToCart} />
  }

  return (
    <div className="build-regimen-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* Split Screen Layout */}
      <div className="split-screen-container">
        {/* Left Side - Progress Rail + Question */}
        <div className="question-panel">
          <div className="question-content">

            <div className="progress-rail">
              <span className="rail-eyebrow">Step {currentStep} of {totalSteps}</span>

              <div className="rail-track" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
                <div className="rail-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
              </div>

              <ol className="rail-steps">
                {STEPS.map(step => {
                  const isDone = currentStep > step.id
                  const isCurrent = currentStep === step.id
                  return (
                    <li key={step.id} className={`rail-step ${isCurrent ? 'is-current' : ''} ${isDone ? 'is-done' : ''}`}>
                      <span className="rail-step-marker">
                        {isDone ? <CheckIcon /> : step.id}
                      </span>
                      <span className="rail-step-label">{step.label}</span>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="rail-question">
              <h1 className="question-title">{activeStep.title}</h1>
              <p className="question-subtitle">{activeStep.subtitle}</p>

              {currentStep > 1 && (
                <button className="nav-btn nav-btn--back" onClick={handleBack}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Options */}
        <div className="options-panel">
          <div className="options-content">
            {currentStep === 1 && (
              <SkinCareStep
                selected={formData.skinConcerns}
                onSelect={(concerns) => updateFormData('skinConcerns', concerns)}
              />
            )}

            {currentStep === 2 && (
              <BundleStep
                selected={formData.bundle}
                onSelect={(bundle) => updateFormData('bundle', bundle)}
              />
            )}

            {currentStep === 3 && (
              <SkinTypeStep
                selected={formData.skinType}
                onSelect={(skinType) => updateFormData('skinType', skinType)}
              />
            )}

            {currentStep === 4 && (
              <PhotoUploadStep
                photo={formData.photo}
                onPhotoChange={(photo) => updateFormData('photo', photo)}
              />
            )}

            {currentStep === 5 && (
              <ConsultationStep
                data={formData.consultation}
                onChange={updateConsultation}
              />
            )}

            {/* Next Button */}
            <button
              className={`next-btn ${!canProceed() ? 'next-btn--disabled' : ''}`}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === totalSteps ? 'Get My Regimen' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}