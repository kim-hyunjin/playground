import type { FieldPosition, GameState, Player, PlayerRole, RosterLevel, Team } from '../types/game'
import { evaluateCallUpCandidate } from './callUpEvaluation'
import { overallRating } from './generator'

export const FIRST_TEAM_MAX = 26
export const FARM_TEAM_MAX = 30

export function rosterLevelOf(p: Player): RosterLevel {
  return p.rosterLevel ?? 'first'
}

export function playersByLevel(team: Team, level: RosterLevel): Player[] {
  return team.players.filter((p) => rosterLevelOf(p) === level)
}

export function firstTeamPlayers(team: Team): Player[] {
  return playersByLevel(team, 'first')
}

export function farmPlayers(team: Team): Player[] {
  return playersByLevel(team, 'farm')
}

export function teamWithRosterLevel(team: Team, level: RosterLevel): Team {
  return { ...team, players: playersByLevel(team, level) }
}

export function countByLevel(team: Team, level: RosterLevel): number {
  return playersByLevel(team, level).length
}

export function canPromote(team: Team): boolean {
  return countByLevel(team, 'first') < FIRST_TEAM_MAX
}

export function canDemote(team: Team): boolean {
  return countByLevel(team, 'farm') < FARM_TEAM_MAX
}

export function promotePlayerInTeam(team: Team, playerId: string): Team | null {
  const player = team.players.find((p) => p.id === playerId)
  if (!player || rosterLevelOf(player) !== 'farm') return null
  if (!canPromote(team)) return null

  return {
    ...team,
    players: team.players.map((p) =>
      p.id === playerId ? { ...p, rosterLevel: 'first' as const } : p,
    ),
  }
}

export function demotePlayerInTeam(team: Team, playerId: string): Team | null {
  const player = team.players.find((p) => p.id === playerId)
  if (!player || rosterLevelOf(player) !== 'first') return null
  if (!canDemote(team)) return null

  return {
    ...team,
    players: team.players.map((p) =>
      p.id === playerId ? { ...p, rosterLevel: 'farm' as const } : p,
    ),
  }
}

export function stripPlayerFromLineup(
  lineup: Record<FieldPosition, string>,
  playerId: string,
): Record<FieldPosition, string> {
  const next = { ...lineup }
  for (const pos of Object.keys(next) as FieldPosition[]) {
    if (next[pos] === playerId) delete next[pos]
  }
  return next
}

export function stripPlayerFromRotation(rotation: string[], playerId: string): string[] {
  return rotation.filter((id) => id !== playerId)
}

export function demoteWithLineup(
  state: Pick<GameState, 'teams' | 'userTeamId' | 'lineup' | 'rotation'>,
  playerId: string,
): Pick<GameState, 'teams' | 'lineup' | 'rotation'> | null {
  const team = state.teams.find((t) => t.id === state.userTeamId)
  if (!team) return null

  const updated = demotePlayerInTeam(team, playerId)
  if (!updated) return null

  return {
    teams: state.teams.map((t) => (t.id === state.userTeamId ? updated : t)),
    lineup: stripPlayerFromLineup(state.lineup, playerId),
    rotation: stripPlayerFromRotation(state.rotation, playerId),
  }
}

export function promoteInLeague(teams: Team[], userTeamId: string, playerId: string): Team[] | null {
  const team = teams.find((t) => t.id === userTeamId)
  if (!team) return null

  const updated = promotePlayerInTeam(team, playerId)
  if (!updated) return null

  return teams.map((t) => (t.id === userTeamId ? updated : t))
}

export interface RosterValidation {
  valid: boolean
  errors: string[]
}

export function validateFirstTeamRoster(team: Team): RosterValidation {
  const errors: string[] = []
  const count = countByLevel(team, 'first')
  if (count > FIRST_TEAM_MAX) errors.push(`1군 등록 초과 (${count}/${FIRST_TEAM_MAX})`)
  if (count < 20) errors.push(`1군 등록 부족 (${count}명)`)

  const first = firstTeamPlayers(team)
  const sp = first.filter((p) => p.role === 'SP').length
  const c = first.filter((p) => p.role === 'C').length
  if (sp < 4) errors.push(`선발 투수 부족 (${sp}명)`)
  if (c < 1) errors.push('포수 미등록')

  return { valid: errors.length === 0, errors }
}

export function validateFarmRoster(team: Team): RosterValidation {
  const errors: string[] = []
  const count = countByLevel(team, 'farm')
  if (count > FARM_TEAM_MAX) errors.push(`2군 등록 초과 (${count}/${FARM_TEAM_MAX})`)

  return { valid: errors.length === 0, errors }
}

function pickDemoteCandidate(team: Team, preferRole?: PlayerRole): Player | null {
  const first = firstTeamPlayers(team)
  if (first.length === 0) return null

  const candidates = preferRole
    ? first.filter((p) => p.role === preferRole)
    : first

  const pool = candidates.length > 0 ? candidates : first

  return pool
    .slice()
    .sort((a, b) => {
      const scoreA = overallRating(a) - a.fatigue * 0.15 - (a.age > 32 ? 5 : 0)
      const scoreB = overallRating(b) - b.fatigue * 0.15 - (b.age > 32 ? 5 : 0)
      return scoreA - scoreB
    })[0] ?? null
}

function pickBestFarmPromote(team: Team): Player | null {
  const candidates = farmPlayers(team)
    .map((p) => ({ player: p, eval: evaluateCallUpCandidate(team, p) }))
    .filter((c) => c.eval.eligible)
    .sort((a, b) => b.eval.score - a.eval.score)

  return candidates[0]?.player ?? null
}

/** CPU 구단 주차별 승하향 (최대 maxMoves회) */
export function autoAdjustRoster(team: Team, maxMoves = 3): Team {
  let current = team

  for (let i = 0; i < maxMoves; i++) {
    const promoteTarget = pickBestFarmPromote(current)
    if (!promoteTarget) break

    if (!canPromote(current)) {
      const demoteTarget = pickDemoteCandidate(current, promoteTarget.role)
      if (!demoteTarget) break
      const demoted = demotePlayerInTeam(current, demoteTarget.id)
      if (!demoted) break
      current = demoted
    }

    const promoted = promotePlayerInTeam(current, promoteTarget.id)
    if (!promoted) break
    current = promoted
  }

  // 1군 과부하·고피로 저성과자 2군 하향 (승격 없이)
  if (countByLevel(current, 'first') >= FIRST_TEAM_MAX) {
    const tired = firstTeamPlayers(current)
      .filter((p) => p.fatigue >= 75 && overallRating(p) < 58)
      .sort((a, b) => b.fatigue - a.fatigue)

    for (const p of tired.slice(0, 1)) {
      if (!canDemote(current)) break
      const demoted = demotePlayerInTeam(current, p.id)
      if (demoted) current = demoted
    }
  }

  return current
}

export function autoAdjustLeagueRosters(teams: Team[], userTeamId: string): Team[] {
  return teams.map((t) => (t.id === userTeamId ? t : autoAdjustRoster(t)))
}

