import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react'
import FloatingGeometry from './canvas/FloatingGeometry'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-16 sm:pt-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-4"
            >
              Hi, I'm{' '}
              <span className="gradient-text">Abhishek</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-2xl md:text-3xl font-light text-gray-400 mb-6 h-10"
            >
              <TypeAnimation
                sequence={[
                  'Full Stack Engineer',
                  2000,
                  'Node.js Expert',
                  2000,
                  'React Developer',
                  2000,
                  'AWS Architect',
                  2000,
                  'Problem Solver',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-cyan-400 font-semibold"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mb-8"
            >
              Building production-ready web applications end-to-end — from
              scalable APIs and event-driven microservices to polished React UIs.
              I care deeply about reliability, performance, and real-world impact.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-4 mb-10"
            >
              <a
                href="#contact"
                className="w-full sm:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-black text-sm sm:text-base transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
                style={{ background: 'linear-gradient(135deg, #00f0ff, #915eff)' }}
              >
                Get In Touch
              </a>
              <a
                href="#experience"
                className="w-full sm:w-auto text-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-white border border-white/20 hover:border-white/40 transition-all duration-200 hover:scale-105 glass text-sm sm:text-base"
              >
                View Work
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-5"
            >
              {[
                { icon: Github, href: 'https://www.github.com/abhishekolympics', label: 'GitHub' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/abhishekolympics/', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:abhishek19980402@gmail.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-all duration-200 hover:scale-110"
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block h-[550px] relative"
          >
            <FloatingGeometry />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={20} className="text-gray-600" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
