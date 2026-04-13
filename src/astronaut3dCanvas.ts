/**
 * Lightweight software-rendered 3D astronaut (weak perspective + lambert shading).
 * Animated over time for depth — no bitmap sprite.
 */

type Mat = 'suit' | 'orange' | 'visor' | 'pack' | 'boot'

type Vec3 = { x: number; y: number; z: number }

type Tri = { a: Vec3; b: Vec3; c: Vec3; n: Vec3; mat: Mat }

type DrawTri = {
  ax: number
  ay: number
  bx: number
  by: number
  cx: number
  cy: number
  zSort: number
  mat: Mat
  lambert: number
}

const CAM_Z = 5.4

function v(x: number, y: number, z: number): Vec3 {
  return { x, y, z }
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

function len(a: Vec3): number {
  return Math.hypot(a.x, a.y, a.z)
}

function norm(a: Vec3): Vec3 {
  const L = len(a) || 1
  return { x: a.x / L, y: a.y / L, z: a.z / L }
}

function triNormal(a: Vec3, b: Vec3, c: Vec3): Vec3 {
  return norm(cross(sub(b, a), sub(c, a)))
}

function rotX(p: Vec3, ang: number): Vec3 {
  const c = Math.cos(ang)
  const s = Math.sin(ang)
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
}

function rotY(p: Vec3, ang: number): Vec3 {
  const c = Math.cos(ang)
  const s = Math.sin(ang)
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }
}

function rotZ(p: Vec3, ang: number): Vec3 {
  const c = Math.cos(ang)
  const s = Math.sin(ang)
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z }
}

function transform(p: Vec3, angX: number, angY: number, angZ: number, flip: 1 | -1): Vec3 {
  let q = flip < 0 ? { x: -p.x, y: p.y, z: p.z } : p
  q = rotY(q, angY)
  q = rotX(q, angX)
  q = rotZ(q, angZ)
  return q
}

function transformN(n: Vec3, angX: number, angY: number, angZ: number, flip: 1 | -1): Vec3 {
  let q = flip < 0 ? { x: -n.x, y: n.y, z: n.z } : n
  q = rotY(q, angY)
  q = rotX(q, angX)
  q = rotZ(q, angZ)
  return norm(q)
}

function pushTri(out: Tri[], a: Vec3, b: Vec3, c: Vec3, mat: Mat) {
  const n = triNormal(a, b, c)
  out.push({ a, b, c, n, mat })
}

function pushBoxTris(out: Tri[], c: Vec3, hx: number, hy: number, hz: number, mat: Mat) {
  const { x: cx, y: cy, z: cz } = c
  const x0 = cx - hx
  const x1 = cx + hx
  const y0 = cy - hy
  const y1 = cy + hy
  const z0 = cz - hz
  const z1 = cz + hz
  const p = (x: number, y: number, z: number) => v(x, y, z)
  pushTri(out, p(x1, y0, z0), p(x1, y1, z0), p(x1, y1, z1), mat)
  pushTri(out, p(x1, y0, z0), p(x1, y1, z1), p(x1, y0, z1), mat)
  pushTri(out, p(x0, y0, z1), p(x0, y1, z1), p(x0, y1, z0), mat)
  pushTri(out, p(x0, y0, z1), p(x0, y1, z0), p(x0, y0, z0), mat)
  pushTri(out, p(x0, y1, z0), p(x1, y1, z0), p(x1, y1, z1), mat)
  pushTri(out, p(x0, y1, z0), p(x1, y1, z1), p(x0, y1, z1), mat)
  pushTri(out, p(x0, y0, z1), p(x1, y0, z1), p(x1, y0, z0), mat)
  pushTri(out, p(x0, y0, z1), p(x1, y0, z0), p(x0, y0, z0), mat)
  pushTri(out, p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), mat)
  pushTri(out, p(x0, y0, z1), p(x1, y1, z1), p(x0, y1, z1), mat)
  pushTri(out, p(x0, y1, z0), p(x1, y1, z0), p(x1, y0, z0), mat)
  pushTri(out, p(x0, y1, z0), p(x1, y0, z0), p(x0, y0, z0), mat)
}

