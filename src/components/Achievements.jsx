import { Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { Trophy, Medal, Star, Code } from 'lucide-react'

const achievements = [
  {
    icon: Trophy,
    title: 'Google CodeJam',
    subtitle: 'Qualified for Round 2',
    desc: 'Competed against thousands of the world\'s best programmers, advancing through Round 1 to reach Round 2.',
    color: '#ffd700',
    glow: '#ffd70050',
    link: '#',
  },
  {
    icon: Medal,
    title: 'CodeChef Starters',
    subtitle: 'Rank 212 / 11,540',
    desc: 'Achieved top 2% ranking among 11,540 participants in a competitive programming contest.',
    color: '#00f0ff',
    glow: '#00f0ff50',
  },
  {
    icon: Star,
    title: 'ICPC 2023 Asia',
    subtitle: 'Regional Participation',
    desc: 'Participated in the ACM International Collegiate Programming Contest, one of the oldest and most prestigious programming competitions.',
    color: '#915eff',
    glow: '#915eff50',
    link: '#',
  },
  {
    icon: Code,
    title: 'Google KickStart & Facebook HackerCup',
    subtitle: 'Global Competitions',
    desc: 'Competed in two of the world\'s most prestigious coding competitions organized by Google and Meta.',
    color: '#ff6b9d',
    glow: '#ff6b9d50',
  },
]

function SpinningTrophy() {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.5
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
  })

  return (
    <Float speed={1.5} floatIntensity={0.3}>
      <group ref={ref}>
        <mesh>
          <octahedronGeometry args={[0.9, 0]} />
          <MeshDistortMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={0.3}
            roughness={0}
            metalness={1}
            distort={0.2}
            speed={2}
          />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.4, Math.sin(i * 0.7) * 0.4, Math.sin(angle) * 1.4]}
              scale={0.12}
            >
              <sphereGeometry />
              <meshStandardMaterial
                color={['#00f0ff', '#915eff', '#ff6b9d', '#ffd700'][i % 4]}
                emissive={['#00f0ff', '#915eff', '#ff6b9d', '#ffd700'][i % 4]}
                emissiveIntensity={1}
              />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

export default function Achievements() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="achievements" className="relative py-24 px-6" ref={ref}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[400px] rounded-full bg-yellow-500/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-3">Recognition</p>
          <h2 className="text-4xl md:text-5xl font-black">
            <span className="gradient-text">Achievements</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left cards */}
          <div className="space-y-5">
            {achievements.slice(0, 2).map((a, i) => (
              <AchievementCard key={a.title} a={a} i={i} inView={inView} dir="left" />
            ))}
          </div>

          {/* Center 3D */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="h-72 hidden lg:block"
          >
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffd700" />
                <pointLight position={[-5, -5, 5]} intensity={0.8} color="#00f0ff" />
                <SpinningTrophy />
              </Suspense>
            </Canvas>
          </motion.div>

          {/* Right cards */}
          <div className="space-y-5">
            {achievements.slice(2).map((a, i) => (
              <AchievementCard key={a.title} a={a} i={i + 2} inView={inView} dir="right" />
            ))}
          </div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-300">Education</h3>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              {
                degree: 'Master of Computer Applications',
                institution: 'Lovely Professional University (LPU)',
                period: 'Oct 2021 – May 2023',
                color: '#00f0ff',
              },
              {
                degree: 'Bachelor of Computer Applications',
                institution: 'UIET, CSJMU Kanpur',
                period: 'Aug 2017 – Nov 2020',
                color: '#915eff',
              },
            ].map((edu) => (
              <div
                key={edu.degree}
                className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
                style={{ borderColor: `${edu.color}20` }}
              >
                <div
                  className="text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: edu.color }}
                >
                  {edu.period}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{edu.degree}</h4>
                <p className="text-gray-400 text-sm">{edu.institution}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function AchievementCard({ a, i, inView, dir }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: dir === 'left' ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
      className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group cursor-default"
      style={{ borderColor: `${a.color}20` }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${a.color}15`,
            border: `1px solid ${a.color}30`,
            boxShadow: `0 0 15px ${a.glow}`,
          }}
        >
          <a.icon size={22} style={{ color: a.color }} />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-white text-sm mb-0.5 leading-tight">{a.title}</h3>
          <p className="text-xs font-semibold mb-2" style={{ color: a.color }}>{a.subtitle}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{a.desc}</p>
        </div>
      </div>
    </motion.div>
  )
}
