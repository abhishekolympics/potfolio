import { useState, useEffect, useRef, useCallback } from 'react'

const TOTAL = 6
const COOLDOWN = 1400

export function useSpaceScroll({ enabled = true } = {}) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const cooldown = useRef(false)
  const currentRef = useRef(0)
  const timer = useRef(null)

  const navigate = useCallback((index) => {
    if (cooldown.current || index === currentRef.current || index < 0 || index >= TOTAL) return
    cooldown.current = true
    currentRef.current = index
    setCurrent(index)
    setTransitioning(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      cooldown.current = false
      setTransitioning(false)
    }, COOLDOWN)
  }, [])

  const move = useCallback((dir) => navigate(currentRef.current + dir), [navigate])

  useEffect(() => {
    if (!enabled) return undefined

    const onWheel = (e) => { e.preventDefault(); move(e.deltaY > 0 ? 1 : -1) }
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') move(1)
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   move(-1)
    }
    let ty = 0
    const onTouchStart = (e) => { ty = e.touches[0].clientY }
    const onTouchEnd   = (e) => {
      const d = ty - e.changedTouches[0].clientY
      if (Math.abs(d) > 50) move(d > 0 ? 1 : -1)
    }

    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('keydown',    onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('keydown',    onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      clearTimeout(timer.current)
    }
  }, [enabled, move])

  return { current, navigate, transitioning }
}
