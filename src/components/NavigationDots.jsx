import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { SECTION_DATA } from './GalaxyScene'

export default function NavigationDots({ current, navigate }) {
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2.5">
      {/* Up arrow */}
      <motion.button
        onClick={() => navigate(current - 1)}
        className="text-gray-600 hover:text-white transition-colors duration-200 disabled:opacity-20"
        disabled={current === 0}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp size={16} />
      </motion.button>

      {/* Dots */}
      {SECTION_DATA.map((s, i) => (
        <motion.button
          key={i}
          onClick={() => navigate(i)}
          title={s.label}
          className="relative group flex items-center justify-center"
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.85 }}
        >
          <motion.div
            animate={{
              width:           current === i ? 20 : 7,
              height:          current === i ? 7  : 7,
              backgroundColor: current === i ? s.color : '#374151',
              boxShadow:       current === i ? `0 0 10px ${s.color}, 0 0 20px ${s.color}60` : 'none',
            }}
            transition={{ duration: 0.3 }}
            className="rounded-full"
          />
          {/* Tooltip */}
          <span
            className="absolute right-8 px-2 py-1 rounded-md text-xs text-white bg-black/70 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
          >
            {s.label}
          </span>
        </motion.button>
      ))}

      {/* Down arrow */}
      <motion.button
        onClick={() => navigate(current + 1)}
        className="text-gray-600 hover:text-white transition-colors duration-200"
        disabled={current === SECTION_DATA.length - 1}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronDown size={16} />
      </motion.button>
    </div>
  )
}
