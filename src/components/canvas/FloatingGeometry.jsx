import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function GlowSphere() {
  const meshRef = useRef()
  const wireRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.15
    meshRef.current.rotation.y = t * 0.22
    wireRef.current.rotation.x = -t * 0.1
    wireRef.current.rotation.y = t * 0.18
  })

  return (
    <group>
      {/* Solid inner sphere */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshDistortMaterial
          color="#00f0ff"
          distort={0.35}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* Wireframe outer */}
      <mesh ref={wireRef} scale={1.05}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#915eff"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  )
}

function OrbitParticles({ count = 80, radius = 1.55 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const wobble = (Math.random() - 0.5) * 0.3
      pts[i * 3]     = Math.cos(angle) * radius
      pts[i * 3 + 1] = wobble
      pts[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pts
  }, [count, radius])

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.4
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.3
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#00f0ff" size={0.04} sizeAttenuation transparent opacity={0.9} />
    </points>
  )
}

function OrbitParticles2({ count = 60, radius = 1.3 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const wobble = (Math.random() - 0.5) * 0.25
      pts[i * 3]     = Math.cos(angle) * radius
      pts[i * 3 + 1] = wobble
      pts[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pts
  }, [count, radius])

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.3
    ref.current.rotation.y = -clock.getElapsedTime() * 0.25
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#915eff" size={0.035} sizeAttenuation transparent opacity={0.8} />
    </points>
  )
}

function OrbitParticles3({ count = 50, radius = 1.75 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const wobble = (Math.random() - 0.5) * 0.2
      pts[i * 3]     = Math.cos(angle) * radius
      pts[i * 3 + 1] = wobble
      pts[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pts
  }, [count, radius])

  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.35
    ref.current.rotation.z = clock.getElapsedTime() * 0.15
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ff6b9d" size={0.03} sizeAttenuation transparent opacity={0.7} />
    </points>
  )
}

export default function FloatingGeometry() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ height: '100%' }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-4, -4, -4]} intensity={0.8} color="#915eff" />
        <GlowSphere />
        <OrbitParticles />
        <OrbitParticles2 />
        <OrbitParticles3 />
      </Suspense>
    </Canvas>
  )
}
