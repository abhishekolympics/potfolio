import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gamepad2, X } from 'lucide-react'

function newAsteroid(width) {
  return {
    id: Math.random().toString(36).slice(2),
    x: 24 + Math.random() * Math.max(40, width - 48),
    y: -32,
    size: 18 + Math.random() * 30,
    speed: 1.8 + Math.random() * 2.5,
    spin: Math.random() * 360,
  }
}

export default function AsteroidDodger({ open, onClose }) {
  const arenaRef = useRef(null)
  const keys = useRef({ left: false, right: false })
  const raf = useRef(null)
  const spawnTimer = useRef(0)
  const shipXRef = useRef(50)
  const [shipX, setShipX] = useState(50)
  const [asteroids, setAsteroids] = useState([])
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState('ready')

  const reset = useCallback(() => {
    shipXRef.current = 50
    setShipX(50)
    setAsteroids([])
    setScore(0)
    setStatus('playing')
    spawnTimer.current = 0
  }, [])

  useEffect(() => {
    if (!open) return undefined
    reset()
    const onKeyDown = e => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.current.left = true
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.current.right = true
      if (e.key === 'Escape') onClose()
    }
    const onKeyUp = e => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') keys.current.left = false
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') keys.current.right = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      keys.current.left = false
      keys.current.right = false
    }
  }, [onClose, open, reset])

  useEffect(() => {
    if (!open || status !== 'playing') return undefined
    let last = performance.now()

    const tick = now => {
      const delta = Math.min(32, now - last)
      last = now
      const rect = arenaRef.current?.getBoundingClientRect()
      const width = rect?.width || 520
      const height = rect?.height || 420
      const shipY = height - 58

      shipXRef.current = Math.max(
        8,
        Math.min(92, shipXRef.current + (keys.current.left ? -0.075 * delta : 0) + (keys.current.right ? 0.075 * delta : 0))
      )
      setShipX(shipXRef.current)

      spawnTimer.current += delta
      setAsteroids(prev => {
        let next = prev.map(a => ({ ...a, y: a.y + a.speed * delta * 0.055, spin: a.spin + delta * 0.08 }))
        if (spawnTimer.current > 520) {
          next = [...next, newAsteroid(width)]
          spawnTimer.current = 0
        }
        next = next.filter(a => a.y < height + 80)

        const shipPx = (shipXRef.current / 100) * width
        const hit = next.some(a => {
          const dx = Math.abs(a.x - shipPx)
          const dy = Math.abs(a.y - shipY)
          return dx < a.size * 0.6 + 18 && dy < a.size * 0.55 + 18
        })
        if (hit) setStatus('crashed')
        return next
      })
      setScore(s => s + Math.round(delta / 30))
      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [open, status])

  const stars = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: 0.25 + Math.random() * 0.6,
  })), [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center px-4"
          style={{ background: 'rgba(1,3,10,0.72)', backdropFilter: 'blur(16px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="asteroid-shell"
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 18 }}
          >
            <div className="asteroid-topbar">
              <div>
                <div className="asteroid-code"><Gamepad2 size={16} /> SKILLS PLANET MINI-GAME</div>
                <h2>Asteroid Dodger</h2>
              </div>
              <button onClick={onClose} aria-label="Close game"><X size={18} /></button>
            </div>

            <div className="asteroid-arena" ref={arenaRef}>
              {stars.map(s => <span key={s.id} className="asteroid-star" style={s} />)}
              {asteroids.map(a => (
                <div
                  key={a.id}
                  className="asteroid-rock"
                  style={{
                    width: a.size,
                    height: a.size,
                    left: a.x,
                    top: a.y,
                    transform: `translate(-50%, -50%) rotate(${a.spin}deg)`,
                  }}
                />
              ))}
              <div className="asteroid-ship" style={{ left: `${shipX}%` }}>
                <div className="ship-flame" />
                <div className="ship-body" />
              </div>
              {status === 'crashed' && (
                <div className="asteroid-crash">
                  <div>Signal Lost</div>
                  <button onClick={reset}>Restart Run</button>
                </div>
              )}
            </div>

            <div className="asteroid-footer">
              <span>Score: {score}</span>
              <span>Move: ← → / A D</span>
            </div>
          </motion.div>
          <style>{`
            .asteroid-shell {
              width: min(720px, 100%);
              border: 1px solid rgba(255,154,95,0.32);
              border-radius: 1.25rem;
              padding: 1rem;
              background: rgba(3,6,20,0.92);
              box-shadow: 0 0 70px rgba(255,154,95,0.15);
            }
            .asteroid-topbar {
              display: flex;
              align-items: start;
              justify-content: space-between;
              gap: 1rem;
              padding: 0.4rem 0.35rem 0.85rem;
            }
            .asteroid-code {
              display: inline-flex;
              align-items: center;
              gap: 0.45rem;
              color: #ff9a5f;
              font-family: "Orbitron", monospace;
              font-size: 0.75rem;
              font-weight: 900;
              letter-spacing: 0.16em;
            }
            .asteroid-topbar h2 {
              color: white;
              font-family: "Rajdhani", sans-serif;
              font-size: 2.6rem;
              font-weight: 700;
              line-height: 0.9;
            }
            .asteroid-topbar button {
              width: 2rem;
              height: 2rem;
              border-radius: 0.65rem;
              display: grid;
              place-items: center;
              background: rgba(255,255,255,0.07);
              color: white;
            }
            .asteroid-arena {
              position: relative;
              height: min(52vh, 430px);
              overflow: hidden;
              border: 1px solid rgba(255,154,95,0.2);
              border-radius: 1rem;
              background:
                radial-gradient(circle at 50% 100%, rgba(255,154,95,0.18), transparent 38%),
                linear-gradient(180deg, rgba(9,13,31,0.96), rgba(2,5,17,0.98));
            }
            .asteroid-star {
              position: absolute;
              width: 3px;
              height: 3px;
              border-radius: 999px;
              background: white;
            }
            .asteroid-rock {
              position: absolute;
              border-radius: 45% 55% 48% 52%;
              background: radial-gradient(circle at 35% 30%, #b79b82, #7c5b49 46%, #372620);
              box-shadow: inset -6px -8px 12px rgba(0,0,0,0.42), 0 0 16px rgba(255,154,95,0.2);
            }
            .asteroid-ship {
              position: absolute;
              bottom: 26px;
              transform: translateX(-50%);
              width: 46px;
              height: 58px;
            }
            .ship-body {
              position: absolute;
              inset: 0;
              clip-path: polygon(50% 0, 88% 82%, 50% 65%, 12% 82%);
              background: linear-gradient(180deg, #ffffff, #6bd8ff 55%, #915eff);
              filter: drop-shadow(0 0 16px rgba(107,216,255,0.55));
            }
            .ship-flame {
              position: absolute;
              left: 50%;
              bottom: -18px;
              width: 20px;
              height: 34px;
              transform: translateX(-50%);
              border-radius: 50% 50% 60% 60%;
              background: linear-gradient(180deg, #fff, #ffd700 35%, #ff6b9d 100%);
              filter: blur(1px) drop-shadow(0 0 18px #ff9a5f);
              animation: flame 0.15s infinite alternate;
            }
            .asteroid-crash {
              position: absolute;
              inset: 0;
              display: grid;
              place-content: center;
              gap: 0.8rem;
              background: rgba(1,3,10,0.72);
              text-align: center;
              color: white;
              font-family: "Orbitron", monospace;
              font-weight: 900;
              letter-spacing: 0.12em;
            }
            .asteroid-crash button {
              border-radius: 0.8rem;
              padding: 0.75rem 1rem;
              background: #ff9a5f;
              color: #020611;
            }
            .asteroid-footer {
              display: flex;
              justify-content: space-between;
              padding: 0.8rem 0.3rem 0.2rem;
              color: rgba(226,232,240,0.72);
              font-family: "Rajdhani", sans-serif;
              font-size: 1rem;
              font-weight: 700;
            }
            @keyframes flame {
              from { transform: translateX(-50%) scaleY(0.8); opacity: 0.75; }
              to { transform: translateX(-50%) scaleY(1.15); opacity: 1; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
