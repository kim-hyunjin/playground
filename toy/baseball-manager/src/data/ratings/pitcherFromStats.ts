import type { PlayerRatings } from '../types'
import type { PitcherSourceStats } from '../types'

const LEAGUE = {
  era: 4.35,
  fip: 4.45,
  k9: 7.8,
  bb9: 3.4,
}

function clamp(n: number, min = 1, max = 99) {
  return Math.max(min, Math.min(max, Math.round(n)))
}

function lowerIsBetter(value: number, league: number, spread: number, base = 58): number {
  const z = (league - value) / spread
  return clamp(base + z * 10)
}

function higherIsBetter(value: number, league: number, spread: number, base = 55): number {
  const z = (value - league) / spread
  return clamp(base + z * 10)
}

export function pitcherRatingsFromStats(stats: PitcherSourceStats, role: 'SP' | 'RP'): PlayerRatings {
  const ipFactor = stats.ip >= 80 ? 1 : stats.ip >= 40 ? 0.92 : 0.82
  const era = stats.era ?? LEAGUE.era
  const fip = stats.fip ?? LEAGUE.fip
  const k9 = stats.k9 ?? LEAGUE.k9
  const bb9 = stats.bb9 ?? LEAGUE.bb9
  const gsRate = stats.games ? (stats.gs ?? 0) / stats.games : role === 'SP' ? 0.8 : 0.1

  const control = lowerIsBetter(bb9, LEAGUE.bb9, 1.2, 56) * ipFactor
  const movement = ((lowerIsBetter(fip, LEAGUE.fip, 0.8, 57) + lowerIsBetter(era, LEAGUE.era, 0.9, 57)) / 2) * ipFactor
  const velocity = higherIsBetter(k9, LEAGUE.k9, 2.5, 54) * ipFactor
  const stamina = role === 'SP'
    ? clamp(52 + gsRate * 25 + Math.min(stats.ip, 150) * 0.08)
    : clamp(48 + Math.min(stats.ip, 70) * 0.15)

  return {
    contact: 32,
    power: 28,
    eye: 30,
    speed: 38,
    fielding: 45,
    velocity: clamp(velocity),
    control: clamp(control),
    movement: clamp(movement),
    stamina: clamp(stamina),
  }
}