function pushOctaTris(out: Tri[], c: Vec3, r: number, mat: Mat) {
  const s = [
    v(r, 0, 0),
    v(-r, 0, 0),
    v(0, r, 0),
    v(0, -r, 0),
    v(0, 0, r),
    v(0, 0, -r),
  ].map((p) => v(p.x + c.x, p.y + c.y, p.z + c.z))
  const faces: [number, number, number][] = [
    [0, 4, 2],
    [0, 2, 5],
    [0, 5, 3],
    [0, 3, 4],
    [1, 2, 4],
    [1, 5, 2],
    [1, 3, 5],
    [1, 4, 3],
  ]
  for (const [i, j, k] of faces) {
    pushTri(out, s[i], s[j], s[k], mat)
  }
}

function buildAstronautTris(): Tri[] {
  const out: Tri[] = []
  pushBoxTris(out, v(0, 0.34, 0), 0.28, 0.38, 0.2, 'suit')
  pushBoxTris(out, v(0, -0.02, 0), 0.26, 0.1, 0.19, 'suit')
  pushBoxTris(out, v(0, 0.06, 0), 0.3, 0.055, 0.21, 'orange')
  pushBoxTris(out, v(-0.32, 0.26, -0.12), 0.12, 0.32, 0.11, 'pack')
  pushOctaTris(out, v(0, 0.92, -0.02), 0.23, 'suit')
  pushBoxTris(out, v(0, 0.92, 0.2), 0.14, 0.11, 0.045, 'visor')
  pushBoxTris(out, v(-0.42, 0.46, 0), 0.2, 0.1, 0.1, 'suit')
  pushBoxTris(out, v(-0.68, 0.36, 0.04), 0.16, 0.08, 0.08, 'suit')
  pushBoxTris(out, v(-0.58, 0.38, 0), 0.08, 0.06, 0.09, 'orange')
  pushBoxTris(out, v(-0.82, 0.32, 0.05), 0.1, 0.09, 0.09, 'boot')
  pushBoxTris(out, v(0.36, 0.5, 0.02), 0.18, 0.1, 0.1, 'suit')
  pushBoxTris(out, v(0.58, 0.68, 0.08), 0.18, 0.12, 0.1, 'suit')
  pushBoxTris(out, v(0.48, 0.58, 0.04), 0.08, 0.07, 0.09, 'orange')
  pushBoxTris(out, v(0.72, 0.78, 0.1), 0.11, 0.1, 0.1, 'boot')
  pushBoxTris(out, v(-0.13, -0.42, 0), 0.1, 0.32, 0.1, 'suit')
  pushBoxTris(out, v(0.12, -0.42, 0), 0.1, 0.32, 0.1, 'suit')
  pushBoxTris(out, v(-0.13, -0.68, 0), 0.09, 0.055, 0.09, 'orange')
  pushBoxTris(out, v(0.12, -0.68, 0), 0.09, 0.055, 0.09, 'orange')
  pushBoxTris(out, v(-0.13, -0.86, 0.02), 0.11, 0.08, 0.12, 'boot')
  pushBoxTris(out, v(0.12, -0.86, 0.02), 0.11, 0.08, 0.12, 'boot')
  pushBoxTris(out, v(0, 0.34, 0.21), 0.12, 0.1, 0.025, 'pack')
  return out
}

const BASE = buildAstronautTris()

