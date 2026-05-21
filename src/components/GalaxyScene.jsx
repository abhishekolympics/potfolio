import { useRef, Suspense, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const PLANET_TEXTURES = {
  earth: '/textures/planets/earth.jpg',
  venus: '/textures/planets/venus.jpg',
  mars: '/textures/planets/mars.jpg',
  jupiter: '/textures/planets/jupiter.jpg',
  saturn: '/textures/planets/saturn.jpg',
  neptune: '/textures/planets/neptune.jpg',
}

const SATURN_RING_TEXTURE = '/textures/planets/saturn-ring.png'

// Content side describes the overlay. The planet is placed on the opposite side.
// The x/y/z positions are intentionally scattered, so navigation feels like
// steering through a solar-system map rather than travelling down a hallway.
export const SECTION_DATA = [
  { z: 0,    x: -8.4, y: 2.0,  color: '#6bd8ff', r: 2.95, label: 'ABHISHEK',     side: 'right', tex: 'earth'   },
  { z: -95,  x: 8.0,  y: -2.2, color: '#73a7ff', r: 3.15, label: 'ABOUT',        side: 'left',  tex: 'neptune' },
  { z: -205, x: -7.5, y: -2.8, color: '#ff9a5f', r: 2.85, label: 'SKILLS',       side: 'right', tex: 'mars'    },
  { z: -330, x: 8.8,  y: 2.4,  color: '#ffd08a', r: 3.65, label: 'EXPERIENCE',   side: 'left',  tex: 'saturn', ring: true },
  { z: -465, x: -8.2, y: 1.3,  color: '#ffc267', r: 3.35, label: 'ACHIEVEMENTS', side: 'right', tex: 'jupiter' },
  { z: -610, x: 7.8,  y: -1.8, color: '#ffc99a', r: 3.05, label: 'CONTACT',      side: 'left',  tex: 'venus'   },
]

const CAM_STOPS = SECTION_DATA.map((s, i) => {
  const prev = SECTION_DATA[Math.max(0, i - 1)]
  const lateralDrift = (s.x - prev.x) * 0.2
  return {
    x: s.x * 0.42 - lateralDrift,
    y: s.y * 0.55 + (i % 2 === 0 ? 0.7 : -0.7),
    z: s.z + 13,
  }
})

const STAR_COLORS = [
  [0.55, 0.66, 1.00],
  [0.76, 0.86, 1.00],
  [1.00, 1.00, 0.94],
  [1.00, 0.91, 0.62],
  [1.00, 0.68, 0.38],
  [1.00, 0.43, 0.28],
]

let dotTexture = null
function getDotTexture() {
  if (dotTexture) return dotTexture
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.38, 'rgba(255,255,255,0.78)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  dotTexture = new THREE.CanvasTexture(canvas)
  dotTexture.colorSpace = THREE.SRGBColorSpace
  return dotTexture
}

function Stars() {
  const tunnelRef = useRef()
  const bgRef = useRef()
  const bgMatRef = useRef()
  const mouseTarget = useRef({ x: 0, y: 0 })
  const mouseOffset = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)

  const tunnel = useMemo(() => {
    const count = 11000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const radius = 14 + Math.random() * 120
      const angle = Math.random() * Math.PI * 2
      const depth = -(Math.random() * 700)

      positions[i * 3] = Math.cos(angle) * radius + Math.sin(depth * 0.015) * 8
      positions[i * 3 + 1] = Math.sin(angle) * radius + Math.cos(depth * 0.011) * 6
      positions[i * 3 + 2] = depth

      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
      colors[i * 3] = color[0]
      colors[i * 3 + 1] = color[1]
      colors[i * 3 + 2] = color[2]
    }

    return { positions, colors, count }
  }, [])

  const background = useMemo(() => {
    const count = 5500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const radius = 230 + Math.random() * 130
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi) - 320

      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
      colors[i * 3] = color[0]
      colors[i * 3 + 1] = color[1]
      colors[i * 3 + 2] = color[2]
    }

    return { positions, colors, count }
  }, [])

  useEffect(() => {
    const onMouseMove = (event) => {
      mouseTarget.current.x = (event.clientX / window.innerWidth - 0.5) * 0.7
      mouseTarget.current.y = (event.clientY / window.innerHeight - 0.5) * 0.45
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame((_, delta) => {
    mouseOffset.current.x += (mouseTarget.current.x - mouseOffset.current.x) * 0.045
    mouseOffset.current.y += (mouseTarget.current.y - mouseOffset.current.y) * 0.045
    timeRef.current += delta

    if (tunnelRef.current) {
      tunnelRef.current.rotation.z += delta * 0.006
      tunnelRef.current.rotation.x = Math.sin(timeRef.current * 0.08) * 0.035
    }

    if (bgRef.current) {
      bgRef.current.rotation.x = mouseOffset.current.y
      bgRef.current.rotation.y = mouseOffset.current.x
    }

    if (bgMatRef.current) {
      bgMatRef.current.opacity = 0.36 + Math.sin(timeRef.current * 0.35) * 0.08
    }
  })

  const dotMap = useMemo(() => getDotTexture(), [])

  return (
    <>
      <group ref={tunnelRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={tunnel.positions} count={tunnel.count} itemSize={3} />
            <bufferAttribute attach="attributes-color" array={tunnel.colors} count={tunnel.count} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial
            size={0.25}
            sizeAttenuation
            transparent
            opacity={0.9}
            depthWrite={false}
            vertexColors
            map={dotMap}
            alphaTest={0.02}
          />
        </points>
      </group>

      <group ref={bgRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={background.positions} count={background.count} itemSize={3} />
            <bufferAttribute attach="attributes-color" array={background.colors} count={background.count} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial
            ref={bgMatRef}
            size={0.8}
            sizeAttenuation
            transparent
            opacity={0.42}
            depthWrite={false}
            vertexColors
            map={dotMap}
            alphaTest={0.02}
          />
        </points>
      </group>
    </>
  )
}

function PlanetLabel({ data, isActive }) {
  return (
    <Html center position={[0, 0, data.r * 0.08]} zIndexRange={[15, 0]} style={{ pointerEvents: 'none', userSelect: 'none' }}>
      <div
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'scale(1)' : 'scale(0.45)',
          transition: isActive
            ? 'opacity 0.5s 0.78s, transform 0.55s 0.78s cubic-bezier(0.34,1.56,0.64,1)'
            : 'opacity 0.16s, transform 0.16s',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            fontFamily: '"Orbitron", monospace',
            fontSize: data.label.length > 9 ? '2.15rem' : '2.75rem',
            fontWeight: 900,
            letterSpacing: '0.16em',
            color: data.color,
            textShadow: `0 0 14px #020611, 0 0 28px ${data.color}, 0 0 78px ${data.color}95`,
          }}
        >
          {data.label}
        </div>
        {data.label === 'ABHISHEK' && (
          <div
            style={{
              fontFamily: '"Exo 2", sans-serif',
              fontSize: '0.86rem',
              fontWeight: 700,
              letterSpacing: '0.32em',
              color: `${data.color}cc`,
              marginTop: '5px',
              textShadow: `0 0 12px #020611, 0 0 18px ${data.color}`,
            }}
          >
            FULL STACK ENGINEER
          </div>
        )}
      </div>
    </Html>
  )
}

function SaturnRing({ radius, isActive }) {
  const ringTexture = useTexture(SATURN_RING_TEXTURE)

  useEffect(() => {
    ringTexture.colorSpace = THREE.SRGBColorSpace
    ringTexture.anisotropy = 8
  }, [ringTexture])

  return (
    <mesh rotation={[Math.PI / 2.25, 0.08, -0.24]}>
      <ringGeometry args={[radius * 1.28, radius * 2.05, 128]} />
      <meshStandardMaterial
        map={ringTexture}
        transparent
        opacity={isActive ? 0.95 : 0.45}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function Planet({ data, isActive }) {
  const coreRef = useRef()
  const glowRef = useRef()
  const texture = useTexture(PLANET_TEXTURES[data.tex])

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  }, [texture])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.045
      coreRef.current.rotation.x = Math.sin(time * 0.18) * 0.018
    }
    if (glowRef.current) {
      const pulse = isActive ? 1 + Math.sin(time * 1.8) * 0.03 : 1
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group position={[data.x, data.y, data.z]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[data.r, 96, 96]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.78}
          metalness={0}
          emissive={data.color}
          emissiveIntensity={isActive ? 0.055 : 0.012}
        />
      </mesh>

      {data.ring && <SaturnRing radius={data.r} isActive={isActive} />}

      <mesh ref={glowRef} scale={1.18}>
        <sphereGeometry args={[data.r, 48, 48]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={isActive ? 0.16 : 0.035}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.6}>
        <sphereGeometry args={[data.r, 32, 32]} />
        <meshBasicMaterial
          color={data.color}
          transparent
          opacity={isActive ? 0.045 : 0.008}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <PlanetLabel data={data} isActive={isActive} />
    </group>
  )
}

function CameraRig({ currentSection }) {
  const { camera } = useThree()
  const lookAt = useRef(new THREE.Vector3())
  const target = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const planet = SECTION_DATA[currentSection]
    const stop = CAM_STOPS[currentSection]
    const distance = Math.abs(camera.position.z - stop.z)
    const travel = Math.min(delta * (distance > 35 ? 2.7 : 1.45), 0.12)

    camera.position.x += (stop.x - camera.position.x) * travel
    camera.position.y += (stop.y - camera.position.y) * travel
    camera.position.z += (stop.z - camera.position.z) * travel

    // Look slightly inward from the planet rather than directly at it. This keeps
    // the planet on its side of the screen while still making the trip feel steered.
    target.current.set(planet.x * 0.38, planet.y * 0.34, planet.z - 20)
    lookAt.current.lerp(target.current, Math.min(delta * 1.8, 0.12))
    camera.lookAt(lookAt.current)

    const targetFov = distance > 8 ? 84 : 58
    camera.fov += (targetFov - camera.fov) * 0.055
    camera.updateProjectionMatrix()
  })

  return null
}

function Lights({ currentSection }) {
  const active = SECTION_DATA[currentSection]

  return (
    <>
      <ambientLight intensity={0.23} />
      <directionalLight position={[active.x > 0 ? -18 : 18, 12, active.z + 35]} intensity={1.5} color="#ffffff" />
      {SECTION_DATA.map((section, index) => (
        <pointLight
          key={section.label}
          position={[section.x, section.y, section.z + 6]}
          intensity={currentSection === index ? 6.2 : 0.12}
          color={section.color}
          distance={105}
          decay={2}
        />
      ))}
    </>
  )
}

export default function GalaxyScene({ currentSection }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 14], fov: 58, near: 0.1, far: 1400 }} dpr={[1, 1.75]}>
        <Suspense fallback={null}>
          <Stars />
          {SECTION_DATA.map((data, index) => (
            <Planet key={data.label} data={data} isActive={currentSection === index} />
          ))}
          <Lights currentSection={currentSection} />
          <CameraRig currentSection={currentSection} />
        </Suspense>
      </Canvas>
    </div>
  )
}
