import { useEffect, useRef } from 'react'

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Star = {
  x: number
  y: number
  r: number
  tw: number
  phase: number
  depth: 0 | 1 | 2
}

function buildStarsInWindshield(w: number, h: number, seed: number): Star[] {
  const rand = mulberry32(seed)
  const stars: Star[] = []
  const x0 = w * 0.08
  const x1 = w * 0.92
  const y0 = h * 0.04
  const y1 = h * 0.44
  const counts = [380, 240, 100] as const
  for (let depth = 0; depth < 3; depth++) {
    const dr = depth as 0 | 1 | 2
    for (let i = 0; i < counts[depth]!; i++) {
      const br = dr === 0 ? 0.15 + rand() * 0.75 : dr === 1 ? 0.4 + rand() * 1.0 : 0.7 + rand() * 1.5
      stars.push({
        x: x0 + rand() * (x1 - x0),
        y: y0 + rand() * (y1 - y0),
        r: br,
        tw: 0.2 + rand() * 0.8,
        phase: rand() * Math.PI * 2,
        depth: dr,
      })
    }
  }
  return stars
}

/** Cyberpunk-style cockpit: panoramic window, dual HUDs, dense panels, neon accents */
export function AboutCockpitCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const reducedRef = useRef(false)

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let alive = true

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      starsRef.current = buildStarsInWindshield(w, h, 2026)
    }

    const windscreenPath = (w: number, h: number) => {
      ctx.beginPath()
      ctx.moveTo(w * 0.08, h * 0.04)
      ctx.lineTo(w * 0.92, h * 0.04)
      ctx.lineTo(w * 0.74, h * 0.46)
      ctx.lineTo(w * 0.26, h * 0.46)
      ctx.closePath()
    }

    const drawCyberNebula = (w: number, h: number, t: number) => {
      const ox = reducedRef.current ? 0 : Math.sin(t * 0.04) * 14
      const oy = reducedRef.current ? 0 : Math.cos(t * 0.032) * 10
      const g1 = ctx.createRadialGradient(
        w * 0.35 + ox,
        h * 0.12 + oy,
        0,
        w * 0.45,
        h * 0.22,
        h * 0.65,
      )
      g1.addColorStop(0, 'rgba(236, 72, 153, 0.45)')
      g1.addColorStop(0.28, 'rgba(168, 85, 247, 0.32)')
      g1.addColorStop(0.55, 'rgba(88, 28, 135, 0.18)')
      g1.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h * 0.48)

      const ox2 = reducedRef.current ? 0 : Math.sin(t * 0.055 + 2) * 18
      const g2 = ctx.createRadialGradient(w * 0.68 + ox2, h * 0.18, 0, w * 0.58, h * 0.26, h * 0.5)
      g2.addColorStop(0, 'rgba(59, 130, 246, 0.22)')
      g2.addColorStop(0.4, 'rgba(124, 58, 237, 0.16)')
      g2.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.globalAlpha = 0.85
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h * 0.48)
      ctx.globalAlpha = 1

      const g3 = ctx.createLinearGradient(0, h * 0.05, w, h * 0.4)
      g3.addColorStop(0, 'rgba(244, 114, 182, 0.08)')
      g3.addColorStop(0.5, 'rgba(192, 132, 252, 0.06)')
      g3.addColorStop(1, 'rgba(56, 189, 248, 0.07)')
      ctx.fillStyle = g3
      ctx.globalAlpha = 0.9
      ctx.fillRect(0, 0, w, h * 0.48)
      ctx.globalAlpha = 1
    }

    /** Sun + 8 planets on elliptical orbits (tilted for depth). Speed ~ Kepler: faster inner. */
    const drawSolarSystem = (w: number, h: number, t: number) => {
      const scale = Math.min(w, h)
      const cx = w * 0.5
      const cy = h * 0.26
      const flat = 0.4
      const maxOrbit = scale * 0.2

      type Body = {
        orbit: number
        size: number
        /** rad/s — higher = faster (inner planets) */
        omega: number
        phase: number
        core: string
        edge: string
        ring?: boolean
      }

      const planets: Body[] = [
        { orbit: 0.14, size: 2.2, omega: 2.9, phase: 0.2, core: '#d4d4d8', edge: '#71717a' },
        { orbit: 0.22, size: 3.2, omega: 2.15, phase: 1.1, core: '#fde68a', edge: '#ca8a04' },
        { orbit: 0.3, size: 3.6, omega: 1.75, phase: 2.4, core: '#60a5fa', edge: '#1e3a8a' },
        { orbit: 0.38, size: 2.8, omega: 1.45, phase: 3.6, core: '#f87171', edge: '#7f1d1d' },
        { orbit: 0.47, size: 6.2, omega: 1.05, phase: 4.2, core: '#d4b896', edge: '#78350f' },
        { orbit: 0.56, size: 5.2, omega: 0.82, phase: 5.0, core: '#e8d5a8', edge: '#92400e', ring: true },
        { orbit: 0.64, size: 4.2, omega: 0.62, phase: 0.8, core: '#7dd3fc', edge: '#0c4a6e' },
        { orbit: 0.72, size: 4.0, omega: 0.52, phase: 2.9, core: '#6366f1', edge: '#1e1b4b' },
      ]

      const timeScale = reducedRef.current ? 0.12 : 1
      /** Global multiplier — lower = slower orbits (visual pacing, not physics). */
      const orbitPace = 0.28

      const drawOrbitRing = (radius: number) => {
        ctx.beginPath()
        ctx.ellipse(cx, cy, radius, radius * flat, 0, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      for (const p of planets) {
        drawOrbitRing(maxOrbit * p.orbit)
      }

      const sunR = Math.max(10, scale * 0.042)
      ctx.save()
      ctx.shadowColor = 'rgba(251, 191, 36, 0.75)'
      ctx.shadowBlur = scale * 0.08
      const sunG = ctx.createRadialGradient(
        cx - sunR * 0.25,
        cy - sunR * 0.25,
        sunR * 0.05,
        cx,
        cy,
        sunR * 1.15,
      )
      sunG.addColorStop(0, '#fffbeb')
      sunG.addColorStop(0.15, '#fef08a')
      sunG.addColorStop(0.45, '#fbbf24')
      sunG.addColorStop(0.75, '#ea580c')
      sunG.addColorStop(1, 'rgba(127, 29, 29, 0.85)')
      ctx.beginPath()
      ctx.arc(cx, cy, sunR, 0, Math.PI * 2)
      ctx.fillStyle = sunG
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'screen'
      ctx.beginPath()
      ctx.arc(cx - sunR * 0.15, cy - sunR * 0.15, sunR * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
      ctx.fill()
      ctx.restore()

      const pos = (body: Body) => {
        const r = maxOrbit * body.orbit
        const ang = body.phase + t * body.omega * timeScale * orbitPace
        return {
          x: cx + r * Math.cos(ang),
          y: cy + r * Math.sin(ang) * flat,
        }
      }

      const drawSphere = (x: number, y: number, rad: number, core: string, edge: string) => {
        const g = ctx.createRadialGradient(x - rad * 0.35, y - rad * 0.35, rad * 0.1, x, y, rad * 1.2)
        g.addColorStop(0, core)
        g.addColorStop(0.55, edge)
        g.addColorStop(1, 'rgba(2, 4, 12, 0.95)')
        ctx.beginPath()
        ctx.arc(x, y, rad, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      for (let i = planets.length - 1; i >= 0; i--) {
        const p = planets[i]!
        const { x, y } = pos(p)
        const pr = Math.max(1.5, p.size * (scale / 900))
        drawSphere(x, y, pr, p.core, p.edge)
        if (p.ring) {
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(-0.35)
          ctx.scale(1, 0.28)
          ctx.beginPath()
          ctx.arc(0, 0, pr * 1.85, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(214, 211, 209, 0.35)'
          ctx.lineWidth = 1.2
          ctx.stroke()
          ctx.restore()
        }
      }
    }

    const drawDepthGrid = (w: number, h: number, t: number) => {
      const vpX = w * 0.5
      const vpY = h * 0.05
      const bottom = h * 0.46
      ctx.save()
      ctx.globalAlpha = 0.12
      for (let i = -12; i <= 12; i++) {
        const xb = w * 0.26 + ((i + 12) / 24) * (w * 0.48)
        ctx.beginPath()
        ctx.moveTo(vpX + i * 3, vpY)
        ctx.lineTo(xb, bottom)
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.08 + Math.abs(i) * 0.008})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
      ctx.globalAlpha = 0.06
      for (let r = 2; r <= 10; r++) {
        const yy = vpY + (r / 10) * (bottom - vpY) * 0.9
        const half = (w * 0.42 * r) / 11
        ctx.beginPath()
        ctx.moveTo(vpX - half, yy)
        ctx.lineTo(vpX + half, yy)
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
        ctx.lineWidth = 0.7
        ctx.stroke()
      }
      ctx.restore()

      if (!reducedRef.current) {
        const scan = (t * 40) % (bottom - vpY)
        ctx.save()
        ctx.globalAlpha = 0.06
        const gy = vpY + scan
        const sg = ctx.createLinearGradient(0, gy - 4, 0, gy + 4)
        sg.addColorStop(0, 'rgba(236, 72, 153, 0)')
        sg.addColorStop(0.5, 'rgba(244, 114, 182, 0.4)')
        sg.addColorStop(1, 'rgba(236, 72, 153, 0)')
        ctx.fillStyle = sg
        ctx.fillRect(w * 0.1, gy - 4, w * 0.8, 8)
        ctx.restore()
      }
    }

    const drawHoloScreen = (x: number, y: number, sw: number, sh: number, t: number, seed: number) => {
      const rand = mulberry32(seed)
      ctx.save()
      ctx.shadowColor = 'rgba(34, 211, 238, 0.45)'
      ctx.shadowBlur = 12
      ctx.fillStyle = 'rgba(2, 12, 24, 0.92)'
      ctx.beginPath()
      ctx.roundRect(x, y, sw, sh, 4)
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.55)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)'
      ctx.lineWidth = 1
      const cols = 10
      const rows = 7
      for (let c = 0; c <= cols; c++) {
        const gx = x + (c / cols) * sw
        ctx.beginPath()
        ctx.moveTo(gx, y + 6)
        ctx.lineTo(gx, y + sh - 6)
        ctx.stroke()
      }
      for (let r = 0; r <= rows; r++) {
        const gy = y + (r / rows) * sh
        ctx.beginPath()
        ctx.moveTo(x + 6, gy)
        ctx.lineTo(x + sw - 6, gy)
        ctx.stroke()
      }

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)'
      ctx.lineWidth = 1
      for (let i = 0; i < 14; i++) {
        const x1 = x + rand() * sw
        const y1 = y + rand() * sh
        const x2 = x + rand() * sw
        const y2 = y + rand() * sh
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      const cx = x + sw * 0.5
      const cy = y + sh * 0.45
      const rad = Math.min(sw, sh) * 0.28
      ctx.beginPath()
      ctx.arc(cx, cy, rad, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)'
      ctx.stroke()
      const sweep = reducedRef.current ? 0 : t * 1.2
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, rad, sweep, sweep + 1.1)
      ctx.closePath()
      ctx.fillStyle = 'rgba(34, 211, 238, 0.08)'
      ctx.fill()

      const scanY = y + 8 + ((t * 35) % (sh - 16))
      ctx.fillStyle = 'rgba(34, 211, 238, 0.07)'
      ctx.fillRect(x + 4, scanY, sw - 8, 2)

      ctx.strokeStyle = 'rgba(103, 232, 249, 0.7)'
      ctx.lineWidth = 1
      const b = 5
      ctx.beginPath()
      ctx.moveTo(x + b, y + b + 8)
      ctx.lineTo(x + b, y + b)
      ctx.lineTo(x + b + 14, y + b)
      ctx.moveTo(x + sw - b - 8, y + b)
      ctx.lineTo(x + sw - b, y + b)
      ctx.lineTo(x + sw - b, y + b + 8)
      ctx.moveTo(x + b, y + sh - b - 8)
      ctx.lineTo(x + b, y + sh - b)
      ctx.lineTo(x + b + 14, y + sh - b)
      ctx.moveTo(x + sw - b - 14, y + sh - b)
      ctx.lineTo(x + sw - b, y + sh - b)
      ctx.lineTo(x + sw - b, y + sh - b - 8)
      ctx.stroke()

      ctx.fillStyle = 'rgba(103, 232, 249, 0.85)'
      ctx.font = `${Math.max(8, sw * 0.045)}px ui-monospace, Consolas, monospace`
      ctx.fillText('NAV-GRID', x + 10, y + 16)
      ctx.fillStyle = 'rgba(34, 211, 238, 0.5)'
      ctx.font = `${Math.max(7, sw * 0.038)}px ui-monospace, Consolas, monospace`
      ctx.fillText(`RNG ${(4200 + Math.sin(t) * 12).toFixed(1)}`, x + 10, y + sh - 10)

      ctx.restore()
    }

    const drawMiniScreen = (
      x: number,
      y: number,
      sw: number,
      sh: number,
      hue: 'amber' | 'green' | 'red',
      t: number,
      label: string,
    ) => {
      const colors = {
        amber: 'rgba(251, 191, 36, 0.85)',
        green: 'rgba(74, 222, 128, 0.85)',
        red: 'rgba(248, 113, 113, 0.85)',
      }[hue]
      ctx.save()
      ctx.fillStyle = 'rgba(4, 8, 16, 0.95)'
      ctx.beginPath()
      ctx.roundRect(x, y, sw, sh, 2)
      ctx.fill()
      ctx.strokeStyle = colors.replace('0.85', '0.4')
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = colors
      ctx.font = `${Math.max(6, sw * 0.12)}px ui-monospace, Consolas, monospace`
      ctx.fillText(label, x + 4, y + 11)
      ctx.fillStyle = colors.replace('0.85', '0.35')
      for (let i = 0; i < 3; i++) {
        const wave =
          Math.sin(t * 2 + i + x * 0.01) * 0.4 + 0.5
        ctx.fillRect(x + 4, y + 14 + i * 4, (sw - 8) * wave, 2)
      }
      ctx.restore()
    }

    const drawNeonSquareButton = (
      cx: number,
      cy: number,
      s: number,
      color: 'red' | 'blue' | 'orange' | 'cyan',
    ) => {
      const map = {
        red: { fill: '#dc2626', glow: 'rgba(248, 113, 113, 0.6)' },
        blue: { fill: '#2563eb', glow: 'rgba(96, 165, 250, 0.55)' },
        orange: { fill: '#ea580c', glow: 'rgba(251, 146, 60, 0.55)' },
        cyan: { fill: '#0891b2', glow: 'rgba(34, 211, 238, 0.55)' },
      }[color]
      ctx.save()
      ctx.shadowColor = map.glow
      ctx.shadowBlur = s * 0.8
      ctx.fillStyle = map.fill
      ctx.beginPath()
      ctx.roundRect(cx - s * 0.5, cy - s * 0.5, s, s, 2)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 0.8
      ctx.stroke()
      ctx.restore()
    }

    const drawFlightStick = (w: number, h: number, t: number) => {
      const cx = w * 0.5
      const baseY = h * 0.72
      const sway = reducedRef.current ? 0 : Math.sin(t * 0.9) * 3

      ctx.save()
      ctx.shadowColor = 'rgba(34, 211, 238, 0.65)'
      ctx.shadowBlur = 20
      const baseG = ctx.createRadialGradient(cx - 8, baseY - 4, 2, cx, baseY, 36)
      baseG.addColorStop(0, 'rgba(103, 232, 249, 0.5)')
      baseG.addColorStop(0.5, 'rgba(8, 47, 73, 0.9)')
      baseG.addColorStop(1, 'rgba(2, 6, 23, 0.95)')
      ctx.fillStyle = baseG
      ctx.beginPath()
      ctx.ellipse(cx, baseY, 32, 14, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      const stemTop = h * 0.54
      const stemGrad = ctx.createLinearGradient(cx - 10, stemTop, cx + 10, baseY)
      stemGrad.addColorStop(0, '#64748b')
      stemGrad.addColorStop(0.5, '#334155')
      stemGrad.addColorStop(1, '#1e293b')
      ctx.strokeStyle = stemGrad
      ctx.lineWidth = 12
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(cx + sway * 0.3, stemTop)
      ctx.quadraticCurveTo(cx + sway, (stemTop + baseY) * 0.5, cx + sway * 0.2, baseY - 8)
      ctx.stroke()

      ctx.fillStyle = '#475569'
      ctx.beginPath()
      ctx.roundRect(cx - 14 + sway * 0.2, stemTop - 18, 28, 22, 4)
      ctx.fill()
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()
    }

    const drawSlider = (x: number, y: number, len: number, vertical: boolean) => {
      ctx.save()
      ctx.fillStyle = 'rgba(4, 8, 18, 0.95)'
      if (vertical) {
        ctx.beginPath()
        ctx.roundRect(x, y, 10, len, 3)
        ctx.fill()
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)'
        ctx.stroke()
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)'
        ctx.fillRect(x + 2, y + len * 0.35, 6, 8)
      } else {
        ctx.beginPath()
        ctx.roundRect(x, y, len, 10, 3)
        ctx.fill()
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.25)'
        ctx.stroke()
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)'
        ctx.fillRect(x + len * 0.4, y + 2, 8, 6)
      }
      ctx.restore()
    }

    const drawPilotSeats = (w: number, h: number) => {
      ctx.save()
      const seatH = h * 0.14
      const g1 = ctx.createLinearGradient(0, h - seatH, w * 0.22, h)
      g1.addColorStop(0, 'rgba(8, 12, 28, 0.95)')
      g1.addColorStop(1, 'rgba(2, 4, 12, 0.98)')
      ctx.fillStyle = g1
      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(0, h - seatH * 0.3)
      ctx.quadraticCurveTo(w * 0.08, h - seatH * 1.1, w * 0.22, h - seatH)
      ctx.lineTo(w * 0.26, h)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)'
      ctx.lineWidth = 1
      ctx.stroke()

      const g2 = ctx.createLinearGradient(w, h - seatH, w * 0.78, h)
      g2.addColorStop(0, 'rgba(8, 12, 28, 0.95)')
      g2.addColorStop(1, 'rgba(2, 4, 12, 0.98)')
      ctx.fillStyle = g2
      ctx.beginPath()
      ctx.moveTo(w, h)
      ctx.lineTo(w, h - seatH * 0.3)
      ctx.quadraticCurveTo(w * 0.92, h - seatH * 1.1, w * 0.78, h - seatH)
      ctx.lineTo(w * 0.74, h)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }

    const drawOverheadPanel = (w: number, h: number, t: number) => {
      const oy = h * 0.04
      const oh = h * 0.034
      const pulse = reducedRef.current ? 1 : 0.88 + Math.sin(t * 2.4) * 0.12
      ctx.save()
      const g = ctx.createLinearGradient(0, 0, 0, oh)
      g.addColorStop(0, 'rgba(15, 23, 42, 0.95)')
      g.addColorStop(1, 'rgba(4, 8, 20, 0.9)')
      ctx.fillStyle = g
      ctx.fillRect(w * 0.08, oy, w * 0.84, oh)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)'
      ctx.strokeRect(w * 0.08 + 0.5, oy + 0.5, w * 0.84 - 1, oh - 1)
      for (let i = 0; i < 18; i++) {
        const lx = w * 0.1 + (i / 17) * w * 0.8
        const hue = i % 4
        const base =
          hue === 0
            ? [34, 211, 238]
            : hue === 1
              ? [236, 72, 153]
              : hue === 2
                ? [251, 191, 36]
                : [74, 222, 128]
        const a = (hue === 0 ? 0.75 : hue === 1 ? 0.65 : hue === 2 ? 0.7 : 0.55) * pulse
        ctx.fillStyle = `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${a})`
        ctx.shadowColor = ctx.fillStyle
        ctx.shadowBlur = 4
        ctx.beginPath()
        ctx.arc(lx, oy + oh * 0.5, 2.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      ctx.fillStyle = 'rgba(103, 232, 249, 0.45)'
      ctx.font = `${Math.max(7, w * 0.011)}px ui-monospace, Consolas, monospace`
      ctx.textAlign = 'center'
      ctx.fillText('SYS · ENV · HULL · LINK', w * 0.5, oy + oh * 0.72)
      ctx.textAlign = 'left'
      ctx.restore()
    }

    const drawCockpitInterior = (w: number, h: number, t: number) => {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(w * 0.08, h * 0.04)
      ctx.lineTo(w * 0.26, h * 0.46)
      ctx.lineTo(0, h * 0.46)
      ctx.lineTo(0, h)
      ctx.closePath()
      const lg = ctx.createLinearGradient(0, 0, w * 0.25, h * 0.5)
      lg.addColorStop(0, 'rgba(12, 18, 42, 0.98)')
      lg.addColorStop(0.6, 'rgba(6, 10, 28, 0.95)')
      lg.addColorStop(1, 'rgba(3, 5, 16, 0.92)')
      ctx.fillStyle = lg
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(w, 0)
      ctx.lineTo(w * 0.92, h * 0.04)
      ctx.lineTo(w * 0.74, h * 0.46)
      ctx.lineTo(w, h * 0.46)
      ctx.lineTo(w, h)
      ctx.closePath()
      const rg = ctx.createLinearGradient(w, 0, w * 0.75, h * 0.5)
      rg.addColorStop(0, 'rgba(12, 18, 42, 0.98)')
      rg.addColorStop(0.6, 'rgba(6, 10, 28, 0.95)')
      rg.addColorStop(1, 'rgba(3, 5, 16, 0.92)')
      ctx.fillStyle = rg
      ctx.fill()

      const dashG = ctx.createLinearGradient(0, h * 0.46, 0, h)
      dashG.addColorStop(0, 'rgba(8, 12, 32, 0.98)')
      dashG.addColorStop(0.4, 'rgba(4, 6, 18, 0.99)')
      dashG.addColorStop(1, 'rgba(2, 3, 10, 1)')
      ctx.fillStyle = dashG
      ctx.fillRect(0, h * 0.46, w, h * 0.54)

      drawOverheadPanel(w, h, t)

      const sw = w * 0.19
      const sh = h * 0.15
      const sy = h * 0.5
      drawHoloScreen(w * 0.06, sy, sw, sh, t, 101)
      drawHoloScreen(w * 0.75, sy, sw, sh, t, 303)

      drawMiniScreen(w * 0.28, h * 0.52, w * 0.1, h * 0.055, 'amber', t, 'AUX-1')
      drawMiniScreen(w * 0.62, h * 0.52, w * 0.1, h * 0.055, 'green', t, 'OK')
      drawMiniScreen(w * 0.4, h * 0.58, w * 0.08, h * 0.045, 'red', t, 'WARN')

      drawSlider(w * 0.04, h * 0.52, h * 0.18, true)
      drawSlider(w * 0.92, h * 0.52, h * 0.18, true)
      drawSlider(w * 0.35, h * 0.66, w * 0.3, false)

      drawFlightStick(w, h, t)

      const bs = Math.min(w, h) * 0.022
      const colPitch = w * 0.052
      const bx0 = w * 0.31 + bs * 0.5
      const row0 = h * 0.765 + bs * 0.5
      const colors: Array<'red' | 'blue' | 'orange' | 'cyan'> = [
        'cyan',
        'red',
        'blue',
        'orange',
        'cyan',
        'red',
        'blue',
        'orange',
        'cyan',
        'red',
      ]
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 5; col++) {
          drawNeonSquareButton(
            bx0 + col * colPitch,
            row0 + row * (bs + 6),
            bs,
            colors[row * 5 + col]!,
          )
        }
      }

      ctx.fillStyle = 'rgba(103, 232, 249, 0.35)'
      ctx.font = `${Math.max(8, w * 0.012)}px ui-monospace, Consolas, monospace`
      ctx.textAlign = 'center'
      ctx.fillText('MANUAL · AUTO · DOCK', w * 0.5, h * 0.93)
      ctx.textAlign = 'left'

      drawPilotSeats(w, h)

      ctx.save()
      ctx.globalCompositeOperation = 'screen'
      const glowL = ctx.createLinearGradient(0, 0, w * 0.15, 0)
      glowL.addColorStop(0, 'rgba(236, 72, 153, 0.12)')
      glowL.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glowL
      ctx.fillRect(0, h * 0.46, w * 0.2, h * 0.54)
      const glowR = ctx.createLinearGradient(w, 0, w * 0.85, 0)
      glowR.addColorStop(0, 'rgba(0,0,0,0)')
      glowR.addColorStop(1, 'rgba(34, 211, 238, 0.1)')
      ctx.fillStyle = glowR
      ctx.fillRect(w * 0.8, h * 0.46, w * 0.2, h * 0.54)
      ctx.restore()
    }

    const drawWindowStruts = (w: number, h: number) => {
      ctx.save()
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.95)'
      ctx.lineWidth = 10
      ctx.lineCap = 'square'
      ctx.beginPath()
      ctx.moveTo(w * 0.5, h * 0.04)
      ctx.lineTo(w * 0.5, h * 0.46)
      ctx.stroke()
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.moveTo(w * 0.32, h * 0.08)
      ctx.lineTo(w * 0.38, h * 0.4)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(w * 0.68, h * 0.08)
      ctx.lineTo(w * 0.62, h * 0.4)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(w * 0.5, h * 0.04)
      ctx.lineTo(w * 0.5, h * 0.46)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(244, 114, 182, 0.12)'
      ctx.beginPath()
      ctx.moveTo(w * 0.08, h * 0.04)
      ctx.lineTo(w * 0.26, h * 0.46)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(w * 0.92, h * 0.04)
      ctx.lineTo(w * 0.74, h * 0.46)
      ctx.stroke()

      const glass = ctx.createLinearGradient(0, h * 0.15, 0, h * 0.46)
      glass.addColorStop(0, 'rgba(34, 211, 238, 0)')
      glass.addColorStop(0.5, 'rgba(34, 211, 238, 0.03)')
      glass.addColorStop(1, 'rgba(236, 72, 153, 0.05)')
      ctx.fillStyle = glass
      windscreenPath(w, h)
      ctx.fill()
      ctx.restore()
    }

    const frame = (time: number) => {
      if (!alive) return
      const w = window.innerWidth
      const h = window.innerHeight
      const t = time * 0.001

      ctx.fillStyle = '#030208'
      ctx.fillRect(0, 0, w, h)

      ctx.save()
      windscreenPath(w, h)
      ctx.clip()

      drawCyberNebula(w, h, t)
      drawDepthGrid(w, h, t)

      const stars = starsRef.current
      const twBase = reducedRef.current ? 0 : Math.sin(t * 0.8) * 0.06
      for (const s of stars) {
        const amp = [3, 1.6, 0.7][s.depth]
        const px = reducedRef.current
          ? 0
          : Math.sin(t * (0.25 + s.depth * 0.15) + s.phase) * amp
        const py = reducedRef.current
          ? 0
          : Math.cos(t * (0.2 + s.depth * 0.1) + s.phase * 0.7) * amp * 0.6
        const dim = 0.5 + s.depth * 0.2
        const a = Math.max(
          0.04,
          Math.min(
            0.92,
            (0.1 + s.tw * 0.5 * dim + twBase * Math.sin(s.phase + t * 1.2)) * (0.75 + s.depth * 0.1),
          ),
        )
        const pink = Math.sin(s.phase * 1.3 + s.x * 0.01) > 0.35
        ctx.fillStyle = pink
          ? `rgba(255, 220, 235, ${a})`
          : `rgba(255, 255, 255, ${a})`
        ctx.beginPath()
        ctx.arc(s.x + px, s.y + py, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      drawSolarSystem(w, h, t)

      ctx.restore()

      drawCockpitInterior(w, h, t)
      drawWindowStruts(w, h)

      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(frame)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="about-cockpit-canvas" aria-hidden />
}
