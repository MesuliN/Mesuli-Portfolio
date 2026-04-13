import { useEffect, useRef } from 'react'
import { drawAstronaut3D } from './astronaut3dCanvas'

type Particle = {
  x: number
  y: number
  r: number
  g: number
  b: number
  a: number
  size: number
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildParticles(width: number, height: number, seed = 42): Particle[] {
  const rand = mulberry32(seed)
  const particles: Particle[] = []
  const scale = Math.min(width, height) * 0.52

  // Bright galactic core (white / lavender)
  const coreN = Math.floor(380 + rand() * 120)
  for (let i = 0; i < coreN; i++) {
    const ang = rand() * Math.PI * 2
    const rr = Math.pow(rand(), 1.6) * scale * 0.1
    const w = 0.85 + rand() * 0.15
    particles.push({
      x: Math.cos(ang) * rr,
      y: Math.sin(ang) * rr,
      r: w,
      g: 0.88 * w + rand() * 0.08,
      b: 0.98 * w + rand() * 0.02,
      a: 0.48 + rand() * 0.47,
      size: 2.35 + rand() * 3.9,
    })
  }

  // Spiral arms — logarithmic-style curve, violet dust
  const arms = 4
  const perArm = Math.floor(520 + rand() * 180)
  for (let arm = 0; arm < arms; arm++) {
    const armRot = (arm / arms) * Math.PI * 2 + rand() * 0.08
    for (let i = 0; i < perArm; i++) {
      const t = 0.12 + (i / perArm) * 6.2
      const rSpiral = scale * 0.07 * Math.exp(0.2 * t)
      const theta = t * 1.72 + armRot
      const spread = scale * 0.035 * (0.4 + t * 0.22) * (rand() - 0.5) * 2
      const px =
        Math.cos(theta) * rSpiral + Math.cos(theta + Math.PI / 2) * spread * (0.6 + rand() * 0.8)
      const py =
        Math.sin(theta) * rSpiral + Math.sin(theta + Math.PI / 2) * spread * (0.6 + rand() * 0.8)
      const armMix = 1 - i / perArm
      const purp = rand() * 0.35
      particles.push({
        x: px,
        y: py,
        r: 0.72 + purp * 0.28,
        g: 0.58 + purp * 0.22,
        b: 0.95 + purp * 0.05,
        a: 0.14 + armMix * 0.48 + rand() * 0.14,
        size: 1.45 + rand() * 2.75,
      })
    }
  }

  // Distant star field
  const fieldN = Math.floor(900 + rand() * 400)
  const spanX = width * 1.5
  const spanY = height * 1.5
  for (let i = 0; i < fieldN; i++) {
    const pink = rand() > 0.92 ? 0.15 : 0
    particles.push({
      x: (rand() - 0.5) * spanX,
      y: (rand() - 0.5) * spanY,
      r: 0.75 + pink * 0.25,
      g: 0.82 - pink * 0.1,
      b: 1,
      a: 0.14 + rand() * 0.4,
      size: 1.35 + rand() * 2.55,
    })
  }

  return particles
}

type Astronaut = {
  nx: number
  ny: number
  phase: number
  phase2: number
  speedX: number
  speedY: number
  scale: number
  flip: 1 | -1
}

/** Few sparse background figures — corners / band, not a crowd */
function buildAstronauts(): Astronaut[] {
  return [
    { nx: 0.06, ny: 0.18, phase: 0.2, phase2: 1.1, speedX: 0.22, speedY: 0.2, scale: 0.9, flip: 1 },
    { nx: 0.9, ny: 0.24, phase: 2.2, phase2: 0.6, speedX: 0.2, speedY: 0.24, scale: 0.82, flip: -1 },
    { nx: 0.48, ny: 0.82, phase: 1.4, phase2: 2.5, speedX: 0.18, speedY: 0.19, scale: 0.75, flip: 1 },
  ]
}

export function ProjectsGalaxyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const astronautsRef = useRef<Astronaut[]>(buildAstronauts())
  const targetRef = useRef({ x: 0, y: 0 })
  const smoothRef = useRef({ x: 0, y: 0 })
  const rotRef = useRef(0)
  const reducedMotionRef = useRef(false)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      reducedMotionRef.current = mq.matches
    }
    syncMotion()
    mq.addEventListener('change', syncMotion)

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      targetRef.current.x = nx
      targetRef.current.y = ny
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particlesRef.current = buildParticles(w, h)
      astronautsRef.current = buildAstronauts()
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })

    const tick = (now: number) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const cx = w * 0.5
      const cy = h * 0.5
      const parallaxMax = Math.min(w, h) * 0.09
      const t = targetRef.current
      const s = smoothRef.current
      const ease = reducedMotionRef.current ? 0 : 0.07
      s.x += (t.x - s.x) * ease
      s.y += (t.y - s.y) * ease
      const px = s.x * parallaxMax
      const py = s.y * parallaxMax

      if (!reducedMotionRef.current) {
        rotRef.current += 0.00035
      }

      ctx.fillStyle = '#010102'
      ctx.fillRect(0, 0, w, h)

      // Soft galactic halo (lavender bloom)
      const halo = ctx.createRadialGradient(cx + px * 0.3, cy + py * 0.3, 0, cx, cy, Math.max(w, h) * 0.55)
      halo.addColorStop(0, 'rgba(255, 248, 255, 0.14)')
      halo.addColorStop(0.12, 'rgba(220, 200, 255, 0.08)')
      halo.addColorStop(0.35, 'rgba(100, 70, 140, 0.05)')
      halo.addColorStop(0.65, 'rgba(20, 30, 50, 0.02)')
      halo.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, w, h)

      const particles = particlesRef.current
      const baseRot = reducedMotionRef.current ? 0.12 : rotRef.current
      const mouseTilt = reducedMotionRef.current ? 0 : s.x * 0.04

      ctx.save()
      ctx.translate(cx + px, cy + py)
      ctx.rotate(baseRot + mouseTilt)

      const maxCull = Math.hypot(w, h) * 0.95
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const lx = p.x
        const ly = p.y
        if (Math.hypot(lx, ly) > maxCull) continue
        const R = Math.round(p.r * 255)
        const G = Math.round(p.g * 255)
        const B = Math.round(p.b * 255)
        ctx.fillStyle = `rgba(${R},${G},${B},${p.a})`
        const sz = p.size
        ctx.fillRect(lx - sz * 0.5, ly - sz * 0.5, sz, sz)
      }
      ctx.restore()

      // Floating astronauts (screen space — not rotated with the spiral)
      const secs = now * 0.001
      const drift = reducedMotionRef.current ? 0.24 : 1
      const astroParallax = 0.14
      const axPx = s.x * parallaxMax * astroParallax
      const ayPy = s.y * parallaxMax * astroParallax
      const astronauts = astronautsRef.current

      for (let i = 0; i < astronauts.length; i++) {
        const a = astronauts[i]
        const ox = Math.sin(secs * a.speedX + a.phase) * w * 0.048 * drift
        const oy = Math.cos(secs * a.speedY + a.phase2) * h * 0.04 * drift
        const ax = a.nx * w + ox + axPx
        const ay = a.ny * h + oy + ayPy
        const alpha = 0.36 + i * 0.04
        const drawH = Math.min(w, h) * 0.036 * (a.scale / 0.72)
        const pixelScale = drawH * 0.44
        drawAstronaut3D(
          ctx,
          ax,
          ay,
          pixelScale,
          secs,
          a.phase,
          a.flip,
          alpha,
          reducedMotionRef.current,
          s.x,
        )
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      mq.removeEventListener('change', syncMotion)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="projects-page__galaxy-canvas"
      aria-hidden
    />
  )
}
