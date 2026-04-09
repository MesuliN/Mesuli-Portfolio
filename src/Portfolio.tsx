import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'
import mesuliImage from './assets/Mesuli Image.jpg'

const SERVICES: { icon: string; label: string }[] = [
  { icon: 'fa-globe', label: 'Website Development' },
  { icon: 'fa-laptop-code', label: 'Web Applications' },
  { icon: 'fa-chalkboard-teacher', label: 'Computer Training' },
  { icon: 'fa-windows', label: 'Windows Installation & Support' },
]

const SKILLS = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'Python',
  'PHP',
  'MySQL',
  'Windows Administration',
  'Hardware Troubleshooting',
]

const PROJECTS: { title: string; description: string }[] = [
  {
    title: 'SortiFy App',
    description:
      'A smart waste management application designed to help users sort and manage waste efficiently, promoting cleaner environments through an intuitive and user-friendly system.',
  },
  {
    title: 'Attendify App',
    description:
      'A digital attendance system that simplifies tracking and managing attendance, making it faster, more accurate, and accessible through a modern interface.',
  },
]

function setBodyCursorActive(active: boolean) {
  if (active) document.body.classList.add('cursor-active')
  else document.body.classList.remove('cursor-active')
}

type RippleBoxProps = {
  children: ReactNode
  className?: string
  onClick?: HTMLAttributes<HTMLDivElement>['onClick']
} & Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'children' | 'className'>

function RippleBox({
  children,
  className = '',
  onClick,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: RippleBoxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const handleClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const wave = document.createElement('span')
        wave.className = 'ripple-wave'
        wave.style.left = `${e.clientX - rect.left}px`
        wave.style.top = `${e.clientY - rect.top}px`
        el.appendChild(wave)
        wave.addEventListener('animationend', () => wave.remove())
      }
      onClick?.(e)
    },
    [onClick],
  )

  return (
    <div
      ref={ref}
      {...rest}
      className={`interactive ripple relative cursor-pointer overflow-hidden ${className}`}
      onClick={handleClick}
      onPointerEnter={(e) => {
        setBodyCursorActive(true)
        onPointerEnter?.(e)
      }}
      onPointerLeave={(e) => {
        setBodyCursorActive(false)
        onPointerLeave?.(e)
      }}
    >
      {children}
    </div>
  )
}

