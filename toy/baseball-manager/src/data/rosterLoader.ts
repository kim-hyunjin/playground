import type { Player, Team } from '../types/game'
import { emptyBatterStats, emptyPitcherStats } from '../types/game'
import { generateDefaultStaff } from '../engine/coachGenerator'
import { generatePlayer, isPitcher, overallRating, TEAM_DEFS } from '../engine/generator'
import { defaultPotentialForPlayer } from '../engine/playerDevelopment'
import { contractYearsForPlayer } from '../engine/contracts'
import { FIRST_TEAM_MAX, FARM_TEAM_MAX } from '../engine/roster'
import { batterRatingsFromStats } from './ratings/batterFromStats'
import { pitcherRatingsFromStats } from './ratings/pitcherFromStats'
import { ratingsFromOvr } from './ratings/ovrToRatings'
import { estimateSalaryFromOvr, salaryKrwToGame } from './ratings/salaryScale'
import { ensureHandedness } from '../engine/sim/handedness'
import type { BatterSourceStats, PitcherSourceStats, PlayerRecord, PlayerRatings, TeamAbbr, TeamRosterFile } from './types'
import { getRosterFiles } from './playerDataset'
import { newPlayerId } from '../lib/playerId'

export const DATA_SEASON = 2026

const FARM_FILL_TEMPLATE = [
  'C', '2B', 'SS', 'LF', 'CF', 'RF',
  'SP', 'SP', 'SP', 'RP', 'RP', 'RP', 'RP', 'RP', 'RP',
] as const

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function resolveRatings(record: PlayerRecord): PlayerRatings {
  if (record.sourceStats) {
    if ('pa' in record.sourceStats) {
      return batterRatingsFromStats(record.sourceStats as BatterSourceStats)
    }
    return pitcherRatingsFromStats(
      record.sourceStats as PitcherSourceStats,
      record.role === 'SP' ? 'SP' : 'RP',
    )
  }
  if (record.ratings) {
    const anchor = ratingsFromOvr(record.role, 55)
    return { ...anchor, ...record.ratings }
  }
  return ratingsFromOvr(record.role, 55)
}

export function playerFromRecord(record: PlayerRecord): Player {
  return recordToPlayer(record)
}

function clampStat(n: number, min = 1, max = 99) {
  return Math.max(min, Math.min(max, Math.round(n)))
}

function alignRatingsToTarget(record: PlayerRecord, ratings: PlayerRatings): PlayerRatings {
  const target = record.targetOvr
  if (target == null) return ratings

  const probe = { ...ratings, role: record.role, rosterLevel: record.rosterLevel } as Player
  const current = overallRating(probe)
  const delta = target - current
  if (Math.abs(delta) < 1) return ratings

  const isPitcherRole = record.role === 'SP' || record.role === 'RP'
  if (isPitcherRole) {
    return {
      ...ratings,
      velocity: clampStat(ratings.velocity + delta),
      control: clampStat(ratings.control + delta),
      movement: clampStat(ratings.movement + delta),
      stamina: clampStat(ratings.stamina + delta),
    }
  }

  return {
    ...ratings,
    contact: clampStat(ratings.contact + delta),
    power: clampStat(ratings.power + delta),
    eye: clampStat(ratings.eye + delta),
    speed: clampStat(ratings.speed + delta),
    fielding: clampStat(ratings.fielding + delta),
  }
}

function recordToPlayer(record: PlayerRecord): Player {
  const ratings = alignRatingsToTarget(record, resolveRatings(record))
  const partial: Omit<Player, 'potential' | 'developmentXp'> = {
    id: record.id,
    name: record.name,
    age: record.age,
    role: record.role,
    rosterLevel: record.rosterLevel,
    ...ratings,
    salary: record.salaryKrw
      ? salaryKrwToGame(record.salaryKrw)
      : estimateSalaryFromOvr(
          overallRating({ ...ratings, role: record.role } as Player),
          record.age,
          isPitcher({ role: record.role } as Player),
        ),
    morale: rand(68, 94),
    fatigue: rand(0, 12),
    seasonStats: isPitcher({ role: record.role } as Player)
      ? emptyPitcherStats()
      : emptyBatterStats(),
    farmSeasonStats: isPitcher({ role: record.role } as Player)
      ? emptyPitcherStats()
      : emptyBatterStats(),
    realPlayerId: record.generated ? undefined : record.id,
    dataSeason: record.generated ? undefined : DATA_SEASON,
    isGenerated: record.generated ?? false,
  }

  const player = {
    ...partial,
    potential: record.potential ?? 0,
    developmentXp: 0,
  } as Player

  player.potential = record.potential ?? defaultPotentialForPlayer(player)
  player.contractYears = contractYearsForPlayer(player)
  if (record.bats) player.bats = record.bats
  if (record.throws) player.throws = record.throws
  if (record.pitchingStyle) player.pitchingStyle = record.pitchingStyle
  return ensureHandedness(player)
}

