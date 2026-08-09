import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import './Model3DViewer.css'

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef()

  // Auto-rotate animation - smooth and elegant
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.25 // Slower, more elegant rotation
      // Subtle floating animation
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      scale={1.8} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]} 
    />
  )
}

export default function Model3DViewer({ modelPath, showControls = true }) {
  const [isInteracting, setIsInteracting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  // Track loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + 10
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="model-3d-viewer">
      {/* Premium gradient background layers */}
      <div className="model-bg-layer model-bg-layer-1"></div>
      <div className="model-bg-layer model-bg-layer-2"></div>
      <div className="model-bg-layer model-bg-layer-3"></div>
      
      {/* Animated particles */}
      <div className="model-particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Loading spinner with progress */}
      {loading && (
        <div className="model-loading-overlay">
          <div className="model-spinner"></div>
          <p>Loading 3D Model...</p>
          <div className="loading-progress-bar">
            <div className="loading-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="loading-percentage">{progress}%</p>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          precision: 'highp',
          stencil: false,
          depth: true
        }}
        dpr={[1, 1.5]} // Reduced for faster loading
        performance={{ min: 0.5 }}
        shadows={false} // Disable shadows for performance
        onPointerDown={() => setIsInteracting(true)}
        onPointerUp={() => setIsInteracting(false)}
        onCreated={() => {
          setLoading(false)
          setProgress(100)
        }}
      >
        <Suspense fallback={null}>
          {/* Premium studio lighting setup */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} />
          <directionalLight position={[-5, 5, -5]} intensity={0.6} />
          <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffeedd" />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
          />
          
          {/* Premium environment with soft reflections */}
          <Environment preset="sunset" />
          
          {/* Soft contact shadows for depth */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.3}
            scale={10}
            blur={2}
            far={4}
          />
          
          {/* 3D Model with elegant animations */}
          <Model modelPath={modelPath} />
          
          {/* Premium camera with smooth controls */}
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
          
          {/* Interactive controls */}
          {showControls && (
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              minDistance={5}
              maxDistance={15}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.8}
              enableDamping={true}
              dampingFactor={0.08}
              autoRotate={false}
              rotateSpeed={0.5}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Interactive hint with icon */}
      <div className={`viewer-hint ${isInteracting ? 'hint-hidden' : ''}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}

// DON'T preload all models - only preload on demand to save bandwidth
// Models will be loaded when needed
