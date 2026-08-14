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

export default function BuildMyRegimen({ onNavigate, onLoginClick, cartCount }) {
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

  const totalSteps = 5

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
    return <RecommendationResults formData={formData} onNavigate={onNavigate} />
  }

  return (
    <div className="build-regimen-page">
      <Navbar onNavigate={onNavigate} onLoginClick={onLoginClick} cartCount={cartCount} />

      {/* Hero Section */}
      <div className="regimen-hero">
        <div className="regimen-hero-content">
          <span className="hero-badge">Personalized Skincare</span>
          <h1 className="hero-title">Build Your Perfect Regimen</h1>
          <p className="hero-description">
            Answer a few questions and get a personalized skincare routine tailored to your unique needs
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Simple Questions</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">2 Min</span>
              <span className="stat-label">Quick Process</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Personalized</span>
            </div>
          </div>
          <button className="hero-cta" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            Get Started
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle decoration-circle-1"></div>
          <div className="decoration-circle decoration-circle-2"></div>
          <div className="decoration-circle decoration-circle-3"></div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="split-screen-container">
        {/* Left Side - Question */}
        <div className="question-panel">
          <div className="question-content">
            <div className="progress-text">Question {currentStep} of {totalSteps}</div>
            
            {currentStep === 1 && (
              <>
                <h1 className="question-title">What are your skin concerns?</h1>
                <p className="question-subtitle">Select all that apply</p>
              </>
            )}
            
            {currentStep === 2 && (
              <>
                <h1 className="question-title">Choose your routine type</h1>
                <p className="question-subtitle">What kind of skincare routine are you looking for?</p>
              </>
            )}
            
            {currentStep === 3 && (
              <>
                <h1 className="question-title">What's your skin type?</h1>
                <p className="question-subtitle">Select the one that best describes your skin</p>
              </>
            )}
            
            {currentStep === 4 && (
              <>
                <h1 className="question-title">Upload a photo (Optional)</h1>
                <p className="question-subtitle">Help us understand your skin better</p>
              </>
            )}
            
            {currentStep === 5 && (
              <>
                <h1 className="question-title">Your contact details</h1>
                <p className="question-subtitle">We'll send your personalized regimen to your email</p>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="question-navigation">
              {currentStep > 1 && (
                <button className="nav-btn nav-btn--back" onClick={handleBack}>
                  ← Previous
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
