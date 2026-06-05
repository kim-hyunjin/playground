import { describe, expect, it } from 'vitest'
import { flightTimeMs } from './flightTime.ts'

describe('flightTimeMs', () => {
  it('computes ~395ms for 95mph at 1x (55ft release to plate)', () => {
    expect(flightTimeMs(95, 1)).toBeCloseTo(395, 0)
  })

  it('slows down with speed multiplier', () => {
    expect(flightTimeMs(95, 0.25)).toBeCloseTo(flightTimeMs(95, 1) * 4, 1)
  })

  it('faster pitch has shorter flight time', () => {
    expect(flightTimeMs(95, 1)).toBeLessThan(flightTimeMs(85, 1))
  })
})
