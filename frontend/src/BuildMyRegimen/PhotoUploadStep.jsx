import { useState } from 'react'
import './StepStyles.css'

export default function PhotoUploadStep({ photo, onPhotoChange }) {
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(photo ? URL.createObjectURL(photo) : null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, JPEG, or PNG image')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must be less than 5MB')
      return
    }

    setError('')
    onPhotoChange(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleRemove = () => {
    onPhotoChange(null)
    setPreview(null)
    setError('')
  }

  return (
    <div className="step-container">
      <h2 className="step-heading">Upload a clear photo of your skin</h2>
      <p className="step-description">Upload a clear, well-lit photo without filters for a better skincare assessment (Optional)</p>

      <div className="photo-upload-area">
        {!preview ? (
          <label className="upload-zone">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="upload-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-hint">JPG, JPEG or PNG (Max 5MB)</p>
            </div>
          </label>
        ) : (
          <div className="photo-preview">
            <img src={preview} alt="Uploaded" className="preview-image" />
            <div className="preview-actions">
              <label className="preview-btn">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                Replace
              </label>
              <button className="preview-btn preview-btn--remove" onClick={handleRemove}>
                Remove
              </button>
            </div>
          </div>
        )}

        {error && <p className="upload-error">{error}</p>}
      </div>
    </div>
  )
}
