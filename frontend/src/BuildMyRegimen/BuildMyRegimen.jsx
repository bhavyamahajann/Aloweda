import { useState } from 'react'
import Navbar from '../Navbar/navbar'
import Footer from '../Footer/Footer'
import ProgressIndicator from './ProgressIndicator'
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
      // Final submission
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
    // Show results
    setShowResults(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canProceed = () => {
    const onlySpecialCare = formData.skinConcerns.length > 0 && 
                            formData.skinConcerns.every(c => c === 'haircare' || c === 'lipcare')
    
    switch (currentStep) {
      case 1:
        return formData.skinConcerns.length > 0
      case 2:
        // Skip bundle selection if only Hair Care or Lip Care selected
        return onlySpecialCare || formData.bundle !== ''
      case 3:
        // Skip skin type if only Hair Care or Lip Care selected
        return onlySpecialCare || formData.skinType !== ''
      case 4:
        return true // Photo is optional
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

      <div className="build-regimen-container">
        <header className="regimen-header">
          <h1>Build Your Personalized Skincare Regimen</h1>
          <p>Answer a few simple questions to discover products designed for your skin's unique needs</p>
        </header>

        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="regimen-content">
          {currentStep === 1 && (
            <SkinCareStep
              selected={formData.skinConcerns}
              onSelect={(concerns) => updateFormData('skinConcerns', concerns)}
            />
          )}

          {currentStep === 2 && (
            <>
              {formData.skinConcerns.every(c => c === 'haircare' || c === 'lipcare') ? (
                <div className="step-container">
                  <h2 className="step-heading">Bundle Selection</h2>
                  <p className="step-description">
                    You've selected Hair Care or Lip Care. These products don't require a facial skincare bundle. 
                    Click Next to continue.
                  </p>
                  <div style={{ textAlign: 'center', padding: '40px', color: '#6b6b6b' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 20px' }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <p style={{ fontSize: '16px', fontWeight: '500', color: '#2b2620' }}>
                      Your selections are for specialized care products
                    </p>
                  </div>
                </div>
              ) : (
                <BundleStep
                  selected={formData.bundle}
                  onSelect={(bundle) => updateFormData('bundle', bundle)}
                />
              )}
            </>
          )}

          {currentStep === 3 && (
            <>
              {formData.skinConcerns.every(c => c === 'haircare' || c === 'lipcare') ? (
                <div className="step-container">
                  <h2 className="step-heading">Skin Type</h2>
                  <p className="step-description">
                    This step is for facial skincare. Since you selected Hair Care or Lip Care, you can skip this.
                    Click Next to continue.
                  </p>
                  <div style={{ textAlign: 'center', padding: '40px', color: '#6b6b6b' }}>
                    <p style={{ fontSize: '16px', fontWeight: '500', color: '#2b2620' }}>
                      Skin type selection not required for your selections
                    </p>
                  </div>
                </div>
              ) : (
                <SkinTypeStep
                  selected={formData.skinType}
                  onSelect={(skinType) => updateFormData('skinType', skinType)}
                />
              )}
            </>
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
        </div>

        <div className="regimen-navigation">
          {currentStep > 1 && (
            <button className="regimen-btn regimen-btn--back" onClick={handleBack}>
              ← Back
            </button>
          )}
          
          <button
            className="regimen-btn regimen-btn--next"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === totalSteps ? 'Get My Skincare Regimen' : 'Next →'}
          </button>
        </div>
      </div>

      <Footer onLoginClick={onLoginClick} />
    </div>
  )
}
