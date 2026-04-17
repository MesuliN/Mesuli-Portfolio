import { hrefTo, navigate, type AppRoute } from './appRoute'
import { setBodyCursorActive } from './RippleBox'

export type SiteHeaderActive = AppRoute

type SiteHeaderProps = {
  active: SiteHeaderActive
  className?: string
}

function NavLink({
  href,
  to,
  children,
  isActive,
}: {
  href: string
  to: string
  children: string
  isActive: boolean
}) {
  return (
    <a
      href={href}
      className={`font-medium transition-colors duration-200 ease-out ${
        isActive ? 'text-primary' : 'text-portfolio-muted hover:text-primary'
      }`}
      aria-current={isActive ? 'page' : undefined}
      onClick={(e) => {
        e.preventDefault()
        navigate(to)
      }}
      onPointerEnter={() => setBodyCursorActive(true)}
      onPointerLeave={() => setBodyCursorActive(false)}
    >
      {children}
    </a>
  )
}

export function SiteHeader({ active, className }: SiteHeaderProps) {
  return (
    <header className={`site-header mb-[clamp(1.25rem,3vw,1.75rem)] ${className ?? ''}`.trim()}>
      <nav
        className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[clamp(0.92rem,0.28vw+0.86rem,1rem)]"
        aria-label="Primary"
      >
        <NavLink href={hrefTo('home')} to="/" isActive={active === 'home'}>
          Home
        </NavLink>
        <NavLink href={hrefTo('about')} to="/about" isActive={active === 'about'}>
          About
        </NavLink>
        <NavLink href={hrefTo('projects')} to="/projects" isActive={active === 'projects'}>
          Projects
        </NavLink>
      </nav>
    </header>
  )
}
