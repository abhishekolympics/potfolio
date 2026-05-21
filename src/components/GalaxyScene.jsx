import { useRef, Suspense, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// Planets zigzag in x/y so camera steers left-right-left during travel
// side:'right' → content on right → planet further LEFT (negative x)
// side:'left'  → content on left  → planet further RIGHT (positive x)
export const SECTION_DATA = [
  { z: 0,    x: -6.0, y: 1.5,  color: '#00f0ff', r: 2.8, label: 'ABHISHEK',     side: 'right', tex: 'earth'   },
  { z: -90,  x: 6.0,  y: -2.0, color: '#4a9eff', r: 3.2, label: 'ABOUT',        side: 'left',  tex: 'neptune'  },
  { z: -180, x: -6.0, y: 2.5,  color: '#915eff', r: 3.0, label: 'SKILLS',       side: 'right', tex: 'purple'   },
  { z: -270, x: 6.0,  y: -2.5, color: '#00ff87', r: 3.4, label: 'EXPERIENCE',   side: 'left',  tex: 'alien'    },
  { z: -360, x: -6.0, y: 1.5,  color: '#ffd700', r: 2.8, label: 'ACHIEVEMENTS', side: 'right', tex: 'jupiter'  },
  { z: -450, x: 6.0,  y: -1.0, color: '#ff6b9d', r: 3.0, label: 'CONTACT',      side: 'left',  tex: 'candy'    },
]

// Camera rests slightly toward planet to maintain off-center composition
const CAM_STOPS = SECTION_DATA.map(s => ({
  x: s.x * 0.32,
  y: s.y * 0.4,
  z: s.z + 8,
}))

// ── Round star dot texture ────────────────────────────────────────────────────

let _dotTex = null
function getDotTexture() {
  if (_dotTex) return _dotTex
  const size = 64
  const cv = document.createElement('canvas')
  cv.width = cv.height = size
  const c = cv.getContext('2d')
  const g = c.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  g.addColorStop(0,   'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.7)')
  g.addColorStop(1,   'rgba(255,255,255,0)')
  c.fillStyle = g
  c.fillRect(0, 0, size, size)
  return (_dotTex = new THREE.CanvasTexture(cv))
}

// Realistic stellar spectral colors
const STAR_COLORS = [
  [0.55, 0.65, 1.00], // O/B blue-white
  [0.80, 0.88, 1.00], // A white
  [1.00, 1.00, 0.92], // F yellow-white
  [1.00, 0.94, 0.70], // G yellow (sun-like)
  [1.00, 0.78, 0.48], // K orange
  [1.00, 0.52, 0.30], // M orange-red
]

// ── Procedural planet texture generator ──────────────────────────────────────

const _texCache = {}

function makePlanetTexture(type) {
  if (_texCache[type]) return _texCache[type]
  const S = 256
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const x = cv.getContext('2d')

  if (type === 'earth') {
    x.fillStyle = '#1B4F8A'
    x.fillRect(0, 0, S, S)
    // Continents
    ;[
      [0.5, 0.42, 0.22, 0.18, 0.3],
      [0.3, 0.47, 0.12, 0.15, -0.2],
      [0.5, 0.65, 0.13, 0.12, 0.1],
      [0.82, 0.56, 0.1, 0.12, 0.5],
      [0.12, 0.38, 0.08, 0.1, -0.4],
    ].forEach(([cx, cy, rx, ry, rot]) => {
      const g = x.createRadialGradient(cx*S, cy*S, 0, cx*S, cy*S, rx*S)
      g.addColorStop(0, '#4CAF50'); g.addColorStop(0.55, '#2E7D32'); g.addColorStop(1, 'transparent')
      x.save(); x.translate(cx*S, cy*S); x.rotate(rot); x.scale(1, ry/rx)
      x.beginPath(); x.arc(0, 0, rx*S, 0, Math.PI*2); x.fillStyle = g; x.fill(); x.restore()
    })
    // Clouds
    for (let i = 0; i < 10; i++) {
      const cx = (i*0.1+0.03)*S, cy = (0.2+i*0.07)*S
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, 0.07*S)
      g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'transparent')
      x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, 0.1*S, 0.04*S, i*0.4, 0, Math.PI*2); x.fill()
    }
    // Ice caps
    const tc = x.createLinearGradient(0, 0, 0, S*0.11)
    tc.addColorStop(0, '#DFF0FF'); tc.addColorStop(1, 'transparent')
    x.fillStyle = tc; x.fillRect(0, 0, S, S*0.11)
    const bc = x.createLinearGradient(0, S, 0, S*0.89)
    bc.addColorStop(0, '#DFF0FF'); bc.addColorStop(1, 'transparent')
    x.fillStyle = bc; x.fillRect(0, S*0.89, S, S*0.11)
  }

  else if (type === 'neptune') {
    x.fillStyle = '#0D1B7A'
    x.fillRect(0, 0, S, S)
    for (let i = 0; i < 7; i++) {
      const y = (i/7)*S
      const g = x.createLinearGradient(0, y, 0, y+S/8)
      g.addColorStop(0, 'rgba(80,110,220,0.25)'); g.addColorStop(0.5, 'rgba(130,170,255,0.4)'); g.addColorStop(1, 'rgba(60,90,200,0.1)')
      x.fillStyle = g; x.fillRect(0, y, S, S/8)
    }
    for (let i = 0; i < 5; i++) {
      const sx = (0.12+i*0.2)*S, sy = (0.25+i*0.15)*S
      const g = x.createRadialGradient(sx, sy, 0, sx, sy, 0.07*S)
      g.addColorStop(0, 'rgba(190,215,255,0.55)'); g.addColorStop(1, 'transparent')
      x.fillStyle = g; x.beginPath(); x.ellipse(sx, sy, 0.1*S, 0.04*S, i*0.4, 0, Math.PI*2); x.fill()
    }
  }

  else if (type === 'purple') {
    x.fillStyle = '#1E0540'
    x.fillRect(0, 0, S, S)
    for (let i = 0; i < 9; i++) {
      const y = (i/9)*S
      const g = x.createLinearGradient(0, y, 0, y+S/10)
      g.addColorStop(0, 'rgba(130,60,220,0.25)'); g.addColorStop(0.5, 'rgba(170,90,255,0.4)'); g.addColorStop(1, 'rgba(90,30,180,0.1)')
      x.fillStyle = g; x.fillRect(0, y, S, S/10)
    }
    for (let i = 0; i < 6; i++) {
      const px = (0.1+i*0.18)*S, py = ((i*0.17+0.1)%1)*S
      const g = x.createRadialGradient(px, py, 0, px, py, 0.09*S)
      g.addColorStop(0, 'rgba(210,150,255,0.6)'); g.addColorStop(1, 'transparent')
      x.fillStyle = g; x.beginPath(); x.arc(px, py, 0.09*S, 0, Math.PI*2); x.fill()
    }
  }

  else if (type === 'alien') {
    x.fillStyle = '#071A07'
    x.fillRect(0, 0, S, S)
    for (let i = 0; i < 7; i++) {
      const y = (i/7)*S
      const g = x.createLinearGradient(0, y, 0, y+S/8)
      g.addColorStop(0, 'rgba(0,160,50,0.2)'); g.addColorStop(0.5, 'rgba(20,220,70,0.38)'); g.addColorStop(1, 'rgba(0,130,40,0.1)')
      x.fillStyle = g; x.fillRect(0, y, S, S/8)
    }
    for (let i = 0; i < 7; i++) {
      const px = (0.08+i*0.14)*S, py = ((i*0.15+0.15)%1)*S
      const g = x.createRadialGradient(px, py, 0, px, py, 0.07*S)
      g.addColorStop(0, 'rgba(80,255,120,0.65)'); g.addColorStop(1, 'transparent')
      x.fillStyle = g; x.beginPath(); x.arc(px, py, 0.07*S, 0, Math.PI*2); x.fill()
    }
  }

  else if (type === 'jupiter') {
    x.fillStyle = '#C89A4A'
    x.fillRect(0, 0, S, S)
    ;[
      [0.05, 0.05, '#7A4020'], [0.15, 0.04, '#B07030'],
      [0.26, 0.06, '#6A3818'], [0.38, 0.05, '#A86828'],
      [0.5,  0.07, '#7A4020'], [0.62, 0.05, '#B07030'],
      [0.73, 0.06, '#6A3818'], [0.85, 0.05, '#A86828'],
      [0.95, 0.04, '#7A4020'],
    ].forEach(([cy, hw, col]) => {
      const g = x.createLinearGradient(0, (cy-hw)*S, 0, (cy+hw)*S)
      g.addColorStop(0, 'transparent'); g.addColorStop(0.5, col+'DD'); g.addColorStop(1, 'transparent')
      x.fillStyle = g; x.fillRect(0, (cy-hw)*S, S, hw*2*S)
    })
    const grs = x.createRadialGradient(0.6*S, 0.55*S, 0, 0.6*S, 0.55*S, 0.11*S)
    grs.addColorStop(0, 'rgba(190,55,15,0.95)'); grs.addColorStop(0.5, 'rgba(160,35,5,0.7)'); grs.addColorStop(1, 'transparent')
    x.fillStyle = grs; x.beginPath(); x.ellipse(0.6*S, 0.55*S, 0.13*S, 0.07*S, 0, 0, Math.PI*2); x.fill()
  }

  else if (type === 'candy') {
    x.fillStyle = '#5A0830'
    x.fillRect(0, 0, S, S)
    for (let i = 0; i < 9; i++) {
      const y = (i/9)*S
      const g = x.createLinearGradient(0, y, 0, y+S/10)
      g.addColorStop(0, 'rgba(255,80,150,0.28)'); g.addColorStop(0.5, 'rgba(255,140,190,0.45)'); g.addColorStop(1, 'rgba(200,40,110,0.1)')
      x.fillStyle = g; x.fillRect(0, y, S, S/10)
    }
    for (let i = 0; i < 9; i++) {
      const px = (i*0.11+0.04)*S, py = ((i*0.18+0.08)%1)*S
      const g = x.createRadialGradient(px, py, 0, px, py, 0.065*S)
      g.addColorStop(0, 'rgba(255,200,225,0.75)'); g.addColorStop(1, 'transparent')
      x.fillStyle = g; x.beginPath(); x.arc(px, py, 0.065*S, 0, Math.PI*2); x.fill()
    }
  }

  const tex = new THREE.CanvasTexture(cv)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  _texCache[type] = tex
  return tex
}

