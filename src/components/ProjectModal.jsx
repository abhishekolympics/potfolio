import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Github, X, Satellite } from 'lucide-react'

export default function ProjectModal({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center px-5"
          style={{ background: 'rgba(1,3,10,0.58)', backdropFilter: 'blur(16px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="project-modal"
            onClick={e => e.stopPropagation()}
            initial={{ y: 34, rotateX: -8, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            style={{ '--accent': project.color }}
          >
            <button className="project-close" onClick={onClose} aria-label="Close project">
              <X size={18} />
            </button>
            <div className="project-code">
              <Satellite size={16} />
              ORBITING PROJECT
            </div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>
            <div className="project-actions">
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} />
                  Open
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github size={16} />
                  Source
                </a>
              )}
            </div>
          </motion.div>
          <style>{`
            .project-modal {
              position: relative;
              width: min(560px, 100%);
              border: 1px solid color-mix(in srgb, var(--accent), transparent 58%);
              border-radius: 1.25rem;
              padding: 1.5rem;
              background:
                radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--accent), transparent 82%), transparent 46%),
                rgba(3,6,20,0.9);
              box-shadow: 0 0 60px color-mix(in srgb, var(--accent), transparent 82%);
            }
            .project-close {
              position: absolute;
              top: 0.8rem;
              right: 0.8rem;
              width: 2rem;
              height: 2rem;
              border-radius: 0.7rem;
              display: grid;
              place-items: center;
              color: rgba(226,232,240,0.72);
              background: rgba(255,255,255,0.06);
            }
            .project-code {
              display: inline-flex;
              align-items: center;
              gap: 0.45rem;
              color: var(--accent);
              font-family: "Orbitron", monospace;
              font-size: 0.72rem;
              font-weight: 900;
              letter-spacing: 0.18em;
            }
            .project-modal h2 {
              margin-top: 0.8rem;
              color: white;
              font-family: "Rajdhani", sans-serif;
              font-size: clamp(2rem, 5vw, 3.35rem);
              line-height: 0.9;
              font-weight: 700;
            }
            .project-modal p {
              margin-top: 0.8rem;
              color: rgba(226,232,240,0.78);
              font-family: "Exo 2", sans-serif;
              font-size: 1.06rem;
              line-height: 1.55;
            }
            .project-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-top: 1.1rem;
            }
            .project-tags span {
              border: 1px solid color-mix(in srgb, var(--accent), transparent 68%);
              border-radius: 999px;
              padding: 0.36rem 0.6rem;
              color: var(--accent);
              background: color-mix(in srgb, var(--accent), transparent 92%);
              font-family: "Rajdhani", sans-serif;
              font-size: 0.95rem;
              font-weight: 700;
            }
            .project-actions {
              display: flex;
              flex-wrap: wrap;
              gap: 0.7rem;
              margin-top: 1.25rem;
            }
            .project-actions a {
              display: inline-flex;
              align-items: center;
              gap: 0.45rem;
              border-radius: 0.8rem;
              padding: 0.72rem 0.9rem;
              color: #020611;
              background: var(--accent);
              font-family: "Orbitron", monospace;
              font-size: 0.78rem;
              font-weight: 900;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
