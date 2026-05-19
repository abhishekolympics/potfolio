import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'

function DistortSphere() {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.2
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.3
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial
          color="#00f0ff"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          wireframe={false}
          transparent
          opacity={0.15}
        />
      </mesh>
      <mesh scale={1.85}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial
          color="#915eff"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0}
          metalness={1}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  )
}

function Ring({ rotation = [0, 0, 0], color = '#00f0ff', radius = 2.2, tube = 0.02 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.1 + rotation[0]
    ref.current.rotation.y = clock.getElapsedTime() * 0.15 + rotation[1]
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.6} />
    </mesh>
  )
}

export default function FloatingGeometry() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ height: '100%' }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#915eff" />
        <DistortSphere />
        <Ring rotation={[0.5, 0, 0]} color="#00f0ff" radius={2.5} />
        <Ring rotation={[0, 0.5, 1]} color="#915eff" radius={2.0} />
        <Ring rotation={[1, 0, 0.5]} color="#ff6b9d" radius={3.0} tube={0.015} />
      </Suspense>
    </Canvas>
  )
}
