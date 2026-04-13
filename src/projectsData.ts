export type Project = {
  title: string
  description: string
  href?: string
}

export const PROJECTS: Project[] = [
  {
    title: 'SortiFy App',
    description:
      'A smart waste management application designed to help users sort and manage waste efficiently, promoting cleaner environments through an intuitive and user-friendly system.',
  },
  {
    title: 'Attendify App',
    description:
      'A digital attendance system that simplifies tracking and managing attendance, making it faster, more accurate, and easily accessible through a modern interface. The system is currently deployed.',
    href: 'https://mut-stars.web.app/home',
  },
]

export function projectCardSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project'
}

export function projectCardChromePath(title: string) {
  return `~/repos/${projectCardSlug(title)}`
}
