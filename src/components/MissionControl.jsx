import { AnimatePresence, motion } from 'framer-motion'
import { Music, VolumeX, Waves, Sparkles, Rocket } from 'lucide-react'

export default function MissionControl({
  showIntro,
  onStart,
  soundEnabled,
  setSoundEnabled,
  motionEnabled,
  setMotionEnabled,
}) {
  return (
    <>
      <div className="fixed top-20 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled(v => !v)}
          className="mission-toggle"
          title={soundEnabled ? 'Mute ambient signal' : 'Enable ambient signal'}
        >
          {soundEnabled ? <Music size={15} /> : <VolumeX size={15} />}
          <span>{soundEnabled ? 'Signal' : 'Muted'}</span>
        </button>
        <button
          onClick={() => setMotionEnabled(v => !v)}
          className="mission-toggle"
          title={motionEnabled ? 'Reduce camera motion' : 'Enable camera motion'}
        >
          <Waves size={15} />
          <span>{motionEnabled ? 'Motion' : 'Calm'}</span>
        </button>
      </div>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center px-5"
            style={{
              background: 'radial-gradient(circle at 45% 45%, rgba(0,240,255,0.18), rgba(3,6,20,0.78) 42%, rgba(1,3,10,0.96) 100%)',
              backdropFilter: 'blur(18px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
          >
            <motion.div
              className="mission-intro"
              initial={{ y: 28, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -18, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <div className="mission-intro-code">
                <Sparkles size={18} />
                MISSION CONTROL ONLINE
              </div>
              <h1>Explore Abhishek's Engineering Galaxy</h1>
              <p>
                Scroll to jump between planets, inspect orbiting project satellites,
                and launch the asteroid dodger from the skills sector.
              </p>
              <div className="mission-intro-toggles">
                <button onClick={() => setSoundEnabled(v => !v)} className={soundEnabled ? 'active' : ''}>
                  {soundEnabled ? <Music size={16} /> : <VolumeX size={16} />}
                  {soundEnabled ? 'Ambient Signal On' : 'Ambient Signal Off'}
                </button>
                <button onClick={() => setMotionEnabled(v => !v)} className={motionEnabled ? 'active' : ''}>
                  <Waves size={16} />
                  {motionEnabled ? 'Cinematic Motion' : 'Calm Motion'}
                </button>
              </div>
              <button className="mission-launch" onClick={onStart}>
                <Rocket size={18} />
                Start Mission
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .mission-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid rgba(107,216,255,0.22);
          border-radius: 999px;
          padding: 0.5rem 0.72rem;
          background: rgba(3,6,20,0.52);
          color: rgba(226,232,240,0.78);
          font-family: "Rajdhani", sans-serif;
          font-size: 0.86rem;
          font-weight: 700;
          backdrop-filter: blur(14px);
          transition: transform 160ms ease, color 160ms ease, border-color 160ms ease;
        }
        .mission-toggle:hover {
          color: white;
          border-color: rgba(107,216,255,0.48);
          transform: translateY(-1px);
        }
        .mission-intro {
          width: min(620px, 100%);
          border: 1px solid rgba(107,216,255,0.28);
          border-radius: 1.4rem;
          padding: clamp(1.5rem, 4vw, 2.5rem);
          background:
            linear-gradient(135deg, rgba(107,216,255,0.12), rgba(145,94,255,0.08)),
            rgba(3,6,20,0.78);
          box-shadow: 0 0 70px rgba(0,240,255,0.16), inset 0 0 42px rgba(255,255,255,0.035);
          text-align: center;
        }
        .mission-intro-code {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #6bd8ff;
          font-family: "Orbitron", monospace;
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-shadow: 0 0 20px rgba(107,216,255,0.8);
        }
        .mission-intro h1 {
          margin: 1rem auto 0.75rem;
          color: white;
          font-family: "Rajdhani", sans-serif;
          font-size: clamp(2.4rem, 6vw, 4.8rem);
          line-height: 0.88;
          font-weight: 700;
          text-shadow: 0 0 34px rgba(255,255,255,0.18);
        }
        .mission-intro p {
          margin: 0 auto 1.4rem;
          max-width: 34rem;
          color: rgba(226,232,240,0.72);
          font-family: "Exo 2", sans-serif;
          font-size: 1.06rem;
          line-height: 1.55;
        }
        .mission-intro-toggles {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.7rem;
          margin-bottom: 1.35rem;
        }
        .mission-intro-toggles button {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 0.65rem 0.9rem;
          background: rgba(255,255,255,0.035);
          color: rgba(226,232,240,0.72);
          font-family: "Rajdhani", sans-serif;
          font-size: 1rem;
          font-weight: 700;
        }
        .mission-intro-toggles button.active {
          border-color: rgba(107,216,255,0.38);
          color: #6bd8ff;
          box-shadow: 0 0 22px rgba(107,216,255,0.14);
        }
        .mission-launch {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          border-radius: 0.9rem;
          padding: 0.92rem 1.35rem;
          background: linear-gradient(135deg, #6bd8ff, #915eff);
          color: #020611;
          font-family: "Orbitron", monospace;
          font-size: 0.9rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          box-shadow: 0 0 40px rgba(107,216,255,0.28);
        }
        @media (max-width: 768px) {
          .fixed.top-20.right-6 {
            top: 4.7rem !important;
            right: 0.65rem !important;
          }
          .mission-toggle span { display: none; }
          .mission-toggle { width: 2.35rem; height: 2.35rem; justify-content: center; padding: 0; }
          .mission-intro {
            padding: 1.25rem;
          }
          .mission-intro p {
            font-size: 0.96rem;
          }
        }
      `}</style>
    </>
  )
}
