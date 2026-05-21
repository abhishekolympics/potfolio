import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import {
  Github, Linkedin, Mail, Phone, FileText,
  Trophy, Medal, Star, Code2, Server, Cloud, Cpu,
  Copy, Check, ExternalLink, Calendar,
} from 'lucide-react'
import { SECTION_DATA } from './GalaxyScene'

const EMAIL = 'abhishek19980402@gmail.com'

// ── Reusable tag ───────────────────────────────────────────────────────────────

function Tag({ color, children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold"
      style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
    >
      {children}
    </span>
  )
}

// ── Home ───────────────────────────────────────────────────────────────────────

function HomeContent({ color, navigate }) {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit"
        style={{ border: `1px solid ${color}40`, color, background: `${color}08` }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
        Available for opportunities
      </div>

      <div>
        <div className="text-white/40 text-xs font-semibold mb-2 tracking-widest uppercase" style={{ fontFamily: '"Exo 2", sans-serif' }}>Full Stack Software Engineer</div>
        <div className="font-black leading-tight" style={{ fontFamily: '"Exo 2", sans-serif', fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)' }}>
          Building systems <span style={{ color, textShadow: `0 0 20px ${color}80` }}>end-to-end</span>,<br />
          from APIs to polished UIs.
        </div>
      </div>

      <div className="text-base font-semibold h-7" style={{ color }}>
        <TypeAnimation
          sequence={['Node.js · TypeScript', 2000, 'React · AWS Lambda', 2000, 'Event-driven systems', 2000, 'AI-augmented dev', 2000]}
          wrapper="span" speed={55} repeat={Infinity}
        />
      </div>

      <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
        3+ years building production-ready web applications. Obsessed with
        reliability, performance, and real customer impact.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate(5)}
          className="px-5 py-2.5 rounded-xl font-semibold text-black text-sm hover:scale-105 transition-all shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, #915eff)` }}
        >
          Get In Touch
        </button>
        <a
          href="https://drive.google.com/file/d/1Cn_a86TjdqfaQLHMjLN3qen_t0y2pS21/view"
          target="_blank" rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm hover:scale-105 transition-all"
          style={{ border: `1px solid ${color}40`, background: `${color}08` }}
        >
          Resume
        </a>
      </div>

      <div className="flex gap-3">
        {[
          { icon: Github,   href: 'https://github.com/abhishekolympics',           label: 'GitHub' },
          { icon: Linkedin, href: 'https://www.linkedin.com/in/abhishekolympics/', label: 'LinkedIn' },
          { icon: Mail,     href: `mailto:${EMAIL}`,                               label: 'Email' },
        ].map(({ icon: Icon, href, label }) => (
          <a
            key={label} href={href} target="_blank" rel="noopener noreferrer"
            aria-label={label}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 transition-all hover:scale-110"
            style={{ border: `1px solid ${color}25`, background: `${color}08` }}
            onMouseEnter={e => e.currentTarget.style.color = color}
            onMouseLeave={e => e.currentTarget.style.color = ''}
          >
            <Icon size={16} />
          </a>
        ))}
      </div>
    </div>
  )
}

// ── About ──────────────────────────────────────────────────────────────────────

