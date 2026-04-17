import { useEffect, useState, type CSSProperties } from 'react'
import mesuliImage from './assets/Mesuli Image.jpg'
import skillTechModalBg from './assets/skill-tech-modal-bg.png'
import { getHashRoute } from './hashRoute'
import ProjectsPage from './ProjectsPage'
import { RippleBox, setBodyCursorActive } from './RippleBox'
import { SERVICES } from './servicesData'

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

/** Home “My Services” chips: fly in from four viewport corners (order matches SERVICES). */
const MY_SERVICES_ENTRANCE_FROM: readonly { x: string; y: string }[] = [
  { x: '-48vmin', y: '-44vmin' },
  { x: '48vmin', y: '-44vmin' },
  { x: '-48vmin', y: '44vmin' },
  { x: '48vmin', y: '44vmin' },
]

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

/** IT operations and hands-on hardware work */
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
      className="group flex items-center gap-2.5 rounded-full border border-primary/35 bg-primary/10 px-5 py-2.5 text-base text-primary transition-all duration-[180ms] ease-in-out hover:-translate-y-0.5 hover:scale-[1.04] hover:bg-primary hover:text-[#111] hover:shadow-[0_10px_20px_rgba(0,255,157,0.2)]"
      onClick={() => onSelect(skill)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(skill)
        }
      }}
    >
      <i
        className={`${skill.iconClass} text-[1.35rem] leading-none transition-colors duration-[180ms] group-hover:text-[#111]`}
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

