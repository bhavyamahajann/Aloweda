// Minimal Cart Test Component
export default function CartTest() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#faf8f4',
      padding: '100px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#2c2416', 
          fontSize: '2.5rem',
          marginBottom: '20px'
        }}>
          🛒 Cart Test Page
        </h1>
        <p style={{ 
          color: '#6b5f4e',
          fontSize: '1.2rem',
          marginBottom: '30px'
        }}>
          ✅ If you can see this, React is working!
        </p>
        <div style={{
          background: '#f5f0e8',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#2c2416', marginBottom: '10px' }}>Debug Info:</h3>
          <p>• Current Path: {window.location.pathname}</p>
          <p>• Cart page should load here</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            background: 'linear-gradient(135deg, #e8dcc4 0%, #d4c5a9 100%)',
            color: '#2c2416',
            border: 'none',
            padding: '14px 32px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  )
}
