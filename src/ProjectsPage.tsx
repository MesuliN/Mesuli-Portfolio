import { useEffect, useLayoutEffect, useState } from 'react'
import { ProjectCard } from './ProjectCard'
import { ProjectsGalaxyCanvas } from './ProjectsGalaxyCanvas'
import { PROJECTS } from './projectsData'
import { hrefTo, navigate } from './appRoute'
import { SiteHeader } from './SiteHeader'
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
      <SiteHeader
        active="projects"
        className="projects-page__site-header"
        trailing={
          <>
            <a
              href={`${hrefTo('about')}?section=services`}
              className="projects-page__nav-anchor"
              onClick={(e) => {
                e.preventDefault()
                navigate('/about?section=services')
              }}
              onPointerEnter={() => setBodyCursorActive(true)}
              onPointerLeave={() => setBodyCursorActive(false)}
            >
              Services
            </a>
            <span className="projects-page__nav-meta">
              <i className="fas fa-code-branch" aria-hidden />
              featured work
            </span>
          </>
        }
      />

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

      <footer className="projects-page__footer">
        <a
          href={hrefTo('home')}
          className="projects-page__footer-link"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
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