// ── Stars ──────────────────────────────────────────────────────────────────────

function Stars() {
  const tunnelRef = useRef()
  const bgRef     = useRef()
  const bgMatRef  = useRef()
  const mTarget   = useRef({ x: 0, y: 0 })
  const mOffset   = useRef({ x: 0, y: 0 })
  const timeRef   = useRef(0)

  const tunnel = useMemo(() => {
    const n = 9000, arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 12 + Math.random() * 90
      const t = Math.random() * Math.PI * 2
      arr[i*3]   = Math.cos(t) * r
      arr[i*3+1] = Math.sin(t) * r
      arr[i*3+2] = -(Math.random() * 500)
    }
    return arr
  }, [])

  const { bgPos, bgCol } = useMemo(() => {
    const n = 4000
    const bgPos = new Float32Array(n * 3)
    const bgCol = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 170 + Math.random() * 80
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      bgPos[i*3]   = r * Math.sin(p) * Math.cos(t)
      bgPos[i*3+1] = r * Math.sin(p) * Math.sin(t)
      bgPos[i*3+2] = r * Math.cos(p) - 230
      const c = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]
      bgCol[i*3] = c[0]; bgCol[i*3+1] = c[1]; bgCol[i*3+2] = c[2]
    }
    return { bgPos, bgCol }
  }, [])

  useEffect(() => {
    const fn = e => {
      mTarget.current.x = (e.clientX / window.innerWidth  - 0.5) * 0.6
      mTarget.current.y = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  useFrame((_, delta) => {
    mOffset.current.x += (mTarget.current.x - mOffset.current.x) * 0.04
    mOffset.current.y += (mTarget.current.y - mOffset.current.y) * 0.04
    if (tunnelRef.current) tunnelRef.current.rotation.z += delta * 0.004
    if (bgRef.current) {
      bgRef.current.rotation.x = mOffset.current.y
      bgRef.current.rotation.y = mOffset.current.x
    }
    timeRef.current += delta
    if (bgMatRef.current) bgMatRef.current.opacity = 0.38 + Math.sin(timeRef.current * 0.35) * 0.09
  })

  const dotTex = useMemo(() => getDotTexture(), [])

  return (
    <>
      <group ref={tunnelRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={tunnel} count={9000} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial
            color="#ffffff" size={0.22} sizeAttenuation
            transparent opacity={0.85} depthWrite={false}
            map={dotTex} alphaTest={0.01}
          />
        </points>
      </group>
      <group ref={bgRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" array={bgPos} count={4000} itemSize={3} />
            <bufferAttribute attach="attributes-color"    array={bgCol} count={4000} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial
            ref={bgMatRef}
            size={0.7} sizeAttenuation
            transparent opacity={0.4} depthWrite={false}
            vertexColors map={dotTex} alphaTest={0.01}
          />
        </points>
      </group>
    </>
  )
}

// ── Planet ──────────────────────────────────────────────────────────────────────

function Planet({ data, isActive }) {
  const coreRef = useRef()
  const atmRef  = useRef()
  const tex     = useMemo(() => makePlanetTexture(data.tex), [data.tex])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (coreRef.current) coreRef.current.rotation.y = t * 0.055
    if (atmRef.current) {
      atmRef.current.rotation.y = -t * 0.03
      atmRef.current.rotation.x =  t * 0.02
    }
  })

  return (
    <group position={[data.x, data.y, data.z]}>
      {/* Main textured sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[data.r, 64, 64]} />
        <meshStandardMaterial
          map={tex}
          roughness={0.85}
          metalness={0.0}
          emissive={data.color}
          emissiveIntensity={isActive ? 0.1 : 0.02}
        />
      </mesh>
      {/* Transparent cloud / shimmer layer */}
      <mesh ref={atmRef} scale={1.022}>
        <sphereGeometry args={[data.r, 32, 32]} />
        <meshStandardMaterial
          color={data.color} transparent
          opacity={isActive ? 0.09 : 0.02}
          depthWrite={false} roughness={1}
        />
      </mesh>
      {/* Inner atmosphere glow */}
      <mesh scale={1.16}>
        <sphereGeometry args={[data.r, 32, 32]} />
        <meshStandardMaterial
          color={data.color} transparent
          opacity={isActive ? 0.13 : 0.03}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Outer halo */}
      <mesh scale={1.55}>
        <sphereGeometry args={[data.r, 24, 24]} />
        <meshStandardMaterial
          color={data.color} transparent
          opacity={isActive ? 0.045 : 0.008}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Label anchored in 3D — always sits at planet center on screen */}
      <Html
        center
        position={[0, 0, 0]}
        zIndexRange={[15, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.4) translateY(10px)',
            transition: isActive
              ? 'opacity 0.55s 0.88s, transform 0.55s 0.88s cubic-bezier(0.34,1.56,0.64,1)'
              : 'opacity 0.18s, transform 0.18s',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              fontFamily: '"Orbitron", monospace',
              fontSize: '2.6rem',
              fontWeight: 900,
              letterSpacing: '0.16em',
              color: data.color,
              textShadow: `0 0 18px ${data.color}, 0 0 50px ${data.color}90, 0 0 90px ${data.color}50`,
            }}
          >
            {data.label}
          </div>
          {data.label === 'ABHISHEK' && (
            <div
              style={{
                fontFamily: '"Exo 2", sans-serif',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.35em',
                color: `${data.color}90`,
                marginTop: '4px',
                textShadow: `0 0 12px ${data.color}80`,
              }}
            >
              FULL STACK ENGINEER
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

// ── Camera rig — lerps x, y, z creating genuine steering sensation ─────────────

function CameraRig({ currentSection }) {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const stop  = CAM_STOPS[currentSection]
    const dz    = Math.abs(camera.position.z - stop.z)
    const speed = dz > 20 ? 3.0 : 1.5

    const targetFov = dz > 5 ? 85 : 60
    camera.fov += (targetFov - camera.fov) * 0.05
    camera.updateProjectionMatrix()

    camera.position.z += (stop.z - camera.position.z) * Math.min(delta * speed, 0.12)
    camera.position.x += (stop.x - camera.position.x) * Math.min(delta * 1.8, 0.1)
    camera.position.y += (stop.y - camera.position.y) * Math.min(delta * 1.8, 0.1)
  })
  return null
}

// ── Lights ──────────────────────────────────────────────────────────────────────

function Lights({ currentSection }) {
  return (
    <>
      <ambientLight intensity={0.18} />
      {SECTION_DATA.map((s, i) => (
        <pointLight
          key={i}
          position={[s.x, s.y, s.z]}
          intensity={currentSection === i ? 5.5 : 0.15}
          color={s.color}
          distance={90}
          decay={2}
        />
      ))}
    </>
  )
}

// ── Export ──────────────────────────────────────────────────────────────────────

export default function GalaxyScene({ currentSection }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 1200 }}>
        <Suspense fallback={null}>
          <Stars />
          {SECTION_DATA.map((data, i) => (
            <Planet key={i} data={data} isActive={currentSection === i} />
          ))}
          <Lights currentSection={currentSection} />
          <CameraRig currentSection={currentSection} />
        </Suspense>
      </Canvas>
    </div>
  )
}
