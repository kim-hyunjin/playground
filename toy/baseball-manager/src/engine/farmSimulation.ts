import type { GameResult, ScheduledGame, Team } from '../types/game'
import { applyFarmBoxScoreToPlayers } from './statsAccumulator'
import { simulateGame } from './simulation'

export function applyFarmResult(
  teams: Team[],
  schedule: ScheduledGame[],
  result: GameResult,
): { teams: Team[]; schedule: ScheduledGame[] } {
  const { boxScore } = result

  const newTeams = teams.map((t) => {
    const isHome = t.id === result.homeId
    const isAway = t.id === result.awayId
    if (!isHome && !isAway) return t

    const scored = isHome ? result.homeScore : result.awayScore
    const allowed = isHome ? result.awayScore : result.homeScore
    const win = scored > allowed
    const starterId = isHome ? boxScore.homeStarterId : boxScore.awayStarterId

    return {
      ...t,
      farmWins: t.farmWins + (win ? 1 : 0),
      farmLosses: t.farmLosses + (win ? 0 : 1),
      farmRunsScored: t.farmRunsScored + scored,
      farmRunsAllowed: t.farmRunsAllowed + allowed,
      players: applyFarmBoxScoreToPlayers(t.players, boxScore, win, !win, starterId),
    }
  })

  const newSchedule = schedule.map((g) =>
    g.id === result.gameId
      ? { ...g, played: true, homeScore: result.homeScore, awayScore: result.awayScore }
      : g,
  )

  return { teams: newTeams, schedule: newSchedule }
}

export function simulateFarmWeek(
  schedule: ScheduledGame[],
  teams: Team[],
  week: number,
): { results: GameResult[]; teams: Team[]; schedule: ScheduledGame[] } {
  const weekGames = schedule.filter((g) => g.week === week && !g.played)

  let currentTeams = teams
  let currentSchedule = schedule
  const results: GameResult[] = []

  for (const game of weekGames) {
    const home = currentTeams.find((t) => t.id === game.homeId)!
    const away = currentTeams.find((t) => t.id === game.awayId)!
    const result = simulateGame(game, home, away, { skipLogs: true, rosterLevel: 'farm' })
    results.push(result)
    const applied = applyFarmResult(currentTeams, currentSchedule, result)
    currentTeams = applied.teams
    currentSchedule = applied.schedule
  }

  return { results, teams: currentTeams, schedule: currentSchedule }
}
