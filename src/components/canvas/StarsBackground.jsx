import { useRef, Suspense, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

function StarField() {
  const ref = useRef()
  const sphere = useMemo(
    () => random.inSphere(new Float32Array(5000 * 3), { radius: 1.5 }),
    []
  )

  // Accumulated auto-rotation
  const autoRot = useRef({ x: 0, y: 0 })
  // Current smoothed mouse offset
  const mouseOffset = useRef({ x: 0, y: 0 })
  // Raw mouse target
  const mouseTarget = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      // Normalize to -0.5 .. 0.5 then scale
      mouseTarget.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6
      mouseTarget.current.y = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state, delta) => {
    // Base slow drift
    autoRot.current.x -= delta / 20
    autoRot.current.y -= delta / 30

    // Smoothly lerp mouse offset (easing factor 0.04 = gentle lag)
    mouseOffset.current.x += (mouseTarget.current.x - mouseOffset.current.x) * 0.04
    mouseOffset.current.y += (mouseTarget.current.y - mouseOffset.current.y) * 0.04

    // Combine: auto-drift + mouse parallax
    ref.current.rotation.x = autoRot.current.x + mouseOffset.current.y
    ref.current.rotation.y = autoRot.current.y + mouseOffset.current.x
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

export default function StarsBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
      </Canvas>
    </div>
  )
}
