import type { FieldPosition, GameState, Player, RosterLevel, Team } from '../types/game'

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