export default function Portfolio() {
  const [glow, setGlow] = useState({ x: 0, y: 0 })
  const [selectedSkill, setSelectedSkill] = useState<SkillChip | null>(null)
  const [hashRoute, setHashRoute] = useState(() => getHashRoute())

  useEffect(() => {
    const sync = () => setHashRoute(getHashRoute())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      setGlow({ x: e.clientX, y: e.clientY })
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    if (!selectedSkill) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSkill(null)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [selectedSkill])

  if (hashRoute === 'projects') {
    return <ProjectsPage />
  }

  return (
    <>
      <div
        className="cursor-glow-dot max-md:hidden"
        style={{ left: glow.x, top: glow.y }}
        aria-hidden
      />

      <div className="mx-auto max-w-[1200px] px-6 pb-28 pt-14 max-md:pb-24 max-md:pt-12">
        <header className="portfolio-hero-intro mb-[68px] overflow-x-clip max-md:mb-10">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-10 lg:gap-12">
            <div className="shrink-0 md:self-center">
              <img
                src={mesuliImage}
                alt="Mesuli Nduluko"
                width={640}
                height={640}
                sizes="(max-width: 768px) min(92vw, 280px), 320px"
                decoding="async"
                fetchPriority="high"
                className="aspect-square h-auto w-[min(92vw,280px)] rounded-full border-2 border-primary/45 object-cover object-center shadow-[0_0_36px_rgba(0,255,157,0.35),0_0_24px_rgba(0,240,255,0.15)] ring-2 ring-secondary/20 md:w-72 lg:w-80 transform-gpu"
              />
            </div>
            <div className="flex w-full min-w-0 flex-1 flex-col items-center text-center md:items-start md:text-left">
              <h1
                className="portfolio-hero-name mb-2.5 flex w-full flex-wrap justify-center text-[2.6rem] font-bold leading-tight drop-shadow-[0_0_40px_rgba(0,255,157,0.5)] md:justify-start md:text-[3.5rem] md:leading-none"
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
                className="portfolio-hero-tagline mx-auto flex w-full max-w-[860px] flex-wrap justify-center text-[1.2rem] font-medium text-secondary drop-shadow-[0_0_20px_rgba(0,240,255,0.4)] md:mx-0 md:max-w-[36rem] md:justify-start lg:max-w-[40rem]"
                aria-label={HERO_TAGLINE_TEXT}
              >
                <span className="portfolio-hero-chars" aria-hidden="true">
                  {Array.from(HERO_TAGLINE_TEXT).map((ch, i) => {
                    const nameLen = HERO_NAME_ARIA_LABEL.length
                    const o = heroLetterOffset(nameLen + i)
                    return (
                      <span
                        key={`t-${i}-${ch === ' ' ? 'sp' : ch}`}
                        className="portfolio-hero-char portfolio-hero-char--tagline inline-block"
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
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 items-stretch gap-[25px] md:grid-cols-2 md:gap-[35px]">
          <RippleBox
            className="mb-10 rounded-[20px] border border-primary/25 bg-[rgba(20,20,20,0.7)] p-8 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-[14px] transition-all duration-[280ms] ease-in-out hover:-translate-y-1.5 hover:scale-[1.01] hover:border-primary hover:shadow-[0_18px_36px_rgba(0,255,157,0.16)] max-md:mb-6"
          >
            <h2 className="mb-5 flex items-center gap-3 text-[1.7rem] text-primary">
              <i className="fas fa-user" aria-hidden />
              About Me
            </h2>
            <p className="text-portfolio-text">
              I am a website developer and software developer with a strong focus on creating clean, responsive
              websites and practical web applications. My work combines modern front-end development
              with reliable back-end integration to deliver solutions that are fast, user-focused, and
              built for real-world results.
            </p>
            <p className="mt-4 text-portfolio-text">
              Alongside development, I provide IT support services including system setup, Windows
              installation, troubleshooting, and user training. This combination allows me to support
              clients from planning and development through day-to-day technical operations.
            </p>
          </RippleBox>

          <RippleBox
            className="mb-10 rounded-[20px] border border-primary/25 bg-[rgba(20,20,20,0.7)] p-8 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-[14px] transition-all duration-[280ms] ease-in-out hover:-translate-y-1.5 hover:scale-[1.01] hover:border-primary hover:shadow-[0_18px_36px_rgba(0,255,157,0.16)] max-md:mb-6"
          >
            <h2 className="mb-5 flex items-center gap-3 text-[1.7rem] text-primary">
              <i className="fas fa-tools" aria-hidden />
              My Services
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
              {SERVICES.map((s, i) => {
                const corner = MY_SERVICES_ENTRANCE_FROM[i % MY_SERVICES_ENTRANCE_FROM.length]!
                return (
                  <RippleBox
                    key={s.label}
                    className="home-service-card-enter group flex items-center gap-3.5 rounded-[14px] border border-primary/[0.18] bg-white/[0.06] px-5 py-[18px] text-[1.05rem] font-semibold text-portfolio-text transition-all duration-[180ms] ease-in-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-gradient-to-br hover:from-primary hover:to-[#00cc7a] hover:text-[#111] hover:shadow-[0_12px_25px_rgba(0,255,157,0.3)]"
                    style={
                      {
                        '--svc-from-x': corner.x,
                        '--svc-from-y': corner.y,
                        '--svc-enter-i': i,
                      } as CSSProperties
                    }
                  >
                    <i
                      className={`fas ${s.icon} text-[1.7rem] text-primary transition-colors duration-[180ms] group-hover:text-[#0b1813]`}
                      aria-hidden
                    />
                    {s.label}
                  </RippleBox>
                )
              })}
            </div>
          </RippleBox>
        </div>

        <div className="mt-[50px] space-y-12">
          <section aria-labelledby="technologies-heading">
            <h2
              id="technologies-heading"
              className="mb-2 flex items-center justify-center gap-3 text-center text-[1.8rem] text-primary"
            >
              <i className="fas fa-code" aria-hidden />
              Technologies
            </h2>
            <p className="mx-auto mb-6 max-w-[640px] text-center text-[0.98rem] leading-relaxed text-portfolio-muted">
              Languages, libraries, and data tools I use to build and ship web software.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
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

          <section aria-labelledby="skills-heading">
            <h2
              id="skills-heading"
              className="mb-2 flex items-center justify-center gap-3 text-center text-[1.8rem] text-primary"
            >
              <i className="fas fa-screwdriver-wrench" aria-hidden />
              Skills
            </h2>
            <p className="mx-auto mb-6 max-w-[640px] text-center text-[0.98rem] leading-relaxed text-portfolio-muted">
              Systems administration and hardware work I rely on for IT support and client setups.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
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

        <section className="mt-[60px] px-2" aria-labelledby="projects-section-title">
          <a id="projects-section-title" href="#/projects" className="projects-cta group">
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
      </div>

      {selectedSkill ? (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 pb-10 sm:items-center sm:pb-4">
          <div
            className="skill-modal-tech-photo-bg pointer-events-none absolute inset-0 z-0 overflow-hidden"
            style={{ backgroundImage: `url(${skillTechModalBg})` }}
            aria-hidden
          />
          <button
            type="button"
            className="absolute inset-0 z-[1] bg-black/45 backdrop-blur-[3px]"
            aria-label="Close skill description"
            onClick={() => setSelectedSkill(null)}
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
            className="relative z-[2] max-h-[min(85vh,520px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-primary/40 bg-[rgba(12,14,18,0.92)] p-6 shadow-[0_0_48px_rgba(0,255,157,0.18),0_24px_48px_rgba(0,0,0,0.55)] backdrop-blur-[18px]"
          >
            <button
              type="button"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 text-portfolio-muted transition-colors hover:border-primary hover:text-primary"
              aria-label="Close"
              onClick={() => setSelectedSkill(null)}
            >
              <i className="fas fa-times" aria-hidden />
            </button>
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
      ) : null}

      <div
        className="fixed bottom-6 right-6 z-[100] rounded-2xl border border-primary bg-[rgba(10,10,10,0.93)] px-6 py-[18px] text-[0.97rem] leading-[2] shadow-[0_15px_35px_rgba(0,255,157,0.25)] backdrop-blur-[14px] transition-all duration-[180ms] ease-in-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,255,157,0.3)] max-md:relative max-md:bottom-auto max-md:right-auto max-md:mx-auto max-md:mt-12 max-md:max-w-[360px] max-md:text-center"
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