function AboutContent({ color }) {
  const stats  = [['3+', 'Years Exp.'], ['2', 'Companies'], ['35%', 'Defects ↓'], ['50%', 'Ops Effort ↓']]
  const traits = [
    { icon: Code2,  label: 'Clean Code' },
    { icon: Server, label: 'Backend' },
    { icon: Cloud,  label: 'Cloud Native' },
    { icon: Cpu,    label: 'AI-augmented' },
  ]
  return (
    <div className="flex flex-col gap-5">
      <p className="text-gray-200 text-sm leading-relaxed">
        Full Stack Engineer who enjoys owning systems end-to-end. At{' '}
        <span style={{ color }} className="font-semibold">Transfi</span>, designed event-driven
        microservices, built webhook integrations with replay protection, and shipped admin dashboards
        that cut operational effort by 50%.
      </p>
      <p className="text-gray-400 text-sm leading-relaxed">
        I thrive where <span className="text-white font-medium">ownership, reliability, and customer
        impact</span> matter most. Competitive programmer — Google CodeJam Round 2, ICPC Asia.
      </p>
      <div className="grid grid-cols-4 gap-2">
        {stats.map(([v, l]) => (
          <div key={l} className="rounded-xl p-3 text-center" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
            <div className="text-xl font-black" style={{ color }}>{v}</div>
            <div className="text-gray-500 text-xs mt-0.5">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {traits.map(t => (
          <Tag key={t.label} color={color}>
            <t.icon size={11} />{t.label}
          </Tag>
        ))}
      </div>
    </div>
  )
}

// ── Skills ─────────────────────────────────────────────────────────────────────

const SKILL_GROUPS = [
  { cat: 'Backend',   color: '#00f0ff', skills: ['Node.js', 'Express', 'NestJS', 'REST', 'GraphQL'] },
  { cat: 'Frontend',  color: '#915eff', skills: ['React', 'TypeScript', 'Gatsby', 'Tailwind'] },
  { cat: 'Databases', color: '#ff6b9d', skills: ['MongoDB', 'SQL', 'Redis'] },
  { cat: 'Cloud',     color: '#ffd700', skills: ['AWS Lambda', 'EventBridge', 'Docker', 'CI/CD'] },
  { cat: 'Languages', color: '#00ff87', skills: ['JavaScript', 'TypeScript', 'C++'] },
  { cat: 'AI Tools',  color: '#ff8c00', skills: ['Claude Code', 'Cursor', 'Codex'] },
]

function SkillsContent({ color }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-400 text-sm">Technologies I work with daily across the full stack.</p>
      <div className="grid gap-3">
        {SKILL_GROUPS.map(g => (
          <div key={g.cat} className="flex items-start gap-3">
            <span className="text-xs font-bold w-20 flex-shrink-0 pt-0.5 uppercase tracking-wide" style={{ color: g.color }}>
              {g.cat}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {g.skills.map(s => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-md text-xs font-medium"
                  style={{ background: `${g.color}12`, border: `1px solid ${g.color}28`, color: g.color }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Experience ─────────────────────────────────────────────────────────────────

const JOBS = [
  {
    company: 'Transfi',
    role: 'Senior Software Engineer',
    period: 'Nov 2024 – Jan 2026',
    color: '#00f0ff',
    bullets: [
      'Event-driven microservices enabling independent scaling & safer deployments.',
      'Webhook integrations with replay protection; reduced integration defects ~35%.',
      'Admin dashboards (React + AgGrid) cut operational effort by ~50%.',
      'Serverless systems: AWS Lambda & EventBridge.',
    ],
  },
  {
    company: 'Sifars',
    role: 'Associate Software Engineer',
    period: 'Jun 2023 – Jul 2024',
    color: '#915eff',
    bullets: [
      'MERN stack apps + Gatsby CMS, improved data delivery by 25%.',
      'REST APIs via CI/CD cadence → 20% performance improvement.',
      'Multilingual email templates (EJS + i18n) boosted engagement 15%.',
    ],
  },
]

function ExperienceContent({ color }) {
  return (
    <div className="flex flex-col gap-4">
      {JOBS.map(j => (
        <div key={j.company} className="rounded-xl p-4" style={{ background: `${j.color}08`, border: `1px solid ${j.color}20` }}>
          <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
            <div>
              <div className="font-black text-white">{j.company}</div>
              <div className="text-xs font-semibold" style={{ color: j.color }}>{j.role}</div>
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
              <Calendar size={10} />{j.period}
            </span>
          </div>
          <ul className="space-y-1.5">
            {j.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: j.color }} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ── Achievements ───────────────────────────────────────────────────────────────

const ACHVS = [
  { icon: Trophy, title: 'Google CodeJam',       sub: 'Qualified Round 2',   color: '#ffd700' },
  { icon: Medal,  title: 'CodeChef Starters',    sub: 'Rank 212 / 11,540',   color: '#00f0ff' },
  { icon: Star,   title: 'ICPC 2023 Asia',        sub: 'Regional Participant', color: '#915eff' },
  { icon: Code2,  title: 'KickStart + HackerCup', sub: 'Global Competitions', color: '#ff6b9d' },
]
const EDU = [
  { deg: 'Master of Computer Applications',   inst: 'LPU, Punjab',   period: '2021–2023', color: '#00f0ff' },
  { deg: 'Bachelor of Computer Applications', inst: 'UIET, CSJMU',   period: '2017–2020', color: '#915eff' },
]

function AchievementsContent({ color }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {ACHVS.map(a => (
          <div
            key={a.title}
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: `${a.color}08`, border: `1px solid ${a.color}20` }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${a.color}18`, border: `1px solid ${a.color}30`, boxShadow: `0 0 10px ${a.color}30` }}
            >
              <a.icon size={14} style={{ color: a.color }} />
            </div>
            <div>
              <div className="text-white text-xs font-bold leading-tight">{a.title}</div>
              <div className="text-xs" style={{ color: a.color }}>{a.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs font-bold uppercase tracking-widest text-gray-600 mt-1">Education</div>
      <div className="grid gap-2">
        {EDU.map(e => (
          <div key={e.deg} className="rounded-xl p-3" style={{ background: `${e.color}08`, border: `1px solid ${e.color}18` }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-white text-xs font-bold">{e.deg}</div>
                <div className="text-gray-500 text-xs">{e.inst}</div>
              </div>
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: e.color }}>{e.period}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Contact ────────────────────────────────────────────────────────────────────

const CONTACT_LINKS = [
  {
    icon: Mail,     label: 'Email',
    value: EMAIL,   copyValue: EMAIL,
    href: `mailto:${EMAIL}`,
    color: '#ff6b9d',
  },
  {
    icon: Phone,    label: 'Phone',
    value: '+91 6394875951', copyValue: '+916394875951',
    href: 'tel:+916394875951',
    color: '#00f0ff',
  },
  {
    icon: Github,   label: 'GitHub',
    value: 'abhishekolympics', copyValue: 'https://github.com/abhishekolympics',
    href: 'https://github.com/abhishekolympics',
    color: '#e2e8f0',
  },
  {
    icon: Linkedin, label: 'LinkedIn',
    value: 'abhishekolympics', copyValue: 'https://www.linkedin.com/in/abhishekolympics/',
    href: 'https://www.linkedin.com/in/abhishekolympics/',
    color: '#4a9eff',
  },
  {
    icon: FileText, label: 'Resume',
    value: 'View on Drive', copyValue: 'https://drive.google.com/file/d/1Cn_a86TjdqfaQLHMjLN3qen_t0y2pS21/view',
    href: 'https://drive.google.com/file/d/1Cn_a86TjdqfaQLHMjLN3qen_t0y2pS21/view',
    color: '#ffd700',
  },
]

function ContactContent({ color }) {
  const [copiedLabel, setCopiedLabel] = useState(null)

  const copyText = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopiedLabel(label)
    setTimeout(() => setCopiedLabel(l => l === label ? null : l), 2500)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-400 text-sm">Open to new opportunities. Let's build something great together.</p>
      <div className="grid gap-2">
        {CONTACT_LINKS.map(l => (
          <div
            key={l.label}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 w-full transition-all hover:scale-[1.02]"
            style={{ background: `${l.color}08`, border: `1px solid ${l.color}20` }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${l.color}18`, border: `1px solid ${l.color}30` }}
            >
              <l.icon size={13} style={{ color: l.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-gray-500 text-xs">{l.label}</div>
              <div
                className="text-xs font-semibold truncate transition-colors duration-300"
                style={{ color: copiedLabel === l.label ? '#00ff87' : l.color }}
              >
                {copiedLabel === l.label ? '✓ Copied!' : l.value}
              </div>
            </div>
            {/* Per-item action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => copyText(l.copyValue, l.label)}
                title={`Copy ${l.label}`}
                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                style={{ background: `${l.color}12` }}
              >
                {copiedLabel === l.label
                  ? <Check size={11} style={{ color: '#00ff87' }} />
                  : <Copy size={11} />
                }
              </button>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open ${l.label}`}
                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                style={{ background: `${l.color}12` }}
              >
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Content registry ───────────────────────────────────────────────────────────

const CONTENT_COMPONENTS = [
  HomeContent, AboutContent, SkillsContent,
  ExperienceContent, AchievementsContent, ContactContent,
]

// ── Main Overlay ───────────────────────────────────────────────────────────────

export default function SectionOverlay({ current, navigate }) {
  const data    = SECTION_DATA[current]
  const color   = data.color
  const isLeft  = data.side === 'left'   // content on left half
  const Content = CONTENT_COMPONENTS[current]

  // Gradient fades inward from the content edge toward the planet
  const gradient = isLeft
    ? `linear-gradient(to right, rgba(3,6,20,0.92) 40%, rgba(3,6,20,0.5) 75%, transparent 100%)`
    : `linear-gradient(to left,  rgba(3,6,20,0.92) 40%, rgba(3,6,20,0.5) 75%, transparent 100%)`

  return (
    <>
      <style>{`
        .overlay-panel {
          position: fixed;
          top: 0; bottom: 0;
          width: min(44%, 540px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 20;
          pointer-events: auto;
        }
        .overlay-panel.left  { left: 0; }
        .overlay-panel.right { right: 0; }
        .panel-inner {
          padding: 5rem 2.5rem 3rem;
        }
        .overlay-panel.left  .panel-inner { padding-right: 3.5rem; }
        .overlay-panel.right .panel-inner { padding-left: 3.5rem;  }

        @media (max-width: 768px) {
          .overlay-panel {
            left: 0 !important; right: 0 !important;
            top: auto; bottom: 0;
            width: 100% !important;
            height: 55vh;
            justify-content: flex-start;
          }
          .panel-inner {
            padding: 1.5rem 1.5rem 2rem !important;
            overflow-y: auto;
            height: 100%;
          }
        }
      `}</style>

      {/* Side content panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`panel-${current}`}
          className={`overlay-panel ${isLeft ? 'left' : 'right'}`}
          style={{ background: gradient }}
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.9, duration: 0.5, ease: 'easeOut' } }}
          exit={{ opacity: 0, x: isLeft ? -30 : 30, transition: { duration: 0.2 } }}
        >
          <div className="panel-inner">
            <Content color={color} navigate={navigate} />
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