function fillFarmGaps(players: Player[]): Player[] {
  const farmCount = players.filter((p) => p.rosterLevel === 'farm').length
  const need = Math.min(FARM_TEAM_MAX, 28) - farmCount
  if (need <= 0) return players

  const filled = [...players]
  for (let i = 0; i < need; i++) {
    const role = FARM_FILL_TEMPLATE[i % FARM_FILL_TEMPLATE.length]!
    const tier = i < 3 ? 'avg' : 'weak'
    const gen = generatePlayer(role, tier, { rosterLevel: 'farm', ageMin: 18, ageMax: 24 })
    gen.id = newPlayerId()
    gen.name = `(퓨처스) ${gen.name}`
    gen.isGenerated = true
    gen.realPlayerId = undefined
    gen.dataSeason = undefined
    filled.push(gen)
  }
  return filled
}

export function validateRosterFile(file: TeamRosterFile): string[] {
  const errors: string[] = []
  const ids = new Set<string>()

  for (const list of [file.first, file.farm]) {
    for (const r of list) {
      if (r.teamAbbr !== file.teamAbbr) {
        errors.push(`${r.id}: teamAbbr mismatch`)
      }
      if (ids.has(r.id)) errors.push(`duplicate id: ${r.id}`)
      ids.add(r.id)
    }
  }

  if (file.first.length !== FIRST_TEAM_MAX) {
    errors.push(`1군 ${file.first.length}명 (expected ${FIRST_TEAM_MAX})`)
  }
  if (file.farm.length > FARM_TEAM_MAX) {
    errors.push(`2군 ${file.farm.length}명 (max ${FARM_TEAM_MAX})`)
  }

  for (const list of [file.first, file.farm]) {
    for (const r of list) {
      if (r.bats && !['L', 'R', 'S'].includes(r.bats)) {
        errors.push(`${r.id}: invalid bats ${r.bats}`)
      }
      if (r.throws && !['L', 'R', 'S'].includes(r.throws)) {
        errors.push(`${r.id}: invalid throws ${r.throws}`)
      }
      if (r.pitchingStyle && !['overhand', 'threeQuarter', 'sidearm', 'underhand'].includes(r.pitchingStyle)) {
        errors.push(`${r.id}: invalid pitchingStyle ${r.pitchingStyle}`)
      }
      if ((r.role === 'SP' || r.role === 'RP') && !r.pitchingStyle) {
        errors.push(`${r.id}: missing pitchingStyle`)
      }
    }
  }

  return errors
}

function rosterFiles(): TeamRosterFile[] {
  const files = getRosterFiles()
  if (files.every((f) => f.first.length === 0 && f.farm.length === 0)) {
    throw new Error('players.csv에 로스터 데이터가 없습니다. src/data/players.csv 를 편집하세요.')
  }
  return files
}

export function validateAllRosters(): { ok: boolean; errors: string[] } {
  const errors: string[] = []
  for (const file of rosterFiles()) {
    errors.push(...validateRosterFile(file).map((e) => `${file.teamAbbr}: ${e}`))
  }
  return { ok: errors.length === 0, errors }
}

function buildTeamFromRoster(
  def: (typeof TEAM_DEFS)[number],
  file: TeamRosterFile,
  starBoost: boolean,
): Team {
  const players = [
    ...file.first.map(recordToPlayer),
    ...file.farm.map(recordToPlayer),
  ]
  const withFarm = fillFarmGaps(players)

  return {
    id: crypto.randomUUID(),
    name: def.name,
    city: def.city,
    abbr: def.abbr,
    color: def.color,
    stadium: def.stadium,
    budget: rand(8, 15) * 1_000_000,
    players: withFarm,
    wins: 0,
    losses: 0,
    runsScored: 0,
    runsAllowed: 0,
    farmWins: 0,
    farmLosses: 0,
    farmRunsScored: 0,
    farmRunsAllowed: 0,
    coaches: generateDefaultStaff(starBoost),
  }
}

export function loadLeague2026(userTeamIndex: number): Team[] {
  const byAbbr = new Map(rosterFiles().map((f) => [f.teamAbbr, f]))

  return TEAM_DEFS.map((def, i) => {
    const file = byAbbr.get(def.abbr as TeamAbbr)
    if (!file) {
      throw new Error(`Missing 2026 roster for ${def.abbr}`)
    }
    return buildTeamFromRoster(def, file, i === userTeamIndex)
  })
}

export function previewTeamStars(abbr: TeamAbbr, limit = 5): PlayerRecord[] {
  const file = rosterFiles().find((f) => f.teamAbbr === abbr)
  if (!file) return []
  return [...file.first]
    .sort((a, b) => {
      const oa = overallRating(recordToPlayer(a))
      const ob = overallRating(recordToPlayer(b))
      return ob - oa
    })
    .slice(0, limit)
}

export function previewTeamStarLines(
  abbr: TeamAbbr,
  limit = 5,
): { id: string; name: string; role: string; ovr: number }[] {
  return previewTeamStars(abbr, limit).map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    ovr: overallRating(recordToPlayer(r)),
  }))
}
