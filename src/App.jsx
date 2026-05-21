import { useEffect, useRef, useState } from 'react'
import { useSpaceScroll } from './hooks/useSpaceScroll'
import GalaxyScene, { SECTION_DATA } from './components/GalaxyScene'
import SectionOverlay from './components/SectionOverlay'
import NavigationDots from './components/NavigationDots'
import Navbar from './components/Navbar'
import MissionControl from './components/MissionControl'
import ProjectModal from './components/ProjectModal'
import AsteroidDodger from './components/AsteroidDodger'

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('mission-intro-seen'))
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [motionEnabled, setMotionEnabled] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [gameOpen, setGameOpen] = useState(false)
  const audioRef = useRef(null)
  const { current, navigate } = useSpaceScroll({ enabled: !showIntro && !gameOpen && !selectedProject })

  useEffect(() => {
    if (!soundEnabled) {
      audioRef.current?.oscillators?.forEach(node => node.stop())
      audioRef.current?.context?.close()
      audioRef.current = null
      return undefined
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return undefined

    const context = new AudioContext()
    const gain = context.createGain()
    gain.gain.value = 0.025
    gain.connect(context.destination)

    const oscillators = [72, 108, 144].map((freq, index) => {
      const osc = context.createOscillator()
      const oscGain = context.createGain()
      osc.type = index === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      oscGain.gain.value = index === 0 ? 0.7 : 0.22
      osc.connect(oscGain)
      oscGain.connect(gain)
      osc.start()
      return osc
    })

    audioRef.current = { context, oscillators }
    return () => {
      oscillators.forEach(node => node.stop())
      context.close()
      audioRef.current = null
    }
  }, [soundEnabled])

  const startMission = () => {
    localStorage.setItem('mission-intro-seen', 'true')
    setShowIntro(false)
  }

  return (
    <div style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: '#030614' }}>
      <GalaxyScene
        currentSection={current}
        motionEnabled={motionEnabled}
        onProjectSelect={setSelectedProject}
      />
      <Navbar currentSection={current} onNavigate={navigate} />
      <SectionOverlay current={current} navigate={navigate} onLaunchGame={() => setGameOpen(true)} />
      <NavigationDots current={current} navigate={navigate} />
      <MissionControl
        showIntro={showIntro}
        onStart={startMission}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        motionEnabled={motionEnabled}
        setMotionEnabled={setMotionEnabled}
      />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <AsteroidDodger open={gameOpen} onClose={() => setGameOpen(false)} />

      {current === 0 && !showIntro && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          style={{ animation: 'fadeInHint 1s ease 2.5s both' }}
        >
          <span className="text-[10px] tracking-widest uppercase" style={{ color: `${SECTION_DATA[0].color}70` }}>
            scroll to explore
          </span>
          <div
            className="w-px h-8"
            style={{
              background: `linear-gradient(to bottom, ${SECTION_DATA[0].color}60, transparent)`,
              animation: 'pulse 1.6s ease-in-out infinite',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeInHint {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
