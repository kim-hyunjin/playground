import type { DraftPick, DraftState, GameState, Player, PlayerRole, Team } from '../types/game'
import { generatePlayer, overallRating } from './generator'
import { countByLevel, FARM_TEAM_MAX } from './roster'
import { sortedStandings } from './schedule'

export const DRAFT_ROUNDS = 5
export const DRAFT_POOL_SIZE = 65

const PROSPECT_ROLES: PlayerRole[] = [
  'SS', 'CF', 'SP', 'RP', 'C', '1B', '3B', '2B', 'LF', 'RF', 'DH', 'SP', 'RP',
]

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function rookieSigningBonus(overall: number, round: number): number {
  const base = 20 + overall * 0.4 - round * 3
  return Math.round(clamp(base, 15, 95)) * 10_000
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function generateProspectPool(size = DRAFT_POOL_SIZE): Player[] {
  const prospects: Player[] = []

  for (let i = 0; i < size; i++) {
    const role = PROSPECT_ROLES[i % PROSPECT_ROLES.length]!
    const roll = Math.random()
    const tier = roll > 0.9 ? 'star' : roll > 0.5 ? 'avg' : 'weak'
    const player = generatePlayer(role, tier, {
      rosterLevel: 'farm',
      ageMin: 18,
      ageMax: 22,
    })
    const ovr = overallRating(player)
    prospects.push({
      ...player,
      salary: rookieSigningBonus(ovr, 1),
      morale: rand(78, 96),
      fatigue: 0,
    })
  }

  return prospects.sort((a, b) => overallRating(b) - overallRating(a))
}

export function buildDraftOrder(teams: Team[]): string[] {
  const worstToBest = [...sortedStandings(teams)].reverse()
  return worstToBest.map((t) => t.id)
}

function buildPickSequence(order: string[]): string[] {
  const sequence: string[] = []
  for (let round = 0; round < DRAFT_ROUNDS; round++) {
    for (const teamId of order) {
      sequence.push(teamId)
    }
  }
  return sequence
}

export function initializeDraft(teams: Team[]): DraftState {
  const order = buildDraftOrder(teams)
  const pickSequence = buildPickSequence(order)
  return {
    pool: generateProspectPool(),
    order,
    pickSequence,
    currentPick: 0,
    totalPicks: pickSequence.length,
    picks: [],
    complete: false,
  }
}

export function isDraftComplete(draft: DraftState | undefined): boolean {
  return !draft || draft.complete || draft.currentPick >= draft.totalPicks
}

export function getCurrentPickerId(draft: DraftState): string | null {
  if (isDraftComplete(draft)) return null
  return draft.pickSequence[draft.currentPick] ?? null
}

export function isUserOnClock(state: GameState): boolean {
  if (!state.draft || state.phase !== 'stove') return false
  return getCurrentPickerId(state.draft) === state.userTeamId
}

export function draftRoundAndPick(draft: DraftState): { round: number; pickInRound: number; overall: number } {
  const overall = draft.currentPick + 1
  const teamCount = draft.order.length || 1
  const round = Math.floor(draft.currentPick / teamCount) + 1
  const pickInRound = (draft.currentPick % teamCount) + 1
  return { round, pickInRound, overall }
}

export function draftProgressLabel(draft: DraftState | undefined): string {
  if (!draft) return ''
  if (isDraftComplete(draft)) return '드래프트 완료'
  const { round, pickInRound, overall } = draftRoundAndPick(draft)
  return `${round}라운드 ${pickInRound}픽 (${overall}/${draft.totalPicks})`
}

function canTeamDraft(team: Team, prospect: Player): boolean {
  if (countByLevel(team, 'farm') >= FARM_TEAM_MAX) return false
  return team.budget >= prospect.salary
}

function cpuSelectProspect(team: Team, pool: Player[]): Player | null {
  const eligible = pool
    .filter((p) => canTeamDraft(team, p))
    .sort((a, b) => {
      const ovrDiff = overallRating(b) - overallRating(a)
      if (ovrDiff !== 0) return ovrDiff
      return (b.potential ?? 0) - (a.potential ?? 0)
    })
  return eligible[0] ?? null
}

function addProspectToTeam(team: Team, prospect: Player, round: number): Team {
  const bonus = rookieSigningBonus(overallRating(prospect), round)
  const player: Player = {
    ...prospect,
    rosterLevel: 'farm',
    salary: bonus,
    morale: Math.min(99, prospect.morale + 5),
  }
  return {
    ...team,
    budget: team.budget - bonus,
    players: [...team.players, player],
  }
}

function recordPick(
  draft: DraftState,
  teamId: string,
  playerId: string,
): DraftState {
  const { round, overall } = draftRoundAndPick(draft)
  const pick: DraftPick = { round, overall, teamId, playerId }
  return {
    ...draft,
    pool: draft.pool.filter((p) => p.id !== playerId),
    currentPick: draft.currentPick + 1,
    picks: [...draft.picks, pick],
    complete: draft.currentPick + 1 >= draft.totalPicks,
  }
}

function advanceSkippedPick(draft: DraftState): DraftState {
  return {
    ...draft,
    currentPick: draft.currentPick + 1,
    complete: draft.currentPick + 1 >= draft.totalPicks,
  }
}

function applyOnePick(state: GameState, playerId: string | null): GameState {
  const draft = state.draft
  if (!draft || isDraftComplete(draft)) return state

  const pickerId = getCurrentPickerId(draft)!
  const teamIdx = state.teams.findIndex((t) => t.id === pickerId)
  if (teamIdx < 0) return state

  const team = state.teams[teamIdx]!
  let nextDraft = draft
  let nextTeams = [...state.teams]

  if (playerId) {
    const prospect = draft.pool.find((p) => p.id === playerId)
    if (!prospect || !canTeamDraft(team, prospect)) return state

    nextTeams[teamIdx] = addProspectToTeam(team, prospect, draftRoundAndPick(draft).round)
    nextDraft = recordPick(draft, pickerId, playerId)
  } else {
    nextDraft = advanceSkippedPick(draft)
  }

  return { ...state, teams: nextTeams, draft: nextDraft }
}

function cpuPickOrSkip(state: GameState): GameState {
  const draft = state.draft
  if (!draft || isDraftComplete(draft)) return state

  const pickerId = getCurrentPickerId(draft)!
  const team = state.teams.find((t) => t.id === pickerId)
  if (!team) return applyOnePick(state, null)

  const pick = cpuSelectProspect(team, draft.pool)
  return applyOnePick(state, pick?.id ?? null)
}

export function draftProspect(state: GameState, playerId: string): GameState | null {
  if (!isUserOnClock(state)) return null
  const draft = state.draft!
  const prospect = draft.pool.find((p) => p.id === playerId)
  const team = state.teams.find((t) => t.id === state.userTeamId)
  if (!prospect || !team || !canTeamDraft(team, prospect)) return null

  return applyOnePick(state, playerId)
}

export function simulateNextDraftPick(state: GameState): GameState {
  if (isDraftComplete(state.draft)) return state
  if (isUserOnClock(state)) return state
  return cpuPickOrSkip(state)
}

export function simulateDraftUntilUser(state: GameState): GameState {
  let next = state
  let guard = 0
  while (!isDraftComplete(next.draft) && !isUserOnClock(next) && guard < next.draft!.totalPicks) {
    next = cpuPickOrSkip(next)
    guard++
  }
  return next
}

export function simulateRemainingDraft(state: GameState): GameState {
  let next = state
  let guard = 0
  while (!isDraftComplete(next.draft) && guard < next.draft!.totalPicks) {
    if (isUserOnClock(next)) {
      const team = next.teams.find((t) => t.id === next.userTeamId)!
      const pick = cpuSelectProspect(team, next.draft!.pool)
      next = applyOnePick(next, pick?.id ?? null)
    } else {
      next = cpuPickOrSkip(next)
    }
    guard++
  }
  return next
}

export function userDraftPicks(state: GameState): DraftPick[] {
  if (!state.draft) return []
  return state.draft.picks.filter((p) => p.teamId === state.userTeamId)
}
