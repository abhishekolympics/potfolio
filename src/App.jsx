import { useSpaceScroll } from './hooks/useSpaceScroll'
import GalaxyScene, { SECTION_DATA } from './components/GalaxyScene'
import SectionOverlay from './components/SectionOverlay'
import NavigationDots from './components/NavigationDots'
import Navbar from './components/Navbar'

export default function App() {
  const { current, navigate } = useSpaceScroll()

  return (
    <div style={{ height: '100dvh', overflow: 'hidden', position: 'relative', background: '#030614' }}>
      <GalaxyScene currentSection={current} />
      <Navbar currentSection={current} onNavigate={navigate} />
      <SectionOverlay current={current} navigate={navigate} />
      <NavigationDots current={current} navigate={navigate} />

      {current === 0 && (
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
