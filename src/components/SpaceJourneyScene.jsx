import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export const SECTION_DATA = [
  { z: 0,    color: '#00f0ff', r: 3.0, label: 'Home' },
  { z: -80,  color: '#4a9eff', r: 3.5, label: 'About' },
  { z: -160, color: '#915eff', r: 3.2, label: 'Skills' },
  { z: -240, color: '#00ff87', r: 3.8, label: 'Experience' },
  { z: -320, color: '#ffd700', r: 2.8, label: 'Achievements' },
  { z: -400, color: '#ff6b9d', r: 3.2, label: 'Contact' },
]

// Camera stops: 14 units in front of each planet
const CAM_Z = SECTION_DATA.map(s => s.z + 14)

// ── Stars ────────────────────────────────────────────────────────────────────

function Stars() {
  const tunnelRef = useRef()
  const bgRef = useRef()

  // Stars distributed in a cylinder along the flight path (z: 10 → -430)
  const tunnel = useMemo(() => {
    const n = 7000
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r     = 12 + Math.random() * 90
      const theta = Math.random() * Math.PI * 2
      arr[i * 3]     = Math.cos(theta) * r
      arr[i * 3 + 1] = Math.sin(theta) * r
      arr[i * 3 + 2] = Math.random() * -440
    }
    return arr
  }, [])

  // Distant background sphere stars
  const bg = useMemo(() => {
    const n = 3000
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r     = 160 + Math.random() * 80
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi) - 200
    }
    return arr
  }, [])

  // Mouse parallax (same approach as before)
  const mouseTarget = useRef({ x: 0, y: 0 })
  const mouseOffset = useRef({ x: 0, y: 0 })

  useMemo(() => {
    const onMove = (e) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth - 0.5) * 0.4
      mouseTarget.current.y = (e.clientY / window.innerHeight - 0.5) * 0.25
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((_, delta) => {
    mouseOffset.current.x += (mouseTarget.current.x - mouseOffset.current.x) * 0.04
    mouseOffset.current.y += (mouseTarget.current.y - mouseOffset.current.y) * 0.04

    if (tunnelRef.current) {
      tunnelRef.current.rotation.z += delta * 0.008
    }
    if (bgRef.current) {
      bgRef.current.rotation.x = mouseOffset.current.y
      bgRef.current.rotation.y = mouseOffset.current.x
    }
  })

  return (
    <>
      {/* Tunnel stars — feel like rushing past the camera */}
      <group ref={tunnelRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={tunnel} count={7000} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial color="#ffffff" size={0.25} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
        </points>
      </group>

      {/* Background sphere stars — mouse-reactive */}
      <group ref={bgRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={bg} count={3000} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial color="#99aaff" size={0.5} sizeAttenuation transparent opacity={0.45} depthWrite={false} />
        </points>
      </group>
    </>
  )
}

// ── Planet ───────────────────────────────────────────────────────────────────

function Planet({ data, index, currentSection }) {
  const coreRef = useRef()
  const ringRef = useRef()
  const isActive = currentSection === index

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.1
      coreRef.current.rotation.x = t * 0.06
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.2
    }
  })

  return (
    <group position={[0, 0, data.z]}>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[data.r, 64, 64]} />
        <MeshDistortMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={isActive ? 0.28 : 0.07}
          roughness={0.25}
          metalness={0.75}
          distort={0.28}
          speed={1.5}
        />
      </mesh>

      {/* Atmosphere (backside glow) */}
      <mesh scale={1.18}>
        <sphereGeometry args={[data.r, 32, 32]} />
        <meshStandardMaterial
          color={data.color}
          transparent
          opacity={isActive ? 0.13 : 0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer halo */}
      <mesh scale={1.35}>
        <sphereGeometry args={[data.r, 24, 24]} />
        <meshStandardMaterial
          color={data.color}
          transparent
          opacity={isActive ? 0.05 : 0.01}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Active equatorial ring */}
      {isActive && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[data.r * 1.5, 0.06, 16, 80]} />
          <meshStandardMaterial
            color={data.color}
            emissive={data.color}
            emissiveIntensity={1.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  )
}

// ── Camera rig ───────────────────────────────────────────────────────────────

function CameraRig({ currentSection }) {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const targetZ = CAM_Z[currentSection]
    const dist    = Math.abs(camera.position.z - targetZ)

    // FOV widens while moving fast → gives the "rushing into space" feel
    const targetFov = dist > 8 ? 78 : 60
    camera.fov += (targetFov - camera.fov) * 0.06
    camera.updateProjectionMatrix()

    // Position lerp — faster when far, gentler on approach
    const speed = dist > 30 ? 2.8 : 1.4
    camera.position.z += (targetZ - camera.position.z) * Math.min(delta * speed, 0.12)
    camera.position.x += (0 - camera.position.x) * 0.05
    camera.position.y += (0 - camera.position.y) * 0.05
  })

  return null
}

// ── Lights ───────────────────────────────────────────────────────────────────

function Lights({ currentSection }) {
  return (
    <>
      <ambientLight intensity={0.12} />
      {SECTION_DATA.map((s, i) => (
        <pointLight
          key={i}
          position={[0, 0, s.z]}
          intensity={currentSection === i ? 4 : 0.25}
          color={s.color}
          distance={90}
          decay={2}
        />
      ))}
    </>
  )
}

// ── Export ───────────────────────────────────────────────────────────────────

export default function SpaceJourneyScene({ currentSection }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 14], fov: 60, near: 0.1, far: 1200 }}>
        <Suspense fallback={null}>
          <Stars />
          {SECTION_DATA.map((data, i) => (
            <Planet key={i} data={data} index={i} currentSection={currentSection} />
          ))}
          <Lights currentSection={currentSection} />
          <CameraRig currentSection={currentSection} />
        </Suspense>
      </Canvas>
    </div>
  )
}