const LIGHT = norm(v(0.45, -0.55, 0.65))

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function shadeRgba(mat: Mat, lambert: number, alpha: number): string {
  const t = Math.max(0.12, Math.min(1, lambert * 0.82 + 0.18))
  switch (mat) {
    case 'suit': {
      const r = Math.round(lerp(188, 252, t))
      const g = Math.round(lerp(198, 252, t))
      const b = Math.round(lerp(210, 255, t))
      return `rgba(${r},${g},${b},${alpha})`
    }
    case 'orange': {
      const r = Math.round(lerp(200, 255, t))
      const g = Math.round(lerp(90, 170, t))
      const b = Math.round(lerp(35, 90, t))
      return `rgba(${r},${g},${b},${alpha})`
    }
    case 'visor': {
      const spec = Math.pow(Math.max(0, lambert), 3)
      const r = Math.round(lerp(8, 90, t) + spec * 60)
      const g = Math.round(lerp(40, 180, t) + spec * 100)
      const b = Math.round(lerp(70, 210, t) + spec * 90)
      return `rgba(${r},${g},${b},${alpha})`
    }
    case 'pack': {
      const r = Math.round(lerp(55, 110, t))
      const g = Math.round(lerp(65, 125, t))
      const b = Math.round(lerp(80, 145, t))
      return `rgba(${r},${g},${b},${alpha})`
    }
    case 'boot': {
      const r = Math.round(lerp(85, 150, t))
      const g = Math.round(lerp(95, 165, t))
      const b = Math.round(lerp(110, 185, t))
      return `rgba(${r},${g},${b},${alpha})`
    }
    default:
      return `rgba(200,210,220,${alpha})`
  }
}

function project(p: Vec3): { x: number; y: number } {
  const dz = CAM_Z - p.z
  const k = dz > 0.12 ? CAM_Z / dz : 7.5
  return { x: p.x * k, y: -p.y * k }
}

const scratchTris: DrawTri[] = []

export function drawAstronaut3D(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  screenY: number,
  pixelScale: number,
  secs: number,
  phase: number,
  flip: 1 | -1,
  alpha: number,
  reducedMotion: boolean,
  pointerYaw: number,
) {
  const angY = (reducedMotion ? 0.35 : secs * 0.52) + phase + pointerYaw * 0.55
  const angX = reducedMotion ? 0.22 : 0.32 * Math.sin(secs * 0.41 + phase * 1.3)
  const angZ = reducedMotion ? 0.08 : 0.2 * Math.sin(secs * 0.33 + phase * 2.1)

  scratchTris.length = 0

  for (let i = 0; i < BASE.length; i++) {
    const T = BASE[i]
    const a = transform(T.a, angX, angY, angZ, flip)
    const b = transform(T.b, angX, angY, angZ, flip)
    const c = transform(T.c, angX, angY, angZ, flip)
    const n = transformN(T.n, angX, angY, angZ, flip)
    const lambert = Math.max(0, n.x * LIGHT.x + n.y * LIGHT.y + n.z * LIGHT.z)

    const pa = project(a)
    const pb = project(b)
    const pc = project(c)
    const zSort = (a.z + b.z + c.z) / 3
    const mx = (a.x + b.x + c.x) / 3
    const my = (a.y + b.y + c.y) / 3
    const mz = (a.z + b.z + c.z) / 3
    const vx = -mx
    const vy = -my
    const vz = CAM_Z - mz
    const vlen = Math.hypot(vx, vy, vz) || 1
    if ((n.x * vx + n.y * vy + n.z * vz) / vlen < 0.02) continue

    scratchTris.push({
      ax: pa.x,
      ay: pa.y,
      bx: pb.x,
      by: pb.y,
      cx: pc.x,
      cy: pc.y,
      zSort,
      mat: T.mat,
      lambert,
    })
  }

  scratchTris.sort((u, v) => u.zSort - v.zSort)

  ctx.save()
  ctx.translate(screenX, screenY)
  ctx.scale(pixelScale, pixelScale)

  ctx.fillStyle = `rgba(0,0,0,${alpha * 0.35})`
  ctx.beginPath()
  ctx.ellipse(0, 1.15, 0.95, 0.28, 0, 0, Math.PI * 2)
  ctx.fill()

  for (let i = 0; i < scratchTris.length; i++) {
    const q = scratchTris[i]
    ctx.beginPath()
    ctx.moveTo(q.ax, q.ay)
    ctx.lineTo(q.bx, q.by)
    ctx.lineTo(q.cx, q.cy)
    ctx.closePath()
    ctx.fillStyle = shadeRgba(q.mat, q.lambert, alpha)
    ctx.fill()
    ctx.strokeStyle = `rgba(15,23,42,${alpha * 0.14})`
    ctx.lineWidth = 0.02
    ctx.stroke()
  }

  ctx.restore()
}
