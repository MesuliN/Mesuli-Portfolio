import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ProjectCard } from './ProjectCard'
import { ProjectsGalaxyCanvas } from './ProjectsGalaxyCanvas'
import {
  POSTER_DESIGNS,
  PROJECTS,
  SHORT_ADVERT,
  SHORT_ADVERT_VIDEO_SRC,
  type PosterDesign,
} from './projectsData'
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

function PosterDesignCard({
  poster,
  index,
  onOpen,
}: {
  poster: PosterDesign
  index: number
  onOpen?: () => void
}) {
  const canOpen = Boolean(poster.imageSrc && onOpen)
  return (
    <figure
      className="projects-page__poster-card"
      style={{ '--poster-card-stagger': `${index * 70}ms` } as CSSProperties}
    >
      <div
        className={`projects-page__poster-frame ${canOpen ? 'projects-page__poster-frame--zoomable' : ''}`}
        role={canOpen ? 'button' : undefined}
        tabIndex={canOpen ? 0 : undefined}
        aria-label={canOpen ? `View ${poster.title} full size` : undefined}
        aria-haspopup="dialog"
        onClick={canOpen ? onOpen : undefined}
        onKeyDown={
          canOpen
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOpen?.()
                }
              }
            : undefined
        }
      >
        {poster.imageSrc ? (
          <img
            src={poster.imageSrc}
            alt=""
            className="projects-page__poster-img"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="projects-page__poster-placeholder" aria-hidden>
            <i className="fas fa-image" />
          </div>
        )}
      </div>
      <figcaption className="projects-page__poster-caption">
        <span className="projects-page__poster-title">{poster.title}</span>
        <span className="projects-page__poster-desc">{poster.description}</span>
      </figcaption>
    </figure>
  )
}

export default function ProjectsPage() {
  const [bottomZone, setBottomZone] = useState(false)
  const [posterLightbox, setPosterLightbox] = useState<PosterDesign | null>(null)
  const [advertLightboxOpen, setAdvertLightboxOpen] = useState(false)
  const advertLightboxVideoRef = useRef<HTMLVideoElement>(null)

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

  useEffect(() => {
    if (!posterLightbox && !advertLightboxOpen) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPosterLightbox(null)
        setAdvertLightboxOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [posterLightbox, advertLightboxOpen])

  useEffect(() => {
    if (!advertLightboxOpen) {
      advertLightboxVideoRef.current?.pause()
      return
    }
    const v = advertLightboxVideoRef.current
    if (v) {
      void v.play().catch(() => {})
    }
  }, [advertLightboxOpen])

  return (
    <div className={`projects-page${bottomZone ? ' projects-page--bottom-zone' : ''}`}>
      <div className="projects-page__galaxy" aria-hidden>
        <ProjectsGalaxyCanvas />
      </div>
      <div className="projects-page__dev-matrix" aria-hidden />
      <div className="projects-page__shell">
      <SiteHeader active="projects" className="projects-page__site-header" />

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
        <h2 className="projects-page__work-title">Mobile Apps</h2>
        <p className="projects-page__work-lede">
          A sample of mobile applications—each card opens the live site or repo where available.
        </p>
      </div>

      <div className="projects-page__grid">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} project={p} enterIndex={i} />
        ))}
      </div>

      <div className="projects-page__visual-split" id="poster-designs">
        <div className="projects-page__visual-split-inner">
          <div className="projects-page__visual-split-col">
            <div className="projects-page__work projects-page__work--split-sub">
              <h2 className="projects-page__work-title">Poster designs</h2>
              <p className="projects-page__work-lede">
                Print and digital poster layouts for events, campaigns, and promotions.
              </p>
            </div>
            <div className="projects-page__split-media-frame projects-page__split-media-frame--poster">
              <div className="projects-page__poster-grid projects-page__poster-grid--split">
                {POSTER_DESIGNS.map((poster, i) => (
                  <PosterDesignCard
                    key={poster.title}
                    poster={poster}
                    index={i}
                    onOpen={poster.imageSrc ? () => setPosterLightbox(poster) : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="projects-page__visual-split-col" id="short-adverts">
            <div className="projects-page__work projects-page__work--split-sub">
              <h2 className="projects-page__work-title">Short adverts</h2>
              <p className="projects-page__work-lede">
                Short promotional clips—compact messaging for screens and social placements.
              </p>
            </div>
            <div className="projects-page__split-media-frame projects-page__split-media-frame--adverts">
              <div
                className="projects-page__adverts-video-wrap projects-page__adverts-video-wrap--zoomable"
                role="button"
                tabIndex={0}
                aria-label="View short advert full size"
                aria-haspopup="dialog"
                onClick={() => setAdvertLightboxOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setAdvertLightboxOpen(true)
                  }
                }}
              >
                <video
                  className="projects-page__adverts-video projects-page__adverts-video--thumb"
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden
                >
                  <source src={SHORT_ADVERT_VIDEO_SRC} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
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

      {posterLightbox?.imageSrc ? (
        <div
          className="projects-page__poster-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="poster-lightbox-title"
        >
          <button
            type="button"
            className="projects-page__poster-lightbox-backdrop"
            aria-label="Close full view"
            onClick={() => setPosterLightbox(null)}
          />
          <div className="projects-page__poster-lightbox-panel">
            <button
              type="button"
              className="projects-page__poster-lightbox-close"
              aria-label="Close"
              onClick={() => setPosterLightbox(null)}
            >
              <i className="fas fa-times" aria-hidden />
            </button>
            <img
              src={posterLightbox.imageSrc}
              alt={posterLightbox.title}
              className="projects-page__poster-lightbox-img"
            />
            <div className="projects-page__poster-lightbox-meta">
              <h2 id="poster-lightbox-title" className="projects-page__poster-lightbox-heading">
                {posterLightbox.title}
              </h2>
              <p className="projects-page__poster-lightbox-text">{posterLightbox.description}</p>
            </div>
          </div>
        </div>
      ) : null}

      {advertLightboxOpen ? (
        <div
          className="projects-page__poster-lightbox projects-page__poster-lightbox--video"
          role="dialog"
          aria-modal="true"
          aria-labelledby="advert-lightbox-title"
        >
          <button
            type="button"
            className="projects-page__poster-lightbox-backdrop"
            aria-label="Close full view"
            onClick={() => setAdvertLightboxOpen(false)}
          />
          <div className="projects-page__poster-lightbox-panel">
            <button
              type="button"
              className="projects-page__poster-lightbox-close"
              aria-label="Close"
              onClick={() => setAdvertLightboxOpen(false)}
            >
              <i className="fas fa-times" aria-hidden />
            </button>
            <video
              ref={advertLightboxVideoRef}
              className="projects-page__poster-lightbox-video"
              controls
              playsInline
              preload="metadata"
              aria-labelledby="advert-lightbox-title"
            >
              <source src={SHORT_ADVERT.src} type="video/mp4" />
            </video>
            <div className="projects-page__poster-lightbox-meta">
              <h2 id="advert-lightbox-title" className="projects-page__poster-lightbox-heading">
                {SHORT_ADVERT.title}
              </h2>
              <p className="projects-page__poster-lightbox-text">{SHORT_ADVERT.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
