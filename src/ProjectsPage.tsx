import { useEffect, useLayoutEffect, useState } from 'react'
import { ProjectCard } from './ProjectCard'
import { ProjectsGalaxyCanvas } from './ProjectsGalaxyCanvas'
import { PROJECTS } from './projectsData'
import { SERVICES } from './servicesData'
import { setBodyCursorActive } from './RippleBox'

const DOC_TITLE = 'Mesuli Nduluko — Projects'
/** Scroll depth (0–1) past which the forest theme turns on — halfway down the page */
const THEME_ENTER_SCROLL_PROGRESS = 0.5
/**
 * When scrolling back up, theme turns off below this fraction — slightly below
 * {@link THEME_ENTER_SCROLL_PROGRESS} so the boundary does not flicker.
 */
const THEME_EXIT_SCROLL_PROGRESS = 0.46

export default function ProjectsPage() {
  const [bottomZone, setBottomZone] = useState(false)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const prev = document.title
    document.title = DOC_TITLE
    return () => {
      document.title = prev
    }
  }, [])

  useEffect(() => {
    let raf = 0

    const apply = () => {
      raf = 0
      const root = document.documentElement
      const maxY = Math.max(0, root.scrollHeight - window.innerHeight)
      const progress = maxY === 0 ? 0 : window.scrollY / maxY

      setBottomZone((prev) => {
        if (prev) {
          if (progress < THEME_EXIT_SCROLL_PROGRESS) return false
          return true
        }
        if (progress >= THEME_ENTER_SCROLL_PROGRESS) return true
        return false
      })
    }

    const schedule = () => {
      if (raf === 0) raf = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf !== 0) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className={`projects-page${bottomZone ? ' projects-page--bottom-zone' : ''}`}>
      <div className="projects-page__galaxy" aria-hidden>
        <ProjectsGalaxyCanvas />
      </div>
      <div className="projects-page__dev-matrix" aria-hidden />
      <div className="projects-page__shell">
      <nav className="projects-page__nav" aria-label="Projects section">
        <a
          href="#/"
          className="projects-page__back"
          onPointerEnter={() => setBodyCursorActive(true)}
          onPointerLeave={() => setBodyCursorActive(false)}
        >
          <i className="fas fa-arrow-left" aria-hidden />
          Back to portfolio
        </a>
        <span className="projects-page__nav-right">
          <a
            href="#projects-services"
            className="projects-page__nav-anchor"
            onPointerEnter={() => setBodyCursorActive(true)}
            onPointerLeave={() => setBodyCursorActive(false)}
          >
            Services
          </a>
          <span className="projects-page__nav-meta">
            <i className="fas fa-code-branch" aria-hidden />
            featured work
          </span>
        </span>
      </nav>

      <div className="projects-page__code-rail" aria-hidden>
        <div className="projects-page__code-rail-track">
          <span className="projects-page__code-rail-seg">
            ~/mesuli/portfolio <span className="projects-page__code-rail-muted">·</span> git (main){' '}
            <span className="projects-page__code-rail-muted">·</span> ls ./projects
          </span>
          <span className="projects-page__code-rail-seg" aria-hidden>
            ~/mesuli/portfolio <span className="projects-page__code-rail-muted">·</span> git (main){' '}
            <span className="projects-page__code-rail-muted">·</span> ls ./projects
          </span>
        </div>
      </div>

      <header className="projects-page__hero">
        <p className="projects-page__eyebrow">
          <i className="fas fa-terminal projects-page__eyebrow-icon" aria-hidden />
          Selected builds &amp; contributions
        </p>
        <h1 className="projects-page__title">
          <span className="projects-page__title-glow">Projects</span>
        </h1>
        <p className="projects-page__lede">
          Apps I have designed and shipped—focused on clear UX, solid front-end structure, and
          dependable delivery.
        </p>
      </header>

      <div className="projects-page__work" id="projects-work">
        <h2 className="projects-page__work-title">Selected projects</h2>
        <p className="projects-page__work-lede">
          A sample of builds and contributions—each card opens the live site or repo where
          available.
        </p>
      </div>

      <div className="projects-page__grid">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} project={p} enterIndex={i} />
        ))}
      </div>

      <section
        className="projects-page__services"
        id="projects-services"
        aria-labelledby="projects-services-title"
      >
        <div className="projects-page__services-inner">
          <h2 id="projects-services-title" className="projects-page__services-title">
            <i className="fas fa-tools" aria-hidden />
            My Services
          </h2>
          <p className="projects-page__services-lede">
            Here is what I offer clients and teams who need development, training, or hands-on IT
            support. Each area is something I deliver end to end—from first conversation through
            delivery and follow-up.
          </p>
          <div className="projects-page__services-grid">
            {SERVICES.map((service) => (
              <article key={service.label} className="projects-page__service-card">
                <header className="projects-page__service-head">
                  <span className="projects-page__service-icon" aria-hidden>
                    <i className={`fas ${service.icon}`} />
                  </span>
                  <div>
                    <h3 className="projects-page__service-name">{service.label}</h3>
                    <p className="projects-page__service-tagline">{service.tagline}</p>
                  </div>
                </header>
                <p className="projects-page__service-body">{service.body}</p>
                <h4 className="projects-page__service-includes-heading">What you can expect</h4>
                <ul className="projects-page__service-list">
                  {service.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="projects-page__services-foot">
            Ready to talk scope, timeline, or pricing?{' '}
            <a
              href="#/"
              className="projects-page__services-foot-link"
              onPointerEnter={() => setBodyCursorActive(true)}
              onPointerLeave={() => setBodyCursorActive(false)}
            >
              Go back to the main portfolio
            </a>{' '}
            for email, phone, and social links.
          </p>
        </div>
      </section>

      <footer className="projects-page__footer">
        <a
          href="#/"
          className="projects-page__footer-link"
          onPointerEnter={() => setBodyCursorActive(true)}
          onPointerLeave={() => setBodyCursorActive(false)}
        >
          Return to full portfolio
        </a>
      </footer>
      </div>
    </div>
  )
}
