export type HashRoute = 'home' | 'projects'

export function getHashRoute(): HashRoute {
  const h = window.location.hash.replace(/^#\/?/i, '').toLowerCase()
  if (!h || h === '/') return 'home'
  return h === 'projects' ? 'projects' : 'home'
}
