export type AppRoute = 'home' | 'projects' | 'about'

const listeners = new Set<(route: AppRoute) => void>()

export function subscribeAppRoute(listener: (route: AppRoute) => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify(): void {
  const route = getAppRoute()
  for (const l of listeners) {
    l(route)
  }
}

function baseUrl(): string {
  return window.location.origin + import.meta.env.BASE_URL
}

/** Pathname without base prefix, lowercased, e.g. `/`, `/about` */
function relativePathname(): string {
  let path = window.location.pathname
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') || ''
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || '/'
  }
  if (!path.startsWith('/')) path = '/' + path
  return path.replace(/\/+$/, '') || '/'
}

export function getAppRoute(): AppRoute {
  const p = relativePathname().toLowerCase()
  if (p === '/' || p === '') return 'home'
  if (p === '/projects') return 'projects'
  if (p === '/about') return 'about'
  return 'home'
}

/** URL path for `<a href>` — uses Vite `BASE_URL` (e.g. `/about`, `/portfolio/about`). */
export function hrefTo(route: AppRoute, search = ''): string {
  const base = import.meta.env.BASE_URL
  if (route === 'home') return base
  const seg = route === 'about' ? 'about' : 'projects'
  return `${base}${seg}${search}`
}

/**
 * Client-side navigation (no hash, no full reload). `to` is like `/about` or `/about?section=services`
 * relative to site root (leading slash optional).
 */
export function navigate(to: string): void {
  const trimmed = to.trim()
  const pathAndQuery = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const url = new URL(pathAndQuery.replace(/^\//, ''), baseUrl())
  window.history.pushState(null, '', url.pathname + url.search)
  window.dispatchEvent(new Event('appnavigate'))
  notify()
}
