import type { CSSProperties } from 'react'
import type { Project } from './projectsData'
import { projectCardChromePath, projectCardSlug } from './projectsData'
import { RippleBox } from './RippleBox'

type ProjectCardProps = {
  project: Project
  /** Optional stagger index for enter animation (e.g. projects page). */
  enterIndex?: number
}

export function ProjectCard({ project: p, enterIndex }: ProjectCardProps) {
  const staggerStyle =
    enterIndex !== undefined
      ? ({ '--project-card-stagger': `${enterIndex * 70}ms` } as CSSProperties)
      : undefined
  const card = (
    <RippleBox
        role={p.href ? 'link' : undefined}
        tabIndex={p.href ? 0 : undefined}
        aria-label={p.href ? `${p.title}: open live site in a new tab` : undefined}
        className={`project-dev-card ${p.href ? '' : '!cursor-default'}`}
        onClick={
          p.href ? () => window.open(p.href, '_blank', 'noopener,noreferrer') : undefined
        }
        onKeyDown={
          p.href
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  window.open(p.href, '_blank', 'noopener,noreferrer')
                }
              }
            : undefined
        }
      >
        <div className="project-dev-card__accent" aria-hidden />
        <div className="project-dev-card__chrome">
          <span className="project-dev-card__chrome-left" aria-hidden>
            <span className="project-dev-card__dots">
              <span className="project-dev-card__dot project-dev-card__dot--r" />
              <span className="project-dev-card__dot project-dev-card__dot--y" />
              <span className="project-dev-card__dot project-dev-card__dot--g" />
            </span>
            <span className="project-dev-card__path">{projectCardChromePath(p.title)}</span>
          </span>
          <span className="project-dev-card__tab" aria-hidden>
            {projectCardSlug(p.title)}/
            <span className="project-dev-card__tab-strong">README.md</span>
          </span>
          <span className="project-dev-card__branch" aria-hidden>
            <span className="project-dev-card__branch-dot" /> main
          </span>
        </div>
        <div className="project-dev-card__body">
          <div className="project-dev-card__editor">
            <div className="project-dev-card__gutter" aria-hidden>
              <span>01</span>
              <span>02</span>
              <span>03</span>
              <span>04</span>
            </div>
            <div className="project-dev-card__editor-main">
              <div className="project-dev-card__headline">
                <h3 className="project-dev-card__title">
                  <span className="project-dev-card__title-comment" aria-hidden>
                    //{' '}
                  </span>
                  {p.title}
                </h3>
              </div>
              <p className="project-dev-card__desc">{p.description}</p>
              {p.href ? (
                <p className="project-dev-card__hint" aria-hidden>
                  <kbd className="project-dev-card__kbd">↵</kbd> or click · opens in new tab
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </RippleBox>
  )

  if (enterIndex !== undefined) {
    return (
      <div className="project-dev-card-anim" style={staggerStyle}>
        {card}
      </div>
    )
  }

  return card
}
