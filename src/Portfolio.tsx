import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import mesuliImage from './assets/Mesuli Image.jpg'
import skillTechModalBg from './assets/skill-tech-modal-bg.png'
import AboutPage from './AboutPage'
import { getAppRoute, hrefTo, navigate, subscribeAppRoute } from './appRoute'
import ProjectsPage from './ProjectsPage'
import { SiteHeader } from './SiteHeader'
import { RippleBox, setBodyCursorActive } from './RippleBox'

const HERO_NAME_ARIA_LABEL = 'Mesuli Nduluko'

/**
 * Per-letter start offsets (viewport-relative) so each character flies in from a
 * different direction and settles on one line under the photo.
 */
const HERO_LETTER_FROM_OFFSETS: readonly { x: string; y: string }[] = [
  { x: '-6.5vmin', y: '-9.5vmin' },
  { x: '8vmin', y: '-6.5vmin' },
  { x: '9vmin', y: '0.25vmin' },
  { x: '7vmin', y: '8.5vmin' },
  { x: '0vmin', y: '9vmin' },
  { x: '-7.5vmin', y: '8vmin' },
  { x: '-9vmin', y: '0vmin' },
  { x: '-6vmin', y: '-8.5vmin' },
  { x: '7.5vmin', y: '-6vmin' },
  { x: '8.5vmin', y: '4.5vmin' },
  { x: '-6.5vmin', y: '8vmin' },
  { x: '-8.5vmin', y: '-3.5vmin' },
  { x: '7vmin', y: '7vmin' },
  { x: '-6vmin', y: '-8vmin' },
]

function heroLetterOffset(i: number): { x: string; y: string } {
  return HERO_LETTER_FROM_OFFSETS[i % HERO_LETTER_FROM_OFFSETS.length]!
}

const HERO_TAGLINE_TEXT =
  'Web Developer focused on building modern, high-performance digital experiences and delivering dependable technical support.'

/** Word units so the per-letter flex layout cannot wrap mid-word */
const HERO_TAGLINE_WORDS = HERO_TAGLINE_TEXT.split(' ').filter(Boolean)
const HERO_TAGLINE_WORD_STARTS: readonly number[] = (() => {
  const parts = HERO_TAGLINE_TEXT.split(' ')
  const starts: number[] = []
  let p = 0
  for (let i = 0; i < parts.length; i++) {
    starts.push(p)
    p += parts[i]!.length + (i < parts.length - 1 ? 1 : 0)
  }
  return starts
})()

type SkillChip = { name: string; description: string; iconClass: string }

/** Markup, languages, frameworks, and databases used in development */
const TECHNOLOGIES: SkillChip[] = [
  {
    name: 'HTML',
    iconClass: 'fab fa-html5',
    description:
      'HTML (HyperText Markup Language) is used to structure web pages: headings, paragraphs, links, images, forms, and sections. It tells the browser what each part of the page means so content is organized and accessible.',
  },
  {
    name: 'CSS',
    iconClass: 'fab fa-css3-alt',
    description:
      'CSS (Cascading Style Sheets) controls how web pages look: colors, fonts, spacing, layout, and responsive design. It separates presentation from structure so sites can adapt to different screen sizes and brands.',
  },
  {
    name: 'JavaScript',
    iconClass: 'fab fa-js',
    description:
      'JavaScript runs in the browser (and on servers with Node.js) to add interactivity: menus, validation, animations, and fetching data without reloading the page. It is the main language for dynamic web behavior.',
  },
  {
    name: 'React',
    iconClass: 'fab fa-react',
    description:
      'React is a JavaScript library for building user interfaces from reusable components. It helps manage state and updates the UI efficiently, which is ideal for modern single-page applications and complex dashboards.',
  },
  {
    name: 'Python',
    iconClass: 'fab fa-python',
    description:
      'Python is a versatile language used for scripting, automation, data work, APIs, and web backends. Its clear syntax makes it strong for prototypes, tools, and services that need to integrate with databases and other systems.',
  },
  {
    name: 'PHP',
    iconClass: 'fab fa-php',
    description:
      'PHP is a server-side language widely used for web applications and content systems. It generates HTML, talks to databases, and handles forms and sessions—common in hosting environments and many existing websites.',
  },
  {
    name: 'MySQL',
    iconClass: 'fas fa-database',
    description:
      'MySQL is a relational database system used to store and query structured data: users, products, records, and reports. It works with languages like PHP and Python to persist information safely behind web applications.',
  },
]

