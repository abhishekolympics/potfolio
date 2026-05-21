import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Code2, Server, Cloud, Cpu } from 'lucide-react'

const stats = [
  { value: '3+', label: 'Years Experience' },
  { value: '2', label: 'Companies' },
  { value: '35%', label: 'Defect Reduction' },
  { value: '50%', label: 'Ops Effort Cut' },
]

const traits = [
  { icon: Code2, title: 'Clean Code', desc: 'TypeScript-first, scalable architecture', color: '#00f0ff' },
  { icon: Server, title: 'Backend Mastery', desc: 'Node.js, REST APIs, event-driven systems', color: '#915eff' },
  { icon: Cloud, title: 'Cloud Native', desc: 'AWS Lambda, EventBridge, serverless', color: '#ff6b9d' },
  { icon: Cpu, title: 'AI-Augmented', desc: 'Agentic coding with Claude, Cursor, Codex', color: '#ffd700' },
]

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="about" className="relative py-16 sm:py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">Who I Am</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black">
            About <span className="gradient-text">Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center mb-20">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              I'm a <span className="text-cyan-400 font-semibold">Full Stack Software Engineer</span> who
              enjoys owning systems end-to-end — from design decisions to production support.
              I specialize in building <span className="text-purple-400 font-semibold">scalable, high-reliability</span> web
              applications using Node.js, TypeScript, React, and modern data stores.
            </p>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              At Transfi, I designed event-driven microservices that enabled independent scaling and
              safer deployments. I built webhook integrations with replay protection, and admin
              dashboards that cut operational effort by 50%.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              I thrive in fast-moving environments where <span className="text-white font-medium">ownership, reliability,
              and customer impact</span> matter. I'm passionate about competitive programming and
              have qualified for Google CodeJam Round 2 and ICPC Asia.
            </p>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="glass rounded-2xl p-6 text-center hover:border-cyan-400/20 transition-all duration-300 group"
              >
                <div className="text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trait cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {traits.map((trait, i) => (
            <motion.div
              key={trait.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="glass rounded-2xl p-6 group hover:scale-105 transition-all duration-300 cursor-default"
              style={{ '--glow': trait.color }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                style={{ background: `${trait.color}18`, border: `1px solid ${trait.color}30` }}
              >
                <trait.icon size={22} style={{ color: trait.color }} />
              </div>
              <h3 className="font-bold text-white mb-1">{trait.title}</h3>
              <p className="text-gray-400 text-sm">{trait.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