export default function Portfolio() {
  const [glow, setGlow] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      setGlow({ x: e.clientX, y: e.clientY })
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div
        className="cursor-glow-dot max-md:hidden"
        style={{ left: glow.x, top: glow.y }}
        aria-hidden
      />

      <div className="mx-auto max-w-[1200px] px-6 pb-28 pt-14 max-md:pb-24 max-md:pt-12">
        <header className="mb-[68px] text-center max-md:mb-10">
          <div className="mb-7 flex justify-center max-md:mb-6">
            <img
              src={mesuliImage}
              alt="Mesuli Nduluko"
              width={640}
              height={640}
              sizes="(max-width: 768px) min(92vw, 280px), 320px"
              decoding="async"
              fetchPriority="high"
              className="aspect-square h-auto w-[min(92vw,280px)] rounded-full border-2 border-primary/45 object-cover object-center shadow-[0_0_36px_rgba(0,255,157,0.35),0_0_24px_rgba(0,240,255,0.15)] ring-2 ring-secondary/20 md:w-80 transform-gpu"
            />
          </div>
          <h1 className="mb-2.5 text-[2.6rem] font-bold leading-tight drop-shadow-[0_0_40px_rgba(0,255,157,0.5)] md:text-[3.5rem] md:leading-none">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mesuli Nduluko
            </span>
          </h1>
          <p className="mx-auto max-w-[860px] text-[1.2rem] font-medium text-secondary drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            Web Developer and IT Specialist focused on building modern, high-performance digital
            experiences and delivering dependable technical support.
          </p>
        </header>

        <div className="grid grid-cols-1 items-stretch gap-[25px] md:grid-cols-2 md:gap-[35px]">
          <RippleBox
            className="mb-10 rounded-[20px] border border-primary/25 bg-[rgba(20,20,20,0.7)] p-8 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-[14px] transition-all duration-[280ms] ease-in-out hover:-translate-y-1.5 hover:scale-[1.01] hover:border-primary hover:shadow-[0_18px_36px_rgba(0,255,157,0.16)] max-md:mb-6"
          >
            <h2 className="mb-5 flex items-center gap-3 text-[1.7rem] text-primary">
              <i className="fas fa-user" aria-hidden />
              About Me
            </h2>
            <p className="text-portfolio-text">
              I am a web developer and IT specialist with a strong focus on creating clean, responsive
              websites and practical web applications. My work combines modern front-end development
              with reliable back-end integration to deliver solutions that are fast, user-focused, and
              built for real-world results.
            </p>
            <p className="mt-4 text-portfolio-text">
              Alongside development, I provide IT support services including system setup, Windows
              installation, troubleshooting, and user training. This combination allows me to support
              clients from planning and development through day-to-day technical operations.
            </p>
          </RippleBox>

          <RippleBox
            className="mb-10 rounded-[20px] border border-primary/25 bg-[rgba(20,20,20,0.7)] p-8 shadow-[0_10px_24px_rgba(0,0,0,0.25)] backdrop-blur-[14px] transition-all duration-[280ms] ease-in-out hover:-translate-y-1.5 hover:scale-[1.01] hover:border-primary hover:shadow-[0_18px_36px_rgba(0,255,157,0.16)] max-md:mb-6"
          >
            <h2 className="mb-5 flex items-center gap-3 text-[1.7rem] text-primary">
              <i className="fas fa-tools" aria-hidden />
              My Services
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
              {SERVICES.map((s) => (
                <RippleBox
                  key={s.label}
                  className="group flex items-center gap-3.5 rounded-[14px] border border-primary/[0.18] bg-white/[0.06] px-5 py-[18px] text-[1.05rem] font-semibold text-portfolio-text transition-all duration-[180ms] ease-in-out hover:-translate-y-1 hover:scale-[1.01] hover:bg-gradient-to-br hover:from-primary hover:to-[#00cc7a] hover:text-[#111] hover:shadow-[0_12px_25px_rgba(0,255,157,0.3)]"
                >
                  <i
                    className={`fas ${s.icon} text-[1.7rem] text-primary transition-colors duration-[180ms] group-hover:text-[#0b1813]`}
                    aria-hidden
                  />
                  {s.label}
                </RippleBox>
              ))}
            </div>
          </RippleBox>
        </div>

        <section className="mt-[50px]">
          <h2 className="mb-6 flex items-center justify-center gap-3 text-center text-[1.8rem] text-primary">
            <i className="fas fa-code" aria-hidden />
            Technologies &amp; Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {SKILLS.map((skill) => (
              <RippleBox
                key={skill}
                className="rounded-full border border-primary/35 bg-primary/10 px-6 py-2.5 text-base text-primary transition-all duration-[180ms] ease-in-out hover:-translate-y-0.5 hover:scale-[1.04] hover:bg-primary hover:text-[#111] hover:shadow-[0_10px_20px_rgba(0,255,157,0.2)]"
              >
                {skill}
              </RippleBox>
            ))}
          </div>
        </section>

        <section className="mt-[60px]">
          <h2 className="mb-8 flex items-center justify-center gap-3 text-center text-[1.8rem] text-primary">
            <i className="fas fa-folder-open" aria-hidden />
            My Projects
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[25px]">
            {PROJECTS.map((p) => (
              <RippleBox
                key={p.title}
                className="overflow-hidden rounded-2xl border border-primary/20 bg-[rgba(20,20,20,0.7)] transition-all duration-[280ms] ease-in-out hover:-translate-y-2 hover:scale-[1.01] hover:border-primary hover:shadow-[0_22px_44px_rgba(0,255,157,0.24)]"
              >
                <div className="p-5">
                  <h3 className="mb-2 text-primary">{p.title}</h3>
                  <p className="text-portfolio-muted">{p.description}</p>
                </div>
              </RippleBox>
            ))}
          </div>
        </section>
      </div>

      <div
        className="fixed bottom-6 right-6 z-[100] rounded-2xl border border-primary bg-[rgba(10,10,10,0.93)] px-6 py-[18px] text-[0.97rem] leading-[2] shadow-[0_15px_35px_rgba(0,255,157,0.25)] backdrop-blur-[14px] transition-all duration-[180ms] ease-in-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,255,157,0.3)] max-md:relative max-md:bottom-auto max-md:right-auto max-md:mx-auto max-md:mt-12 max-md:max-w-[360px] max-md:text-center"
      >
        <span className="inline-flex items-center gap-1.5">
          <i className="fas fa-envelope" aria-hidden />
          <a
            href="mailto:Ndulukomesuli02@gmail.com"
            className="link-cyber"
            onPointerEnter={() => setBodyCursorActive(true)}
            onPointerLeave={() => setBodyCursorActive(false)}
          >
            Ndulukomesuli02@gmail.com |{' '}
          </a>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="fas fa-phone" aria-hidden />
          <a
            href="tel:0742298511"
            className="link-cyber"
            onPointerEnter={() => setBodyCursorActive(true)}
            onPointerLeave={() => setBodyCursorActive(false)}
          >
            074 229 8511 |{' '}
          </a>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="fab fa-github" aria-hidden />
          <a
            href="https://github.com/MesuliN"
            target="_blank"
            rel="noreferrer"
            className="link-cyber"
            onPointerEnter={() => setBodyCursorActive(true)}
            onPointerLeave={() => setBodyCursorActive(false)}
          >
            GitHub: MesuliN |{' '}
          </a>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="fab fa-linkedin" aria-hidden />
          <a
            href="https://www.linkedin.com/in/mesuli-nduluko-4a406027a"
            target="_blank"
            rel="noreferrer"
            className="link-cyber"
            onPointerEnter={() => setBodyCursorActive(true)}
            onPointerLeave={() => setBodyCursorActive(false)}
          >
            LinkedIn
          </a>
        </span>
      </div>
    </>
  )
}
