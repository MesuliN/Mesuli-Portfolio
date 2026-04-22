import posterScreenshot from './assets/Screenshot 2026-04-17 123710.png'
import ariseMediaAdvert from './assets/ARISE MEDIA.mp4'

/** Short advert clip + copy for the projects page and full-view dialog */
export const SHORT_ADVERT = {
  src: ariseMediaAdvert,
  title: 'Arise Media',
  description: 'Short promotional clip for screens and social placements.',
} as const

export const SHORT_ADVERT_VIDEO_SRC = SHORT_ADVERT.src

export type Project = {
  title: string
  description: string
  href?: string
}

/** Poster / print-style work shown below mobile apps on the projects page */
export type PosterDesign = {
  title: string
  description: string
  /** Optional image (e.g. import or `/poster-name.jpg` in `public/`) */
  imageSrc?: string
}

export const PROJECTS: Project[] = [
  {
    title: 'SortiFy App',
    description:
      'A smart waste management application designed to help users sort and manage waste efficiently, promoting cleaner environments through an intuitive and user-friendly system.',
  },
  {
    title: 'TTMS (Timetable Management System)',
    description:
      'Team project with MUT Innovation Lab: an Angular / Ionic timetable system for planning and managing schedules, with academic calendar support and database-backed timetable data. Not deployed yet—repo: https://github.com/MUTInnovationLab/TTMS.',
  },
  {
    title: 'Attendify App',
    description:
      'A digital attendance system that simplifies tracking and managing attendance, making it faster, more accurate, and easily accessible through a modern interface. The system is currently deployed.',
    href: 'https://mut-stars.web.app/home',
  },
]

export const POSTER_DESIGNS: PosterDesign[] = [
  {
    title: 'Pest Control Poster',
    description: 'Targeted poster for pest control services.',
    imageSrc: posterScreenshot,
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