/** IT operations, design, and hands-on hardware work */
const IT_SKILLS: SkillChip[] = [
  {
    name: 'Windows Administration',
    iconClass: 'fab fa-windows',
    description:
      'Windows administration covers managing user accounts, permissions, updates, networking, and services on Windows PCs and servers. It keeps systems secure, backed up, and running smoothly for organizations and clients.',
  },
  {
    name: 'Hardware Troubleshooting',
    iconClass: 'fas fa-microchip',
    description:
      'Hardware troubleshooting means diagnosing physical computer issues: memory, storage, displays, power, and peripherals. It involves testing components, replacing faulty parts, and restoring reliable machines for everyday use.',
  },
  {
    name: 'Poster Designing',
    iconClass: 'fas fa-palette',
    description:
      'Poster designing is the process of creating clear, eye-catching visuals for events, promotions, and campaigns. It balances typography, imagery, hierarchy, and brand guidelines so the message reads quickly at a glance in print or on screens.',
  },
]

function SkillChipButton({
  skill,
  isSelected,
  onSelect,
}: {
  skill: SkillChip
  isSelected: boolean
  onSelect: (s: SkillChip) => void
}) {
  return (
    <RippleBox
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-expanded={isSelected}
      aria-label={`${skill.name}: view description`}
      className={`group flex max-w-[100%] items-center gap-[clamp(0.4rem,1.5vw,0.65rem)] rounded-full border px-[clamp(0.75rem,2.2vw,1.25rem)] py-[clamp(0.5rem,1.5vw,0.65rem)] text-[clamp(0.88rem,calc(0.35vw+0.82rem),1rem)] transition-[transform,box-shadow,background-color,border-color,color,ring] duration-300 ease-out motion-reduce:duration-75 ${
        isSelected
          ? '-translate-y-0.5 scale-[1.04] border-primary/60 bg-primary text-[#111] shadow-[0_10px_22px_rgba(0,255,157,0.28)] ring-2 ring-primary/35'
          : 'border-primary/35 bg-primary/10 text-primary hover:-translate-y-0.5 hover:scale-[1.04] hover:bg-primary hover:text-[#111] hover:shadow-[0_10px_20px_rgba(0,255,157,0.2)]'
      }`}
      onClick={() => onSelect(skill)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(skill)
        }
      }}
    >
      <i
        className={`${skill.iconClass} text-[1.35rem] leading-none transition-colors duration-300 ease-out motion-reduce:duration-75 ${isSelected ? 'text-[#111]' : 'group-hover:text-[#111]'}`}
        aria-hidden
      />
      <span>{skill.name}</span>
    </RippleBox>
  )
}

/** CSS vars for the skill modal’s single walking 3D robot (marquee + bob / leg cycle). */
const SKILL_MODAL_ROBOT_MARQUEE_STYLE = {
  '--robot-w': '58px',
  '--robot-duration': '22s',
  '--robot-delay': '0s',
  '--bob-delay': '0s',
  '--robot-scale': '1',
  '--robot-opacity': '0.78',
  '--robot-color': '#7dd3fc',
} as CSSProperties

