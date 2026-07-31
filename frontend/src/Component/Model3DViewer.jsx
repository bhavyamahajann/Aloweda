import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import './Model3DViewer.css'

function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath)
  const modelRef = useRef()

  // Auto-rotate animation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3 // Slow rotation
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
  return (
    <div className="model-3d-viewer">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          {/* Lighting - Clean & Simple */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 8, 5]} intensity={1} />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          
          {/* Environment for reflections */}
          <Environment preset="city" />
          
          {/* 3D Model with Auto-rotation */}
          <Model modelPath={modelPath} />
          
          {/* Controls - Interactive */}
          {showControls && (
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              minDistance={6}
              maxDistance={14}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 1.8}
              enableDamping={true}
              dampingFactor={0.05}
              autoRotate={false}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

// Preload the models for better performance
useGLTF.preload('/models/AlowedaAntiAcneFac.glb')
useGLTF.preload('/models/HairTherapySerum.glb')
