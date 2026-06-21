import type { PlayerRole, RosterLevel } from '../../../types/game'
import type { BatterSourceStats, PitcherSourceStats, PlayerRecord, TeamAbbr } from '../../types'
import { batterSourceForOvr, pitcherSourceForOvr } from '../../ratings/statsProfiles'

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
    sourceStats: opts.sourceStats ?? batterSourceForOvr(ovr, role),
    potential: opts.potential,
    targetOvr: ovr,
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
    sourceStats: opts.sourceStats ?? pitcherSourceForOvr(ovr, role),
    potential: opts.potential,
    targetOvr: ovr,
  }
}
