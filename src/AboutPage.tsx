import { useEffect, useLayoutEffect, useState } from 'react'
import mesuliImage from './assets/Mesuli Image.jpg'
import { SERVICES } from './servicesData'
import { hrefTo, navigate } from './appRoute'
import { AboutCockpitCanvas } from './AboutCockpitCanvas'
import { SiteHeader } from './SiteHeader'
import { setBodyCursorActive } from './RippleBox'

const DOC_TITLE = 'Mesuli Nduluko — About'
/** Past this scroll fraction (0–1), match Projects “forest” light/dark green theme */
const THEME_ENTER_SCROLL_PROGRESS = 0.5
/** Hysteresis so the boundary does not flicker when scrolling near halfway */
const THEME_EXIT_SCROLL_PROGRESS = 0.46

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function AboutPage() {
  const [bottomZone, setBottomZone] = useState(false)

  const scrollToServicesIfRequested = () => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('section') === 'services') {
      requestAnimationFrame(() => {
        document.getElementById('about-services')?.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start',
        })
      })
      return true
    }
    return false
  }

  useLayoutEffect(() => {
    if (!scrollToServicesIfRequested()) {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    const onNav = () => scrollToServicesIfRequested()
    window.addEventListener('popstate', onNav)
    window.addEventListener('appnavigate', onNav)
    return () => {
      window.removeEventListener('popstate', onNav)
      window.removeEventListener('appnavigate', onNav)
    }
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
    <div
      className={`projects-page about-page about-page--spaceship${bottomZone ? ' projects-page--bottom-zone' : ''}`}
    >
      <AboutCockpitCanvas />
      <div className="projects-page__dev-matrix" aria-hidden />
      <div className="projects-page__shell">
        <div className="about-page__shell-inner">
          <SiteHeader active="about" className="projects-page__site-header" />

          <header className="projects-page__hero">
            <p className="projects-page__eyebrow">
              <i className="fas fa-rocket projects-page__eyebrow-icon" aria-hidden />
              Crew profile
            </p>
            <h1 className="projects-page__title">
              <span className="projects-page__title-glow">About me</span>
            </h1>
            <p className="projects-page__lede md:hidden">
              Developer &amp; IT support—clear communication, reliable systems after launch.
            </p>
            <p className="projects-page__lede hidden md:block">
              Developer and IT support—focused on clear communication, solid delivery, and systems that
              stay reliable after launch.
            </p>
          </header>

          <div className="about-page__panel p-6 sm:p-8">
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12">
              <div className="mx-auto shrink-0 md:mx-0">
                <img
                  src={mesuliImage}
                  alt="Mesuli Nduluko"
                  width={400}
                  height={400}
                  className="about-page__portrait aspect-square h-auto w-[min(88vw,260px)] max-[374px]:max-w-[min(15rem,calc(100vw-2.25rem))] rounded-full object-cover object-center md:w-64"
                  decoding="async"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-6">
                <h2 className="about-page__section-title justify-center md:justify-start">
                  <i className="fas fa-user" aria-hidden />
                  Who I am
                </h2>
                <p className="about-page__copy md:hidden">
                  I build responsive sites and web apps with modern front-end and solid back-end
                  integration—fast, user-focused, and built for real-world use.
                </p>
                <p className="about-page__copy hidden md:block">
                  I am a website developer and software developer with a strong focus on creating clean,
                  responsive websites and practical web applications. My work combines modern front-end
                  development with reliable back-end integration to deliver solutions that are fast,
                  user-focused, and built for real-world results.
                </p>
                <p className="about-page__copy md:hidden">
                  I also offer IT support: setup, Windows installs, troubleshooting, and training—from
                  first build through day-to-day operations.
                </p>
                <p className="about-page__copy hidden md:block">
                  Alongside development, I provide IT support services including system setup, Windows
                  installation, troubleshooting, and user training. This combination allows me to support
                  clients from planning and development through day-to-day technical operations.
                </p>
                <p className="about-page__copy-muted about-page__border-copy pt-6 md:hidden">
                  <a
                    href={hrefTo('projects')}
                    className="projects-page__services-foot-link"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/projects')
                    }}
                    onPointerEnter={() => setBodyCursorActive(true)}
                    onPointerLeave={() => setBodyCursorActive(false)}
                  >
                    Projects
                  </a>{' '}
                  for samples,{' '}
                  <a
                    href={hrefTo('home')}
                    className="projects-page__services-foot-link"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/')
                    }}
                    onPointerEnter={() => setBodyCursorActive(true)}
                    onPointerLeave={() => setBodyCursorActive(false)}
                  >
                    Home
                  </a>{' '}
                  for contact.
                </p>
                <p className="about-page__copy-muted about-page__border-copy hidden pt-6 md:block">
                  Want to see work samples?{' '}
                  <a
                    href={hrefTo('projects')}
                    className="projects-page__services-foot-link"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/projects')
                    }}
                    onPointerEnter={() => setBodyCursorActive(true)}
                    onPointerLeave={() => setBodyCursorActive(false)}
                  >
                    View the projects page
                  </a>
                  , or{' '}
                  <a
                    href={hrefTo('home')}
                    className="projects-page__services-foot-link"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/')
                    }}
                    onPointerEnter={() => setBodyCursorActive(true)}
                    onPointerLeave={() => setBodyCursorActive(false)}
                  >
                    return to the home page
                  </a>{' '}
                  for contact details.
                </p>
              </div>
            </div>

            <section className="about-page__border-services mt-10 pt-10" id="about-services"
              aria-labelledby="about-services-title"
            >
              <div className="projects-page__services-inner !pt-0 !max-w-none">
                <h2 id="about-services-title" className="projects-page__services-title">
                  <i className="fas fa-tools" aria-hidden />
                  My Services
                </h2>
                <p className="projects-page__services-lede md:hidden">
                  Development, training, and IT support—delivered end to end from first chat to follow-up.
                </p>
                <p className="projects-page__services-lede hidden md:block">
                  Skills and services I offer to businesses and teams: development, training, and
                  hands-on IT support. Each area is something I deliver end to end—from first conversation
                  through delivery and follow-up.
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
                      <p className="projects-page__service-body md:hidden">{service.bodyShort}</p>
                      <p className="projects-page__service-body hidden md:block">{service.body}</p>
                      <h4 className="projects-page__service-includes-heading">What you can expect</h4>
                      <ul className="projects-page__service-list md:hidden">
                        {service.includesShort.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <ul className="projects-page__service-list hidden md:block">
                        {service.includes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
                <p className="projects-page__services-foot md:hidden">
                  Questions?{' '}
                  <a
                    href={hrefTo('home')}
                    className="projects-page__services-foot-link"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/')
                    }}
                    onPointerEnter={() => setBodyCursorActive(true)}
                    onPointerLeave={() => setBodyCursorActive(false)}
                  >
                    Home
                  </a>{' '}
                  has email, phone, and social links.
                </p>
                <p className="projects-page__services-foot hidden md:block">
                  Ready to talk scope, timeline, or pricing?{' '}
                  <a
                    href={hrefTo('home')}
                    className="projects-page__services-foot-link"
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/')
                    }}
                    onPointerEnter={() => setBodyCursorActive(true)}
                    onPointerLeave={() => setBodyCursorActive(false)}
                  >
                    Go to the home page
                  </a>{' '}
                  for email, phone, and social links.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
