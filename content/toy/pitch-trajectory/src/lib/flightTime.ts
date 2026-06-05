import { RELEASE_DISTANCE_FT } from '../data/pitches.ts'

/** Feet per second per mph. */
export const FT_PER_MPH = 5280 / 3600

/** Standard gravity (ft/s²). */
export const GRAVITY_FT_S2 = 32.174

/** Real-world flight time from release point to plate (seconds). */
export function flightTimeSec(
  speedMph: number,
  speedMultiplier = 1,
  releaseAngleDeg = 0,
): number {
  const speedFps = speedMph * FT_PER_MPH
  const vz0 = speedFps * Math.cos((releaseAngleDeg * Math.PI) / 180)
  return RELEASE_DISTANCE_FT / vz0 / speedMultiplier
}

/** Real-world flight time from release point to plate (ms). */
export function flightTimeMs(
  speedMph: number,
  speedMultiplier = 1,
  releaseAngleDeg = 0,
): number {
  return flightTimeSec(speedMph, speedMultiplier, releaseAngleDeg) * 1000
}

export function formatFlightTime(ms: number): string {
  return `${(ms / 1000).toFixed(2)}초`
}
