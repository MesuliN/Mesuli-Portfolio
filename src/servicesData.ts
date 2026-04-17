/** Services offered — short labels for the home grid; full copy on the projects page. */
export type ServiceOffering = {
  icon: string
  label: string
  tagline: string
  body: string
  /** Tighter summary for small screens (About page cards) */
  bodyShort: string
  /** Concrete deliverables the reader can expect */
  includes: string[]
  /** Fewer bullets for small screens */
  includesShort: string[]
}

export const SERVICES: ServiceOffering[] = [
  {
    icon: 'fa-globe',
    label: 'Website Development',
    tagline: 'Sites that load fast, read clearly, and work on every screen',
    body:
      'I build brochure sites, portfolios, and marketing pages with clean structure and modern front-end practices. You get a layout that matches your goals—whether that is credibility for a small business, a polished personal brand, or a focused landing page for a campaign. Content hierarchy, typography, and spacing are tuned so visitors find what they need without friction.',
    bodyShort:
      'Brochure sites, portfolios, and landing pages with clean structure, fast loading, and layouts tuned so visitors find what they need.',
    includes: [
      'Responsive layouts for phones, tablets, and desktops',
      'Semantic HTML and sensible defaults for accessibility',
      'Performance-minded assets and lazy loading where it helps',
      'Integration with forms, maps, or analytics when your project needs them',
      'Guidance on hosting and going live so you are not stuck at the last step',
    ],
    includesShort: [
      'Responsive layouts for all screen sizes',
      'Semantic HTML and accessibility-minded defaults',
      'Performance-minded assets and hosting guidance',
    ],
  },
  {
    icon: 'fa-laptop-code',
    label: 'Web Applications',
    tagline: 'Interactive tools and dashboards built for real daily use',
    body:
      'Beyond static pages, I develop web applications—think internal tools, data entry flows, client portals, and single-page experiences in React. I focus on predictable state, clear validation, and interfaces that stay maintainable as requirements grow. When a backend or database is part of the picture, I wire up APIs and persistence so the app behaves reliably in production, not only in a demo.',
    bodyShort:
      'Internal tools, portals, and React SPAs—with clear validation and maintainable structure as features grow.',
    includes: [
      'Component-based UI in React for maintainable feature work',
      'Forms, tables, filters, and workflows tailored to your process',
      'Basic security hygiene: sessions, validation, and safe handling of user input',
      'Handover notes or light documentation so your team can extend the system',
    ],
    includesShort: [
      'Component-based UI in React',
      'Forms, filters, and workflows for your process',
      'Validation and safe handling of user input',
    ],
  },
  {
    icon: 'fa-chalkboard-teacher',
    label: 'Computer Training',
    tagline: 'Patient, practical sessions so users gain confidence',
    body:
      'Not everyone learns the same way. I offer one-on-one or small-group training on everyday computing: navigating Windows, using email and browsers safely, file management, and common productivity tasks. Sessions are paced to the learner, with emphasis on repeating the skills you will actually use at work or at home—so knowledge sticks after the lesson ends.',
    bodyShort:
      'One-on-one or small-group training on everyday computing—paced to the learner so skills stick.',
    includes: [
      'Windows basics: files, folders, search, and printer setup',
      'Email, calendars, and cloud storage used step by step',
      'Safe browsing habits',
    ],
    includesShort: ['Windows basics and file management', 'Email and cloud storage', 'Safe browsing habits'],
  },
  {
    icon: 'fa-windows',
    label: 'Windows Installation & Support',
    tagline: 'Clean setups, updates, and troubleshooting you can rely on',
    body:
      'I install and configure Windows on new or refreshed machines, migrate user data where appropriate, and apply updates and drivers so the system is stable from day one. Ongoing support covers slowdowns, software conflicts, network issues, and hardware-oriented triage—so you spend less time stuck and more time working.',
    bodyShort:
      'Fresh Windows installs, updates, and drivers—plus ongoing help with crashes, slowdowns, and networks.',
    includes: [
      'Fresh Windows installs and post-install hardening (updates, drivers)',
      'User accounts, permissions, and shared folders for homes or small offices',
      'Diagnosing crashes, blue screens, and performance bottlenecks',
      'Backup strategy guidance and recovery-oriented thinking',
      'Coordination with hardware fixes when a component needs replacement',
    ],
    includesShort: [
      'Installs, updates, and stable day-one setup',
      'Accounts, permissions, and shared folders',
      'Troubleshooting performance and networks',
    ],
  },
]
