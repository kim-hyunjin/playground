import type { FreeAgentListing, GameState, Player, Team } from '../types/game'
import { emptyBatterStats, emptyPitcherStats } from '../types/game'
import {
  defaultLineup,
  defaultRotation,
  generatePlayer,
  isPitcher,
  overallRating,
} from './generator'
import { rollPotential } from './playerDevelopment'
import { generateSchedule, generateFarmSchedule } from './schedule'
import { countByLevel, FIRST_TEAM_MAX, FARM_TEAM_MAX } from './roster'
import { initializeDraft } from './draft'

export const STOVE_TOTAL_WEEKS = 4
export const DEFAULT_SEASON_YEAR = 2026
export const OFFSEASON_BUDGET_BONUS = 4_000_000

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function isSeasonComplete(state: GameState): boolean {
  return state.phase === 'regular' && state.currentWeek >= state.totalWeeks
}

export function isStoveLeague(state: GameState): boolean {
  return state.phase === 'stove'
}

function canTeamSign(team: Team): boolean {
  return countByLevel(team, 'first') < FIRST_TEAM_MAX || countByLevel(team, 'farm') < FARM_TEAM_MAX
}

function rosterLevelForSign(team: Team): 'first' | 'farm' | null {
  if (countByLevel(team, 'first') < FIRST_TEAM_MAX) return 'first'
  if (countByLevel(team, 'farm') < FARM_TEAM_MAX) return 'farm'
  return null
}

function isFaEligible(player: Player): boolean {
  return player.age >= 29 || (player.age >= 27 && overallRating(player) >= 68)
}

function askingSalaryFor(player: Player): number {
  const ovr = overallRating(player)
  const multiplier = 1.05 + (ovr - 50) * 0.008
  return Math.round(player.salary * clamp(multiplier, 1.05, 1.45))
}

function generateExternalFa(count: number): FreeAgentListing[] {
  const roles = ['SS', 'CF', 'SP', 'RP', '1B', '3B', 'C', 'LF'] as const
  const listings: FreeAgentListing[] = []

  for (let i = 0; i < count; i++) {
    const role = roles[i % roles.length]!
    const tier = Math.random() > 0.75 ? 'star' : Math.random() > 0.4 ? 'avg' : 'weak'
    const player = generatePlayer(role, tier, {
      rosterLevel: 'first',
      ageMin: 27,
      ageMax: 36,
    })
    listings.push({
      player: { ...player, morale: rand(70, 92) },
      askingSalary: askingSalaryFor(player),
      formerTeamName: 'FA (해외·独立)',
    })
  }

  return listings
}

function collectContractExpirations(teams: Team[]): {
  teams: Team[]
  listings: FreeAgentListing[]
} {
  const listings: FreeAgentListing[] = []
  const updated = teams.map((team) => {
    const candidates = team.players
      .filter(isFaEligible)
      .sort((a, b) => overallRating(a) - overallRating(b))

    const releaseCount = clamp(
      candidates.filter((p) => p.age >= 31).length >= 2 ? rand(1, 2) : rand(0, 1),
      0,
      2,
    )

    if (releaseCount === 0) return team

    const released = candidates.slice(0, releaseCount)
    const releasedIds = new Set(released.map((p) => p.id))

    for (const p of released) {
      listings.push({
        player: { ...p, morale: clamp(p.morale - rand(3, 8), 40, 99) },
        askingSalary: askingSalaryFor(p),
        formerTeamName: `${team.city} ${team.name}`,
      })
    }

    return {
      ...team,
      players: team.players.filter((p) => !releasedIds.has(p.id)),
    }
  })

  return { teams: updated, listings }
}

export function buildStoveLeagueState(state: GameState): GameState {
  const { teams, listings: fromTeams } = collectContractExpirations(state.teams)
  const external = generateExternalFa(10)
  const freeAgents = [...fromTeams, ...external].sort(
    (a, b) => overallRating(b.player) - overallRating(a.player),
  )

  const teamsWithBudget = teams.map((t) => ({
    ...t,
    budget: t.budget + OFFSEASON_BUDGET_BONUS,
  }))

  return {
    ...state,
    phase: 'stove',
    teams: teamsWithBudget,
    freeAgents,
    draft: initializeDraft(teamsWithBudget),
    stoveWeek: 1,
    stoveTotalWeeks: STOVE_TOTAL_WEEKS,
    callUpSuggestions: [],
  }
}

