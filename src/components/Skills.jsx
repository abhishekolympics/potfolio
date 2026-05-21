import { Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'

const skillGroups = [
  {
    category: 'Backend',
    color: '#00f0ff',
    skills: ['Node.js', 'Express.js', 'NestJS', 'REST APIs', 'GraphQL', 'WebSockets'],
  },
  {
    category: 'Frontend',
    color: '#915eff',
    skills: ['React.js', 'TypeScript', 'Gatsby.js', 'Framer Motion', 'AgGrid', 'Tailwind'],
  },
  {
    category: 'Databases',
    color: '#ff6b9d',
    skills: ['MongoDB', 'SQL', 'Redis', 'Mongoose', 'Prisma'],
  },
  {
    category: 'DevOps & Cloud',
    color: '#ffd700',
    skills: ['AWS Lambda', 'EventBridge', 'Docker', 'CI/CD', 'Git', 'Postman'],
  },
  {
    category: 'Languages',
    color: '#00ff87',
    skills: ['JavaScript', 'TypeScript', 'C++'],
  },
  {
    category: 'AI-Assisted',
    color: '#ff8c00',
    skills: ['Claude Code', 'Cursor', 'Codex', 'LLM integrations', 'Agentic workflows'],
  },
]

function SkillOrb({ position, text, color }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.5
  })

  return (
    <Float speed={2} floatIntensity={0.5}>
      <group position={position} ref={ref}>
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.8}
          />
        </mesh>
        <Text
          position={[0, 0, 0.4]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
        >
          {text}
        </Text>
      </group>
    </Float>
  )
}

function SkillCloud() {
  const allSkills = [
    ['Node.js', '#00f0ff'], ['React', '#915eff'], ['TypeScript', '#ff6b9d'],
    ['MongoDB', '#ffd700'], ['AWS', '#00ff87'], ['Docker', '#ff8c00'],
    ['Express', '#00f0ff'], ['GraphQL', '#915eff'], ['Redis', '#ff6b9d'],
    ['NestJS', '#ffd700'], ['CI/CD', '#00ff87'], ['Git', '#ff8c00'],
  ]

  const positions = allSkills.map((_, i) => {
    const angle = (i / allSkills.length) * Math.PI * 2
    const r = 1.8 + Math.sin(i * 1.3) * 0.3
    const y = Math.sin(i * 0.8) * 0.8
    return [Math.cos(angle) * r, y, Math.sin(angle) * r]
  })

  const groupRef = useRef()
  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.7} color="#915eff" />
      {allSkills.map(([name, color], i) => (
        <SkillOrb key={name} position={positions[i]} text={name} color={color} />
      ))}
    </group>
  )
}

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="skills" className="relative py-24 px-6" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">What I Work With</p>
          <h2 className="text-4xl md:text-5xl font-black">
            Tech <span className="gradient-text">Stack</span>
          </h2>
        </motion.div>

        {/* 3D Skill Cloud */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-80 mb-16 relative"
        >
          <Canvas camera={{ position: [0, 0, 10], fov: 55 }}>
            <Suspense fallback={null}>
              <SkillCloud />
            </Suspense>
          </Canvas>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-primary" />
        </motion.div>

        {/* Skill category cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + gi * 0.08 }}
              className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 skill-card"
              style={{ borderColor: `${group.color}20` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: group.color, boxShadow: `0 0 10px ${group.color}` }}
                />
                <h3 className="font-bold text-white">{group.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 cursor-default"
                    style={{
                      background: `${group.color}10`,
                      border: `1px solid ${group.color}30`,
                      color: group.color,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
