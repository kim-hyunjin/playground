import type { GameDay, GameResult, ScheduledGame, Team } from '../types/game'
import { GAME_DAYS } from '../types/game'

const MIDWEEK_DAYS: GameDay[] = ['tue', 'wed', 'thu']
const WEEKEND_DAYS: GameDay[] = ['fri', 'sat', 'sun']

function dayOrder(a: GameDay, b: GameDay): number {
  return GAME_DAYS.indexOf(a) - GAME_DAYS.indexOf(b)
}

/** 0번 팀 고정, 나머지 로테이션 (더블 라운드로빈) */
function rotateTeamIds(ids: string[], offset: number): string[] {
  if (ids.length <= 1) return [...ids]
  const rot = offset % (ids.length - 1)
  return [ids[0]!, ...ids.slice(1 + rot), ...ids.slice(1, 1 + rot)]
}

function pairTeams(rotated: string[]): [string, string][] {
  const pairs: [string, string][] = []
  const n = rotated.length
  for (let i = 0; i < n / 2; i++) {
    pairs.push([rotated[i]!, rotated[n - 1 - i]!])
  }
  return pairs
}

function pushSeries(
  games: ScheduledGame[],
  week: number,
  homeId: string,
  awayId: string,
  days: GameDay[],
) {
  for (const day of days) {
    games.push({
      id: crypto.randomUUID(),
      week,
      day,
      homeId,
      awayId,
      played: false,
    })
  }
}

/**
 * 주 6경기: 화·수·목 동일 상대 3연전, 금·토·일 다른 상대 3연전.
 * 18주 × 6경기 = 팀당 108경기.
 */
export function generateSchedule(teams: Team[], totalWeeks = 18): ScheduledGame[] {
  const ids = teams.map((t) => t.id)
  const games: ScheduledGame[] = []

  for (let week = 1; week <= totalWeeks; week++) {
    const midOffset = (week - 1) % Math.max(1, ids.length - 1)
    const weekendOffset = (week - 1 + 4) % Math.max(1, ids.length - 1)

    for (const [home, away] of pairTeams(rotateTeamIds(ids, midOffset))) {
      pushSeries(games, week, home, away, MIDWEEK_DAYS)
    }
    for (const [home, away] of pairTeams(rotateTeamIds(ids, weekendOffset))) {
      pushSeries(games, week, home, away, WEEKEND_DAYS)
    }
  }

  games.sort((a, b) => a.week - b.week || dayOrder(a.day, b.day))
  return games
}

export function generateFarmSchedule(teams: Team[], totalWeeks = 18): ScheduledGame[] {
  return generateSchedule(teams, totalWeeks)
}

export function gamesForWeek(schedule: ScheduledGame[], week: number) {
  return schedule
    .filter((g) => g.week === week)
    .sort((a, b) => dayOrder(a.day, b.day))
}

export function userGamesForWeek(
  schedule: ScheduledGame[],
  userTeamId: string,
  week: number,
): ScheduledGame[] {
  return gamesForWeek(schedule, week).filter(
    (g) => g.homeId === userTeamId || g.awayId === userTeamId,
  )
}

export function nextUserGame(
  schedule: ScheduledGame[],
  userTeamId: string,
  fromWeek: number,
): ScheduledGame | undefined {
  return schedule
    .filter(
      (g) =>
        !g.played &&
        g.week === fromWeek &&
        (g.homeId === userTeamId || g.awayId === userTeamId),
    )
    .sort((a, b) => dayOrder(a.day, b.day))[0]
}

export function hasUnplayedUserGamesInWeek(
  schedule: ScheduledGame[],
  userTeamId: string,
  week: number,
): boolean {
  return userGamesForWeek(schedule, userTeamId, week).some((g) => !g.played)
}

export function userResults(results: GameResult[], userTeamId: string): GameResult[] {
  return [...results]
    .filter((r) => r.homeId === userTeamId || r.awayId === userTeamId)
    .sort((a, b) => {
      if (a.week !== b.week) return b.week - a.week
      const dayA = a.day ?? 'tue'
      const dayB = b.day ?? 'tue'
      return dayOrder(dayB, dayA)
    })
}

export function resultForGame(results: GameResult[], gameId: string): GameResult | undefined {
  return results.find((r) => r.gameId === gameId)
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

/** 구세이브 호환: day 필드 없으면 주차 내 순서로 화~일 부여 */
export function normalizeSchedule(schedule: ScheduledGame[]): ScheduledGame[] {
  if (schedule.every((g) => g.day)) return schedule

  const weekGroups = new Map<number, ScheduledGame[]>()
  for (const g of schedule) {
    if (g.day) continue
    const list = weekGroups.get(g.week) ?? []
    list.push(g)
    weekGroups.set(g.week, list)
  }

  const dayById = new Map<string, GameDay>()
  for (const games of weekGroups.values()) {
    games.sort((a, b) => a.id.localeCompare(b.id))
    games.forEach((g, i) => {
      dayById.set(g.id, GAME_DAYS[i % GAME_DAYS.length]!)
    })
  }

  return schedule.map((g) => (g.day ? g : { ...g, day: dayById.get(g.id) ?? 'tue' }))
}
