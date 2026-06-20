import type { Player, Team } from '../types/game'

export function findPlayerInLeague(
  teams: Team[],
  playerId: string,
): { player: Player; team: Team } | null {
  for (const team of teams) {
    const player = team.players.find((p) => p.id === playerId)
    if (player) return { player, team }
  }
  return null
}
