import { useEffect } from 'react'
import { ProjectCard } from './ProjectCard'
import { PROJECTS } from './projectsData'
import { SERVICES } from './servicesData'
import { setBodyCursorActive } from './RippleBox'

const DOC_TITLE = 'Mesuli Nduluko — Projects'

export default function ProjectsPage() {
  useEffect(() => {
    const prev = document.title
    document.title = DOC_TITLE
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="projects-page">
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

      <header className="projects-page__hero">
        <p className="projects-page__eyebrow">Selected builds &amp; contributions</p>
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
  )
}
