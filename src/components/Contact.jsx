import { Suspense, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float } from '@react-three/drei'
import { Mail, Github, Linkedin, Phone, ExternalLink, Send } from 'lucide-react'

function ContactOrb() {
  const ref = useRef()
  useFrame(({ clock }) => {
    ref.current.rotation.x = clock.getElapsedTime() * 0.3
    ref.current.rotation.y = clock.getElapsedTime() * 0.2
  })
  return (
    <Float speed={1.5} floatIntensity={1}>
      <mesh ref={ref} scale={2}>
        <torusKnotGeometry args={[1, 0.3, 100, 16]} />
        <MeshDistortMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.9}
          distort={0.3}
          speed={1.5}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  )
}

const contactLinks = [
  {
    icon: Mail,
    label: 'Email',
    value: 'abhishek19980402@gmail.com',
    href: 'mailto:abhishek19980402@gmail.com',
    color: '#ff6b9d',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 6394875951',
    href: 'tel:+916394875951',
    color: '#00f0ff',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/abhishekolympics',
    href: 'https://www.github.com/abhishekolympics',
    color: '#ffffff',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/abhishekolympics',
    href: 'https://www.linkedin.com/in/abhishekolympics/',
    color: '#0a66c2',
  },
]

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="relative py-24 px-6" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-pink-400 text-sm font-semibold tracking-widest uppercase mb-3">Let's Connect</p>
          <h2 className="text-4xl md:text-5xl font-black">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            I'm currently open to new opportunities. Whether you have a question or just want to say hi, my inbox is always open!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: 3D + links */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="h-56 mb-10"
            >
              <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.3} />
                  <pointLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
                  <pointLight position={[-5, -5, -5]} intensity={0.7} color="#915eff" />
                  <ContactOrb />
                </Suspense>
              </Canvas>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {contactLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="glass rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-all duration-200 group"
                  style={{ borderColor: `${link.color}20` }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${link.color}15`, border: `1px solid ${link.color}30` }}
                  >
                    <link.icon size={18} style={{ color: link.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">{link.label}</div>
                    <div className="text-white text-sm font-medium truncate group-hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1">
                      {link.value.length > 28 ? link.value.slice(0, 28) + '…' : link.value}
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass rounded-2xl p-8 space-y-5"
          >
            <h3 className="text-xl font-bold text-white">Send a Message</h3>

            {[
              { id: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
              { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm text-gray-400 mb-2">{label}</label>
                <input
                  id={id}
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[id]}
                  onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all duration-200 text-sm"
                />
              </div>
            ))}

            <div>
              <label htmlFor="message" className="block text-sm text-gray-400 mb-2">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                placeholder="Tell me about your project or opportunity..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all duration-200 text-sm resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={sending || sent}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-black flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #00f0ff, #915eff)' }}
            >
              {sent ? (
                '✓ Message Sent!'
              ) : sending ? (
                'Sending...'
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </motion.button>

            <p className="text-xs text-gray-600 text-center">
              Or reach me directly at{' '}
              <a href="mailto:abhishek19980402@gmail.com" className="text-cyan-400 hover:underline">
                abhishek19980402@gmail.com
              </a>
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
