import { describe, expect, it } from 'vitest'
import { PITCHES } from '../data/pitches.ts'
import {
  buildTrajectory,
  endsAtPlate3D,
  interpolatePoint3D,
  plateCrossingHeightFt,
  spinlessHeightFt,
} from './trajectory.ts'

const ZONE_BOTTOM_FT = 1.5
const ZONE_TOP_FT = 3.5

describe('trajectory', () => {
  it('ends at plate for all pitches', () => {
    for (const pitch of PITCHES) {
      const { path3D } = buildTrajectory(pitch)
      expect(endsAtPlate3D(path3D)).toBe(true)
    }
  })

  it('four-seam crosses within strike zone', () => {
    const pitch = PITCHES.find((p) => p.id === 'four-seam')!
    const y = plateCrossingHeightFt(pitch)
    expect(y).toBeGreaterThan(ZONE_BOTTOM_FT)
    expect(y).toBeLessThan(ZONE_TOP_FT)
  })

  it('all pitches cross above ground', () => {
    for (const pitch of PITCHES) {
      const y = plateCrossingHeightFt(pitch)
      expect(y, pitch.id).toBeGreaterThan(0.5)
    }
  })

  it('interpolatePoint3D at 0 and 1 returns endpoints', () => {
    const { path3D } = buildTrajectory(PITCHES[0])
    expect(interpolatePoint3D(path3D, 0)).toEqual(path3D[0])
    expect(interpolatePoint3D(path3D, 1)).toEqual(path3D[path3D.length - 1])
  })

  it('four-seam has less horizontal break than slider', () => {
    const fourSeam = buildTrajectory(PITCHES.find((p) => p.id === 'four-seam')!)
    const slider = buildTrajectory(PITCHES.find((p) => p.id === 'slider')!)
    const fourBreak = Math.abs(fourSeam.path3D.at(-1)!.x)
    const sliderBreak = Math.abs(slider.path3D.at(-1)!.x)
    expect(fourBreak).toBeLessThan(sliderBreak)
  })

  it('positive IVB crosses higher than spinless reference at plate', () => {
    const fourSeam = buildTrajectory(PITCHES.find((p) => p.id === 'four-seam')!)
    const pathY = fourSeam.path3D.at(-1)!.y
    const refY = fourSeam.reference3D.at(-1)!.y
    expect(pathY).toBeGreaterThan(refY)
  })

  it('slower pitch with same IVB drops lower than fastball (gravity)', () => {
    const fast = PITCHES.find((p) => p.id === 'four-seam')!
    const slow = PITCHES.find((p) => p.id === 'curve')!
    expect(plateCrossingHeightFt(slow)).toBeLessThan(plateCrossingHeightFt(fast))
  })

  it('spinless height follows gravity parabola', () => {
    const y0 = spinlessHeightFt(6, 95, 0)
    const y1 = spinlessHeightFt(6, 95, 1)
    expect(y0).toBeCloseTo(6, 2)
    expect(y1).toBeLessThan(y0)
  })

  it('knuckleball path is deterministic', () => {
    const pitch = PITCHES.find((p) => p.id === 'knuckleball')!
    const a = buildTrajectory(pitch)
    const b = buildTrajectory(pitch)
    expect(a.path3D[40]).toEqual(b.path3D[40])
  })

  it('3D path spans release to plate on Z axis', () => {
    const { path3D } = buildTrajectory(PITCHES[0])
    expect(path3D[0].z).toBeGreaterThan(path3D.at(-1)!.z)
    expect(path3D.at(-1)!.z).toBeCloseTo(0, 1)
    expect(path3D[0].y).toBeGreaterThan(path3D.at(-1)!.y)
  })
})
