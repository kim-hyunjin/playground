import type { PlayerRole, RosterLevel } from '../../../types/game'
import type { BatterSourceStats, PitcherSourceStats, PlayerRecord, TeamAbbr } from '../../types'
import { batterRatingsFromStats } from '../../ratings/batterFromStats'
import { pitcherRatingsFromStats } from '../../ratings/pitcherFromStats'
import { ratingsFromOvr } from '../../ratings/ovrToRatings'

function slug(name: string): string {
  return name.replace(/\s+/g, '')
}

export function pid(team: TeamAbbr, name: string): string {
  return `${team}-${slug(name)}`
}

export function batter(
  team: TeamAbbr,
  name: string,
  role: PlayerRole,
  age: number,
  ovr: number,
  opts: {
    rosterLevel?: RosterLevel
    salaryKrw?: number
    sourceStats?: BatterSourceStats
    potential?: number
  } = {},
): PlayerRecord {
  return {
    id: pid(team, name),
    name,
    teamAbbr: team,
    role,
    rosterLevel: opts.rosterLevel ?? 'first',
    age,
    salaryKrw: opts.salaryKrw,
    ratings: opts.sourceStats ? batterRatingsFromStats(opts.sourceStats) : ratingsFromOvr(role, ovr),
    potential: opts.potential,
  }
}

export function pitcher(
  team: TeamAbbr,
  name: string,
  role: 'SP' | 'RP',
  age: number,
  ovr: number,
  opts: {
    rosterLevel?: RosterLevel
    salaryKrw?: number
    sourceStats?: PitcherSourceStats
    potential?: number
  } = {},
): PlayerRecord {
  return {
    id: pid(team, name),
    name,
    teamAbbr: team,
    role,
    rosterLevel: opts.rosterLevel ?? 'first',
    age,
    salaryKrw: opts.salaryKrw,
    ratings: opts.sourceStats
      ? pitcherRatingsFromStats(opts.sourceStats, role)
      : ratingsFromOvr(role, ovr),
    potential: opts.potential,
  }
}