/** CSS 3D block robot with walk cycle; lane sets `--robot-color` and motion vars. */
function SkillModalRobot3D() {
  return (
    <div className="skill-modal-robot-3d">
      <div className="skill-modal-robot-3d-shadow" />
      <div className="skill-modal-robot-3d-legs">
        <div className="skill-modal-robot-3d-leg skill-modal-robot-3d-leg-l" />
        <div className="skill-modal-robot-3d-leg skill-modal-robot-3d-leg-r" />
      </div>
      <div className="skill-modal-robot-3d-torso" />
      <div className="skill-modal-robot-3d-arm skill-modal-robot-3d-arm-l" />
      <div className="skill-modal-robot-3d-arm skill-modal-robot-3d-arm-r" />
      <div className="skill-modal-robot-3d-head">
        <span className="skill-modal-robot-3d-eye skill-modal-robot-3d-eye-l" />
        <span className="skill-modal-robot-3d-eye skill-modal-robot-3d-eye-r" />
      </div>
      <div className="skill-modal-robot-3d-antenna" />
    </div>
  )
}

const SKILL_MODAL_MS = 280

const WELCOME_ROBOT_STYLE = {
  '--robot-w': '72px',
  '--robot-duration': '22s',
  '--robot-delay': '0s',
  '--bob-delay': '0s',
  '--robot-scale': '1.35',
  '--robot-opacity': '0.95',
  '--robot-color': '#00f0ff',
} as CSSProperties

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Portfolio() {
  const [glow, setGlow] = useState({ x: 0, y: 0 })
  const [selectedSkill, setSelectedSkill] = useState<SkillChip | null>(null)
  const [skillModalVisible, setSkillModalVisible] = useState(false)
  const [appRoute, setAppRoute] = useState(() => getAppRoute())
  const [portfolioWelcomeDismissed, setPortfolioWelcomeDismissed] = useState(
    () => getAppRoute() !== 'home',
  )
  const prevAppRouteRef = useRef(appRoute)
  const [welcomeEntered, setWelcomeEntered] = useState(false)
  const [welcomeClosing, setWelcomeClosing] = useState(false)

  const beginWelcomeDismiss = useCallback(() => {
    setWelcomeClosing(true)
  }, [])

  const onWelcomePanelTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return
      if (e.propertyName !== 'opacity') return
      if (!welcomeClosing) return
      setPortfolioWelcomeDismissed(true)
    },
    [welcomeClosing],
  )

  useEffect(() => {
    const sync = () => setAppRoute(getAppRoute())
    window.addEventListener('popstate', sync)
    const unsub = subscribeAppRoute((route) => setAppRoute(route))
    return () => {
      window.removeEventListener('popstate', sync)
      unsub()
    }
  }, [])

  useLayoutEffect(() => {
    const prev = prevAppRouteRef.current
    prevAppRouteRef.current = appRoute
    if (appRoute === 'home' && prev !== 'home') {
      setPortfolioWelcomeDismissed(false)
      setWelcomeClosing(false)
      setWelcomeEntered(false)
    }
  }, [appRoute])

  useEffect(() => {
    if (portfolioWelcomeDismissed || appRoute !== 'home') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [portfolioWelcomeDismissed, appRoute])

  useEffect(() => {
    if (portfolioWelcomeDismissed || appRoute !== 'home' || welcomeClosing) return
    const ms = prefersReducedMotion() ? 1600 : 4200
    const id = window.setTimeout(beginWelcomeDismiss, ms)
    return () => window.clearTimeout(id)
  }, [portfolioWelcomeDismissed, appRoute, welcomeClosing, beginWelcomeDismiss])

  useEffect(() => {
    if (portfolioWelcomeDismissed || appRoute !== 'home') return
    if (prefersReducedMotion()) {
      setWelcomeEntered(true)
      return
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setWelcomeEntered(true))
    })
    return () => cancelAnimationFrame(id)
  }, [portfolioWelcomeDismissed, appRoute])

  useEffect(() => {
    if (portfolioWelcomeDismissed || appRoute !== 'home' || welcomeClosing) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') beginWelcomeDismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [portfolioWelcomeDismissed, appRoute, welcomeClosing, beginWelcomeDismiss])

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      setGlow({ x: e.clientX, y: e.clientY })
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    if (!selectedSkill) {
      setSkillModalVisible(false)
      return
    }
    if (prefersReducedMotion()) {
      setSkillModalVisible(true)
    } else {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setSkillModalVisible(true))
      })
      return () => cancelAnimationFrame(id)
    }
  }, [selectedSkill])

  const closeSkillModal = useCallback(() => {
    if (!selectedSkill) return
    setSkillModalVisible(false)
    if (prefersReducedMotion()) {
      setSelectedSkill(null)
    }
  }, [selectedSkill])

  useEffect(() => {
    if (!selectedSkill) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') closeSkillModal()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [selectedSkill, closeSkillModal])

  const onSkillModalOverlayTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    if (e.propertyName !== 'opacity') return
    if (!skillModalVisible) setSelectedSkill(null)
  }

  if (appRoute === 'projects') {
    return <ProjectsPage />
  }

  if (appRoute === 'about') {
    return <AboutPage />
  }

  return (
    <>
      {!portfolioWelcomeDismissed ? (
        <div
          className={`portfolio-welcome-overlay fixed inset-0 z-[300] flex flex-col items-center justify-center px-5 py-10 sm:px-6 ${
            welcomeEntered && !welcomeClosing ? 'portfolio-welcome-overlay--shown' : ''
          } ${welcomeClosing ? 'portfolio-welcome-overlay--exit' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-welcome-title"
          aria-describedby="portfolio-welcome-desc"
        >
          <div className="portfolio-welcome-overlay__aurora" aria-hidden />
          <div className="portfolio-welcome-overlay__vignette" aria-hidden />
          <div className="portfolio-welcome-overlay__grid" aria-hidden />
          <div className="portfolio-welcome-overlay__backdrop" aria-hidden />

          <div className="portfolio-welcome-panel" onTransitionEnd={onWelcomePanelTransitionEnd}>
            <div className="portfolio-welcome-panel__edge portfolio-welcome-panel__edge--tl" aria-hidden />
            <div className="portfolio-welcome-panel__edge portfolio-welcome-panel__edge--br" aria-hidden />
            <div className="portfolio-welcome-panel__glow" aria-hidden />

            <div className="portfolio-welcome-panel__inner relative z-[1] flex flex-col items-center text-center">
              <div className="portfolio-welcome-robot-wrap" aria-hidden>
                <div className="portfolio-welcome-robot-ring" />
                <div className="portfolio-welcome-robot">
                  <div className="skill-modal-robots-layer pointer-events-none absolute inset-0 overflow-visible">
                    <div className="skill-modal-robot-solo">
                      <div className="skill-modal-robot-mover" style={WELCOME_ROBOT_STYLE}>
                        <div className="skill-modal-robot-mover-inner">
                          <SkillModalRobot3D />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="portfolio-welcome-kicker">You&apos;re here</p>
              <h2
                id="portfolio-welcome-title"
                className="portfolio-welcome-title bg-gradient-to-r from-primary via-[#5dffc4] to-secondary bg-clip-text text-transparent"
              >
                Hey there!
              </h2>
              <p
                id="portfolio-welcome-desc"
                className="portfolio-welcome-desc mt-3 max-w-[min(22rem,100%)] text-[clamp(0.92rem,calc(0.35vw+0.86rem),1.06rem)] leading-relaxed text-portfolio-muted"
              >
                Welcome to my corner of the web — I&apos;m glad you&apos;re here. Take a look around
                when you&apos;re ready.
              </p>
              <RippleBox
                role="button"
                tabIndex={0}
                aria-label="Continue to portfolio"
                className={`portfolio-welcome-cta mt-8 rounded-xl border border-primary/40 bg-primary px-[clamp(1.25rem,3.5vw,1.75rem)] py-[clamp(0.65rem,2vw,0.85rem)] text-[clamp(0.85rem,calc(0.28vw+0.8rem),0.98rem)] font-semibold uppercase tracking-[0.14em] text-[#111] shadow-[0_12px_36px_rgba(0,255,157,0.32)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(0,255,157,0.38)] ${welcomeClosing ? 'pointer-events-none opacity-60' : ''}`}
                onClick={beginWelcomeDismiss}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    beginWelcomeDismiss()
                  }
                }}
              >
                Let&apos;s go
              </RippleBox>
              <button
                type="button"
                className={`portfolio-welcome-skip mt-4 text-[0.82rem] text-portfolio-muted underline decoration-primary/45 underline-offset-[5px] transition-[color,text-decoration-color,opacity] duration-200 hover:text-primary ${welcomeClosing ? 'pointer-events-none opacity-50' : ''}`}
                onClick={beginWelcomeDismiss}
              >
                Skip intro
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="cursor-glow-dot max-md:hidden"
        style={{ left: glow.x, top: glow.y }}
        aria-hidden
      />

      <div className="page-content" aria-hidden={!portfolioWelcomeDismissed}>
        <SiteHeader active="home" />
        <div className="mx-auto max-w-[1200px] px-6 pb-28 pt-14 max-md:pb-24 max-md:pt-12">
        <main id="main-content">
        <header className="portfolio-hero-intro mb-[clamp(2.5rem,6vw,4.25rem)] overflow-x-visible max-md:mb-10">
          <div className="flex flex-col items-center gap-[clamp(1.5rem,4vw,3rem)] md:flex-row md:items-center md:gap-[clamp(2rem,4vw,3.5rem)] lg:gap-14">
            <div className="order-2 flex w-full min-w-0 flex-1 flex-col items-center text-center md:order-1 md:items-start md:text-left">
              <h1
                className="portfolio-hero-name mb-2.5 flex w-full flex-wrap justify-center text-[clamp(1.65rem,calc(5vw+0.75rem),3.5rem)] font-bold leading-[1.08] drop-shadow-[0_0_40px_rgba(0,255,157,0.5)] md:justify-start md:leading-none"
                aria-label={HERO_NAME_ARIA_LABEL}
              >
                <span className="portfolio-hero-chars" aria-hidden="true">
                  {Array.from(HERO_NAME_ARIA_LABEL).map((ch, i) => {
                    const o = heroLetterOffset(i)
                    return (
                      <span
                        key={`${i}-${ch === ' ' ? 'sp' : ch}`}
                        className="portfolio-hero-char inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                        style={
                          {
                            '--hero-from-x': o.x,
                            '--hero-from-y': o.y,
                            '--hero-char-i': i,
                          } as CSSProperties
                        }
                      >
                        {ch === ' ' ? '\u00a0' : ch}
                      </span>
                    )
                  })}
                </span>
              </h1>
              <p
                className="portfolio-hero-tagline mx-auto flex w-full max-w-[min(860px,100%)] flex-wrap justify-center text-[clamp(0.88rem,calc(0.4vw+0.82rem),1.22rem)] font-medium leading-snug text-secondary drop-shadow-[0_0_20px_rgba(0,240,255,0.4)] md:mx-0 md:max-w-[min(36rem,92vw)] md:justify-start lg:max-w-[min(40rem,94vw)]"
                aria-label={HERO_TAGLINE_TEXT}
              >
                <span className="portfolio-hero-chars portfolio-hero-chars--tagline" aria-hidden="true">
                  {HERO_TAGLINE_WORDS.map((word, wi) => {
                    const nameLen = HERO_NAME_ARIA_LABEL.length
                    const wordStart = HERO_TAGLINE_WORD_STARTS[wi] ?? 0
                    return (
                      <span key={`tw-${wi}`} className="portfolio-hero-tagline-word">
                        {Array.from(word).map((ch, i) => {
                          const charIdxInTagline = wordStart + i
                          const o = heroLetterOffset(nameLen + charIdxInTagline)
                          return (
                            <span
                              key={`t-${wi}-${i}-${ch}`}
                              className="portfolio-hero-char portfolio-hero-char--tagline inline-block"
                              style={
                                {
                                  '--hero-from-x': o.x,
                                  '--hero-from-y': o.y,
                                  '--hero-char-i': charIdxInTagline,
                                } as CSSProperties
                              }
                            >
                              {ch}
                            </span>
                          )
                        })}
                      </span>
                    )
                  })}
                </span>
              </p>
              <div className="mt-[clamp(1.25rem,3vw,1.75rem)] flex w-full max-w-[min(36rem,100%)] flex-wrap justify-center gap-3 md:justify-start">
                <RippleBox
                  role="button"
                  tabIndex={0}
                  aria-label="Learn more on the About page"
                  className="rounded-xl border border-primary/30 bg-primary px-[clamp(1.1rem,3vw,1.5rem)] py-[clamp(0.55rem,1.5vw,0.75rem)] text-[clamp(0.82rem,calc(0.25vw+0.78rem),0.95rem)] font-semibold uppercase tracking-[0.12em] text-[#111] shadow-[0_10px_28px_rgba(0,255,157,0.22)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,255,157,0.28)]"
                  onClick={() => navigate('/about')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate('/about')
                    }
                  }}
                >
                  Learn More
                </RippleBox>
                <a
                  href="mailto:Ndulukomesuli02@gmail.com"
                  className="interactive ripple relative inline-flex cursor-pointer items-center justify-center rounded-xl border border-primary/45 bg-[rgba(12,14,16,0.45)] px-[clamp(1.1rem,3vw,1.5rem)] py-[clamp(0.55rem,1.5vw,0.75rem)] text-[clamp(0.82rem,calc(0.25vw+0.78rem),0.95rem)] font-semibold uppercase tracking-[0.12em] text-primary backdrop-blur-[6px] transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10"
                  onPointerEnter={() => setBodyCursorActive(true)}
                  onPointerLeave={() => setBodyCursorActive(false)}
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="order-1 shrink-0 md:order-2 md:self-center">
              <img
                src={mesuliImage}
                alt="Mesuli Nduluko"
                width={640}
                height={640}
                sizes="(max-width: 768px) min(92vw, 280px), 320px"
                decoding="async"
                fetchPriority="high"
                className="aspect-square h-auto w-[min(92vw,min(280px,85vw))] rounded-full border-2 border-primary/45 object-cover object-center shadow-[0_0_36px_rgba(0,255,157,0.35),0_0_24px_rgba(0,240,255,0.15)] ring-2 ring-secondary/20 sm:w-[min(88vw,300px)] md:w-72 lg:w-80 transform-gpu"
              />
            </div>
          </div>
        </header>

        <div className="mt-[clamp(2.25rem,5vw,3.75rem)] grid gap-[clamp(1.5rem,4vw,2.5rem)] lg:grid-cols-2 lg:items-start lg:gap-x-[clamp(1.75rem,4vw,2.75rem)]">
          <section
            className="rounded-[var(--card-radius)] border border-primary/20 bg-[rgba(12,16,14,0.42)] p-[clamp(1.15rem,3.2vw,1.85rem)] shadow-[inset_0_1px_0_rgba(0,255,157,0.06)] backdrop-blur-[10px]"
            aria-labelledby="technologies-heading"
          >
            <h2
              id="technologies-heading"
              className="mb-2 flex items-center justify-center gap-3 text-center text-[var(--text-section-title)] text-primary lg:justify-start lg:text-left"
            >
              <i className="fas fa-code" aria-hidden />
              Technologies
            </h2>
            <p className="mx-auto mb-6 max-w-[min(640px,100%)] text-center text-[var(--text-lede)] leading-relaxed text-portfolio-muted lg:mx-0 lg:text-left">
              Languages, libraries, and data tools I use to build and ship web software.
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              {TECHNOLOGIES.map((skill) => (
                <SkillChipButton
                  key={skill.name}
                  skill={skill}
                  isSelected={selectedSkill?.name === skill.name}
                  onSelect={setSelectedSkill}
                />
              ))}
            </div>
          </section>

          <section
            className="rounded-[var(--card-radius)] border border-primary/20 bg-[rgba(12,16,14,0.42)] p-[clamp(1.15rem,3.2vw,1.85rem)] shadow-[inset_0_1px_0_rgba(0,255,157,0.06)] backdrop-blur-[10px]"
            aria-labelledby="skills-heading"
          >
            <h2
              id="skills-heading"
              className="mb-2 flex items-center justify-center gap-3 text-center text-[var(--text-section-title)] text-primary lg:justify-start lg:text-left"
            >
              <i className="fas fa-screwdriver-wrench" aria-hidden />
              Skills
            </h2>
            <p className="mx-auto mb-6 max-w-[min(640px,100%)] text-center text-[var(--text-lede)] leading-relaxed text-portfolio-muted lg:mx-0 lg:text-left">
              Systems administration and hardware work I rely on for IT support and client setups.
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              {IT_SKILLS.map((skill) => (
                <SkillChipButton
                  key={skill.name}
                  skill={skill}
                  isSelected={selectedSkill?.name === skill.name}
                  onSelect={setSelectedSkill}
                />
              ))}
            </div>
          </section>
        </div>

        <section
          className="mx-auto mt-[clamp(2.5rem,6vw,3.75rem)] max-w-[min(52rem,100%)] px-[clamp(0.25rem,1.5vw,0.5rem)]"
          aria-labelledby="projects-section-title"
        >
          <a
            id="projects-section-title"
            href={hrefTo('projects')}
            className="projects-cta group"
            onClick={(e) => {
              e.preventDefault()
              navigate('/projects')
            }}
          >
            <span className="projects-cta__pulse" aria-hidden />
            <span className="projects-cta__panel">
              <span className="projects-cta__icon-wrap">
                <i className="fas fa-folder-open projects-cta__icon" aria-hidden />
              </span>
              <span className="projects-cta__text">
                <span className="projects-cta__title">Projects</span>
                <span className="projects-cta__sub">Featured work &amp; builds</span>
                <span className="projects-cta__hint">
                  <kbd>Click</kbd> or tap to open the full gallery
                </span>
              </span>
              <span className="projects-cta__chevron" aria-hidden>
                <i className="fas fa-arrow-right" />
              </span>
            </span>
            <span className="sr-only">View all projects on a dedicated page</span>
          </a>
        </section>
        </main>
        </div>
      </div>

      {selectedSkill ? (
        <div
          className={`fixed inset-0 z-[200] flex items-end justify-center p-[clamp(0.65rem,2.5vw,1rem)] pb-[clamp(1.75rem,5vw,2.5rem)] sm:items-center sm:p-4 sm:pb-4 transition-opacity ease-out motion-reduce:transition-none ${
            skillModalVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
          style={{ transitionDuration: `${SKILL_MODAL_MS}ms` }}
          onTransitionEnd={onSkillModalOverlayTransitionEnd}
        >
          <div
            className="skill-modal-tech-photo-bg pointer-events-none absolute inset-0 z-0 overflow-hidden"
            style={{ backgroundImage: `url(${skillTechModalBg})` }}
            aria-hidden
          />
          <button
            type="button"
            className="absolute inset-0 z-[1] bg-black/45 backdrop-blur-[3px]"
            aria-label="Close skill description"
            onClick={closeSkillModal}
          />
          <div
            className="skill-modal-robots-layer pointer-events-none absolute inset-0 z-[1] overflow-hidden"
            aria-hidden
          >
            <div className="skill-modal-robot-solo">
              <div className="skill-modal-robot-mover" style={SKILL_MODAL_ROBOT_MARQUEE_STYLE}>
                <div className="skill-modal-robot-mover-inner">
                  <SkillModalRobot3D />
                </div>
              </div>
            </div>
          </div>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-dialog-title"
            className={`relative z-[2] max-h-[min(85vh,520px)] w-full max-w-[min(32rem,calc(100vw-1rem))] overflow-y-auto rounded-2xl border border-primary/40 bg-[rgba(12,14,18,0.92)] p-[clamp(1rem,3vw,1.5rem)] shadow-[0_0_48px_rgba(0,255,157,0.18),0_24px_48px_rgba(0,0,0,0.55)] backdrop-blur-[18px] transition-[transform] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
              skillModalVisible ? 'translate-y-0 scale-100' : 'translate-y-5 scale-[0.97]'
            }`}
            style={{ transitionDuration: `${SKILL_MODAL_MS}ms` }}
          >
            <button
              type="button"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 text-portfolio-muted transition-colors hover:border-primary hover:text-primary"
              aria-label="Close"
              onClick={closeSkillModal}
            >
              <i className="fas fa-times" aria-hidden />
            </button>
            <div key={selectedSkill.name} className="skill-modal-content-swap">
              <h3
                id="skill-dialog-title"
                className="flex items-center gap-3 pr-12 text-xl font-semibold text-primary"
              >
                <i
                  className={`${selectedSkill.iconClass} text-[1.65rem] leading-none text-primary`}
                  aria-hidden
                />
                {selectedSkill.name}
              </h3>
              <p className="mt-4 leading-relaxed text-portfolio-text">{selectedSkill.description}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="fixed bottom-6 right-6 z-[100] max-w-[min(100vw-1rem,420px)] rounded-2xl border border-primary bg-[rgba(10,10,10,0.93)] px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.65rem,2.5vw,1.1rem)] text-[clamp(0.82rem,calc(0.28vw+0.78rem),0.97rem)] leading-[2] shadow-[0_15px_35px_rgba(0,255,157,0.25)] backdrop-blur-[14px] transition-all duration-[180ms] ease-in-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,255,157,0.3)] max-md:relative max-md:bottom-auto max-md:right-auto max-md:mx-auto max-md:mt-12 max-md:max-w-[min(360px,92vw)] max-md:text-center max-md:leading-relaxed"
        aria-hidden={!portfolioWelcomeDismissed}
      >
        <span className="inline-flex items-center gap-1.5">
          <i className="fas fa-envelope" aria-hidden />
          <a
            href="mailto:Ndulukomesuli02@gmail.com"
            className="link-cyber"
            onPointerEnter={() => setBodyCursorActive(true)}
            onPointerLeave={() => setBodyCursorActive(false)}
          >
            Ndulukomesuli02@gmail.com | {'  '}
          </a>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="fas fa-phone" aria-hidden />
          <a
            href="tel:0742298511"
            className="link-cyber"
            onPointerEnter={() => setBodyCursorActive(true)}
            onPointerLeave={() => setBodyCursorActive(false)}
          >
            074 229 8511 |{' '}
          </a>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="fab fa-github" aria-hidden />
          <a
            href="https://github.com/MesuliN"
            target="_blank"
            rel="noreferrer"
            className="link-cyber"
            onPointerEnter={() => setBodyCursorActive(true)}
            onPointerLeave={() => setBodyCursorActive(false)}
          >
            GitHub: MesuliN | {' '}
          </a>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="fab fa-linkedin" aria-hidden />
          <a
            href="https://www.linkedin.com/in/mesuli-nduluko-4a406027a"
            target="_blank"
            rel="noreferrer"
            className="link-cyber"
            onPointerEnter={() => setBodyCursorActive(true)}
            onPointerLeave={() => setBodyCursorActive(false)}
          >
            LinkedIn
          </a>
        </span>
      </div>
    </>
  )
}
