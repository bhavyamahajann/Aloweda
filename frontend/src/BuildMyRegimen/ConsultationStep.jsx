import './StepStyles.css'

export default function ConsultationStep({ data, onChange }) {
  return (
    <div className="step-container">
      <h2 className="step-heading">Tell us about yourself</h2>
      <p className="step-description">Help us personalize your skincare recommendations</p>

      <form className="consultation-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            className="form-input"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age" className="form-label">
            Age (Optional)
          </label>
          <input
            type="number"
            id="age"
            className="form-input"
            value={data.age}
            onChange={(e) => onChange('age', e.target.value)}
            placeholder="Enter your age"
            min="13"
            max="120"
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalConcerns" className="form-label">
            Additional Skin Concerns (Optional)
          </label>
          <textarea
            id="additionalConcerns"
            className="form-textarea"
            value={data.additionalConcerns}
            onChange={(e) => onChange('additionalConcerns', e.target.value)}
            placeholder="Tell us about any other skin concerns..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentRoutine" className="form-label">
            Current Skincare Routine (Optional)
          </label>
          <textarea
            id="currentRoutine"
            className="form-textarea"
            value={data.currentRoutine}
            onChange={(e) => onChange('currentRoutine', e.target.value)}
            placeholder="Describe your current skincare products..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="allergies" className="form-label">
            Product Allergies / Sensitivities (Optional)
          </label>
          <textarea
            id="allergies"
            className="form-textarea"
            value={data.allergies}
            onChange={(e) => onChange('allergies', e.target.value)}
            placeholder="List any known allergies or sensitivities..."
            rows="3"
          />
        </div>

        <div className="form-group form-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.consent}
              onChange={(e) => onChange('consent', e.target.checked)}
              required
            />
            <span>I agree to be contacted regarding my skincare consultation</span>
            <span className="required"> *</span>
          </label>
        </div>
      </form>
    </div>
  )
}