export function signFreeAgentForTeam(
  team: Team,
  listing: FreeAgentListing,
): { team: Team; listing: FreeAgentListing } | null {
  const level = rosterLevelForSign(team)
  if (!level || team.budget < listing.askingSalary) return null

  const player: Player = {
    ...listing.player,
    rosterLevel: level,
    salary: listing.askingSalary,
    morale: Math.min(99, listing.player.morale + 8),
  }

  return {
    team: {
      ...team,
      budget: team.budget - listing.askingSalary,
      players: [...team.players, player],
    },
    listing,
  }
}

function cpuSignPass(teams: Team[], freeAgents: FreeAgentListing[], userTeamId: string) {
  let pool = [...freeAgents]
  let nextTeams = [...teams]

  const cpuOrder = nextTeams
    .filter((t) => t.id !== userTeamId)
    .sort((a, b) => b.budget - a.budget)

  for (const team of cpuOrder) {
    const teamIdx = nextTeams.findIndex((t) => t.id === team.id)!
    let current = nextTeams[teamIdx]!
    if (!canTeamSign(current)) continue

    const signCount = rand(0, 2)
    for (let i = 0; i < signCount && pool.length > 0; i++) {
      const affordable = pool
        .filter((l) => current.budget >= l.askingSalary && canTeamSign(current))
        .sort((a, b) => overallRating(b.player) - overallRating(a.player))

      const pick = affordable[0]
      if (!pick) break

      const signed = signFreeAgentForTeam(current, pick)
      if (!signed) break

      current = signed.team
      pool = pool.filter((l) => l.player.id !== pick.player.id)
    }

    nextTeams[teamIdx] = current
  }

  return { teams: nextTeams, freeAgents: pool }
}

export function advanceStoveWeekState(state: GameState): GameState {
  if (state.phase !== 'stove') return state

  const { teams, freeAgents } = cpuSignPass(state.teams, state.freeAgents, state.userTeamId)
  const nextWeek = (state.stoveWeek ?? 1) + 1

  return {
    ...state,
    teams,
    freeAgents,
    stoveWeek: nextWeek,
  }
}

function resetPlayerForNewSeason(player: Player): Player {
  const isPitcherRole = isPitcher(player)
  const nextAge = player.age + 1
  const ovr = overallRating(player)

  return {
    ...player,
    age: nextAge,
    fatigue: rand(0, 10),
    morale: clamp(player.morale + rand(2, 8), 50, 99),
    developmentXp: Math.round((player.developmentXp ?? 0) * 0.35),
    potential: player.potential ?? rollPotential(
      ovr >= 75 ? 'star' : ovr >= 58 ? 'avg' : 'weak',
      nextAge,
      player.rosterLevel,
      ovr,
    ),
    seasonStats: isPitcherRole ? emptyPitcherStats() : emptyBatterStats(),
    farmSeasonStats: isPitcherRole ? emptyPitcherStats() : emptyBatterStats(),
  }
}

function resetTeamForNewSeason(team: Team): Team {
  return {
    ...team,
    wins: 0,
    losses: 0,
    runsScored: 0,
    runsAllowed: 0,
    farmWins: 0,
    farmLosses: 0,
    farmRunsScored: 0,
    farmRunsAllowed: 0,
    players: team.players.map(resetPlayerForNewSeason),
  }
}

export function startNextSeasonState(state: GameState): GameState {
  const seasonYear = (state.seasonYear ?? DEFAULT_SEASON_YEAR) + 1
  const totalWeeks = state.totalWeeks
  const teams = state.teams.map(resetTeamForNewSeason)

  const teamsWithBudget = teams.map((t) => ({
    ...t,
    budget: Math.max(t.budget, rand(6, 12) * 1_000_000),
  }))

  const userTeam = teamsWithBudget.find((t) => t.id === state.userTeamId)!

  return {
    ...state,
    version: 6,
    seasonYear,
    phase: 'regular',
    teams: teamsWithBudget,
    schedule: generateSchedule(teamsWithBudget, totalWeeks),
    farmSchedule: generateFarmSchedule(teamsWithBudget, totalWeeks),
    freeAgents: [],
    draft: undefined,
    stoveWeek: undefined,
    stoveTotalWeeks: undefined,
    currentWeek: 1,
    rotationIndex: 0,
    results: [],
    farmResults: [],
    callUpSuggestions: [],
    lineup: defaultLineup(userTeam),
    rotation: defaultRotation(userTeam),
  }
}

export function stoveWeekLabel(state: GameState): string {
  if (state.phase !== 'stove') return ''
  return `스토브리그 ${state.stoveWeek ?? 1}/${state.stoveTotalWeeks ?? STOVE_TOTAL_WEEKS}주차`
}

/** 신규 게임 기본 연도 */
export function initialSeasonMeta() {
  return {
    seasonYear: DEFAULT_SEASON_YEAR,
    phase: 'regular' as const,
    freeAgents: [] as FreeAgentListing[],
  }
}
