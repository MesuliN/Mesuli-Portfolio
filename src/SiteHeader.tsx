import type { ReactNode } from 'react'
import { hrefTo, navigate, type AppRoute } from './appRoute'
import { setBodyCursorActive } from './RippleBox'

export type SiteHeaderActive = AppRoute

type SiteHeaderProps = {
  active: SiteHeaderActive
  /** Extra controls on the right (e.g. Projects page “Services” anchor). */
  trailing?: ReactNode
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
  children: ReactNode
  isActive: boolean
}) {
  return (
    <a
      href={href}
      className={`rounded-lg px-3 py-2 text-[0.88rem] font-semibold tracking-wide transition-[background-color,color,box-shadow] duration-200 ease-out ${
        isActive
          ? 'bg-primary/14 text-primary ring-1 ring-primary/40 shadow-[0_0_20px_rgba(0,255,157,0.12)]'
          : 'text-portfolio-muted hover:bg-white/[0.06] hover:text-primary'
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

export function SiteHeader({ active, trailing, className }: SiteHeaderProps) {
  return (
    <header
      className={`site-header mb-8 border-b border-primary/20 pb-5 ${className ?? ''}`.trim()}
    >
      <nav
        className="flex flex-wrap items-center gap-2 gap-y-3 sm:justify-between"
        aria-label="Primary"
      >
        <div className="flex flex-wrap items-center gap-2">
          <NavLink href={hrefTo('home')} to="/" isActive={active === 'home'}>
            Home
          </NavLink>
          <NavLink href={hrefTo('about')} to="/about" isActive={active === 'about'}>
            About
          </NavLink>
        </div>
        {trailing ? (
          <div className="flex flex-wrap items-center gap-3 sm:ml-auto">{trailing}</div>
        ) : null}
      </nav>
    </header>
  )
}
