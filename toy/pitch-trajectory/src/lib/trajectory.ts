import type { PitchDefinition } from '../data/pitches.ts'
import { RELEASE_DISTANCE_FT } from '../data/pitches.ts'
import { FT_PER_MPH, flightTimeSec, GRAVITY_FT_S2 } from './flightTime.ts'

/** 3D world coords (feet). X = horizontal, Y = height, Z = distance from plate toward mound. */
export interface Point3D {
  x: number
  y: number
  z: number
}

export interface PitchTrajectory {
  path3D: Point3D[]
  reference3D: Point3D[]
}

const SAMPLE_COUNT = 80

function easeInCubic(t: number): number {
  return t * t * t
}

/** Late-phase emphasis for pitches that break near the plate. */
function lateBreakFactor(t: number, lateBreakRatio: number): number {
  const threshold = 1 - lateBreakRatio
  if (t <= threshold) return 0
  const local = (t - threshold) / (1 - threshold)
  return easeInCubic(local)
}

/**
 * Break accumulates from release (t²) with optional late emphasis.
 * At t=1 always reaches full break amount.
 */
function breakShape(t: number, lateBreakRatio: number): number {
  const quadratic = t * t
  const late = lateBreakFactor(t, lateBreakRatio)
  return quadratic * (1 - lateBreakRatio) + late * lateBreakRatio
}

/** Spinless ballistic height at normalized progress t (0 = release, 1 = plate). */
export function spinlessHeightFt(
  releaseHeightFt: number,
  speedMph: number,
  t: number,
  releaseAngleDeg = 0,
): number {
  const speedFps = speedMph * FT_PER_MPH
  const rad = (releaseAngleDeg * Math.PI) / 180
  const vy0 = speedFps * Math.sin(rad)
  const flightSec = flightTimeSec(speedMph, 1, releaseAngleDeg)
  const elapsed = t * flightSec
  return (
    releaseHeightFt + vy0 * elapsed - 0.5 * GRAVITY_FT_S2 * elapsed * elapsed
  )
}

/** Deterministic flutter for knuckleball (inches). */
function knuckleNoise(seed: string, t: number): { hx: number; hy: number } {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const phase = hash * 0.001
  return {
    hx: Math.sin(t * 28 + phase) * 2.5 + Math.sin(t * 17 + phase * 2) * 1.2,
    hy: Math.cos(t * 23 + phase * 1.5) * 1.8,
  }
}

export function buildTrajectory(pitch: PitchDefinition): PitchTrajectory {
  const { params } = pitch
  const path3D: Point3D[] = []
  const reference3D: Point3D[] = []

  const startZ = RELEASE_DISTANCE_FT
  const endZ = 0

  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const t = i / SAMPLE_COUNT
    const z = startZ + (endZ - startZ) * t

    const ySpinless = spinlessHeightFt(
      params.releaseHeightFt,
      params.speedMph,
      t,
      params.releaseAngleDeg,
    )
    const shape = breakShape(t, params.lateBreakRatio)
    const ivbFt = (params.verticalBreakIn / 12) * shape
    const hbFt = (params.horizontalBreakIn / 12) * shape

    let catchXIn = hbFt * 12
    let catchYFt = ySpinless + ivbFt

    if (pitch.id === 'knuckleball') {
      const n = knuckleNoise(pitch.id, t)
      const flutter = Math.sin(t * Math.PI)
      catchXIn += n.hx * flutter
      catchYFt += (n.hy / 12) * flutter
    }

    path3D.push({
      x: catchXIn / 12,
      y: catchYFt,
      z,
    })
    reference3D.push({
      x: 0,
      y: ySpinless,
      z,
    })
  }

  return { path3D, reference3D }
}

export function interpolatePoint3D(points: Point3D[], progress: number): Point3D {
  if (points.length === 0) return { x: 0, y: 0, z: 0 }
  if (progress <= 0) return points[0]
  if (progress >= 1) return points[points.length - 1]

  const scaled = progress * (points.length - 1)
  const index = Math.floor(scaled)
  const frac = scaled - index
  const a = points[index]
  const b = points[index + 1]
  return {
    x: a.x + (b.x - a.x) * frac,
    y: a.y + (b.y - a.y) * frac,
    z: a.z + (b.z - a.z) * frac,
  }
}

export function endsAtPlate3D(points: Point3D[]): boolean {
  const last = points[points.length - 1]
  return Math.abs(last.z) < 0.01
}

/** Plate-crossing height (ft) for a built trajectory. */
export function plateCrossingHeightFt(pitch: PitchDefinition): number {
  const { path3D } = buildTrajectory(pitch)
  return path3D[path3D.length - 1].y
}
