import type { PlayerRatings } from '../types'
import type { BatterSourceStats } from '../types'

const LEAGUE = {
  woba: 0.335,
  iso: 0.145,
  bbPct: 0.085,
  kPct: 0.205,
}

function clamp(n: number, min = 1, max = 99) {
  return Math.max(min, Math.min(max, Math.round(n)))
}

function toRating(value: number, league: number, spread: number, base = 55): number {
  const z = (value - league) / spread
  return clamp(base + z * 12)
}

export function batterRatingsFromStats(stats: BatterSourceStats): PlayerRatings {
  const woba = stats.woba ?? LEAGUE.woba
  const iso = stats.iso ?? LEAGUE.iso
  const bb = stats.bbPct ?? LEAGUE.bbPct
  const k = stats.kPct ?? LEAGUE.kPct
  const paFactor = stats.pa >= 200 ? 1 : 0.85

  const contact = toRating(woba, LEAGUE.woba, 0.04, 58) * paFactor * (1 - (k - LEAGUE.kPct) * 0.4)
  const power = toRating(iso, LEAGUE.iso, 0.06, 52) * paFactor
  const eye = toRating(bb, LEAGUE.bbPct, 0.025, 55) * paFactor
  const speed = clamp(50 + (stats.sb ?? 0) * 1.2)
  const fielding = clamp((contact + eye) / 2 - 2)

  return {
    contact: clamp(contact),
    power: clamp(power),
    eye: clamp(eye),
    speed,
    fielding,
    velocity: 28,
    control: 25,
    movement: 22,
    stamina: 55,
  }
}
