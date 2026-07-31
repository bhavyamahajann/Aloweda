import { Suspense, useRef, useState } from 'react'
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

      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        onPointerDown={() => setIsInteracting(true)}
        onPointerUp={() => setIsInteracting(false)}
      >
        <Suspense fallback={null}>
          {/* Premium studio lighting setup */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.6} />
          <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffeedd" />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
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

// Preload the models for better performance
useGLTF.preload('/models/AlowedaAntiAcneFac.glb')
useGLTF.preload('/models/HairTherapySerum.glb')
useGLTF.preload('/models/AlowvedaSmoothPerfe.glb')
