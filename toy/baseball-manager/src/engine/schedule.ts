import type { ScheduledGame, Team } from '../types/game'

export function generateSchedule(teams: Team[], totalWeeks = 18, seriesLength = 3): ScheduledGame[] {
  const ids = teams.map((t) => t.id)
  const games: ScheduledGame[] = []
  let week = 1

  for (let round = 0; round < 2; round++) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const home = round === 0 ? ids[i]! : ids[j]!
        const away = round === 0 ? ids[j]! : ids[i]!

        for (let g = 0; g < seriesLength; g++) {
          games.push({
            id: crypto.randomUUID(),
            week: ((week - 1) % totalWeeks) + 1,
            homeId: home,
            awayId: away,
            played: false,
          })
          week++
        }
      }
    }
  }

  games.sort((a, b) => a.week - b.week)
  return games
}

export function generateFarmSchedule(teams: Team[], totalWeeks = 18): ScheduledGame[] {
  return generateSchedule(teams, totalWeeks, 5)
}

export function gamesForWeek(schedule: ScheduledGame[], week: number) {
  return schedule.filter((g) => g.week === week && !g.played)
}

export function nextUserGame(
  schedule: ScheduledGame[],
  userTeamId: string,
  fromWeek: number,
): ScheduledGame | undefined {
  return schedule.find(
    (g) =>
      !g.played &&
      g.week >= fromWeek &&
      (g.homeId === userTeamId || g.awayId === userTeamId),
  )
}

export function teamRecord(team: Team) {
  const pct = team.wins + team.losses > 0
    ? (team.wins / (team.wins + team.losses)).toFixed(3).slice(1)
    : '.000'
  return { ...team, pct, diff: team.runsScored - team.runsAllowed }
}

export function sortedStandings(teams: Team[]) {
  return [...teams].sort((a, b) => {
    const pctA = a.wins / Math.max(1, a.wins + a.losses)
    const pctB = b.wins / Math.max(1, b.wins + b.losses)
    if (pctB !== pctA) return pctB - pctA
    return b.runsScored - b.runsAllowed - (a.runsScored - a.runsAllowed)
  })
}

export function teamFarmRecord(team: Team) {
  const pct = team.farmWins + team.farmLosses > 0
    ? (team.farmWins / (team.farmWins + team.farmLosses)).toFixed(3).slice(1)
    : '.000'
  return {
    ...team,
    pct,
    diff: team.farmRunsScored - team.farmRunsAllowed,
  }
}

export function sortedFarmStandings(teams: Team[]) {
  return [...teams].sort((a, b) => {
    const pctA = a.farmWins / Math.max(1, a.farmWins + a.farmLosses)
    const pctB = b.farmWins / Math.max(1, b.farmWins + b.farmLosses)
    if (pctB !== pctA) return pctB - pctA
    return b.farmRunsScored - b.farmRunsAllowed - (a.farmRunsScored - a.farmRunsAllowed)
  })
}
