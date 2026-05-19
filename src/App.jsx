import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import StarsBackground from './components/canvas/StarsBackground'

export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-primary overflow-x-hidden">
      <StarsBackground />
      <Navbar scrolled={scrolled} />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Achievements />
      <Contact />
      <footer className="text-center py-6 text-gray-600 text-sm border-t border-white/5">
        <p>Crafted with passion by <span className="gradient-text font-semibold">Abhishek Kumar Singh</span></p>
      </footer>
    </div>
  )
}
