import type {
  AtBatOutcome,
  FieldPosition,
  GameResult,
  InningScore,
  PlayLog,
  Player,
  ScheduledGame,
  Team,
} from '../types/game'
import { FIELD_POSITIONS } from '../types/game'
import { isPitcher } from './generator'

function rand() {
  return Math.random()
}

function pickPitcher(team: Team, rotationIndex: number, inning: number): Player {
  const starters = team.players.filter((p) => p.role === 'SP')
  const relievers = team.players.filter((p) => p.role === 'RP')

  if (inning <= 6 && starters.length > 0) {
    return starters[rotationIndex % starters.length]!
  }
  if (relievers.length > 0) {
    return relievers[Math.min(inning - 7, relievers.length - 1)] ?? relievers[0]!
  }
  return starters[0]!
}

function battingOrder(team: Team, lineup?: Record<FieldPosition, string>): Player[] {
  if (lineup) {
    return FIELD_POSITIONS.map((pos) => {
      const id = lineup[pos]
      return team.players.find((p) => p.id === id) ?? team.players.find((p) => !isPitcher(p))!
    }).filter(Boolean)
  }
  return team.players.filter((p) => !isPitcher(p)).slice(0, 9)
}

function resolveAtBat(batter: Player, pitcher: Player): AtBatOutcome {
  const contactSkill = batter.contact * (1 - batter.fatigue / 200)
  const powerSkill = batter.power * (1 - batter.fatigue / 200)
  const eyeSkill = batter.eye
  const pitchSkill = (pitcher.control + pitcher.movement + pitcher.velocity) / 3

  const kRate = clamp((pitchSkill - contactSkill * 0.6) / 180, 0.08, 0.32)
  const bbRate = clamp((eyeSkill - pitcher.control * 0.5) / 200, 0.04, 0.14)

  const r = rand()
  if (r < kRate) return 'strikeout'
  if (r < kRate + bbRate) return 'walk'

  const contactRoll = rand() * 100
  const contactThreshold = clamp(55 - (contactSkill - pitchSkill) * 0.25, 18, 62)

  if (contactRoll > contactThreshold) return 'out'

  const powerRoll = rand() * 100
  const hrThreshold = clamp(96 - powerSkill * 0.35, 88, 99)
  if (powerRoll > hrThreshold) return 'homerun'

  const extraBase = rand() * 100
  if (extraBase > 94 - powerSkill * 0.08) return 'triple'
  if (extraBase > 82 - powerSkill * 0.12) return 'double'
  return 'single'
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

interface RunnerState {
  first: boolean
  second: boolean
  third: boolean
}

function advanceRunners(state: RunnerState, outcome: AtBatOutcome): { runs: number; state: RunnerState } {
  let runs = 0
  const next: RunnerState = { first: false, second: false, third: false }

  if (outcome === 'walk') {
    if (state.first && state.second && state.third) runs++
    next.third = state.second || state.third
    next.second = state.first || state.second
    next.first = true
    if (state.first && state.second && state.third) {
      next.third = true
      next.second = true
      next.first = true
    } else if (state.first && state.second) {
      next.third = true
      next.second = true
      next.first = true
    } else if (state.first) {
      next.second = true
      next.first = true
    } else {
      next.first = true
    }
    return { runs, state: next }
  }

  if (outcome === 'single') {
    if (state.third) runs++
    next.third = state.second
    next.second = state.first
    next.first = true
    return { runs, state: next }
  }

  if (outcome === 'double') {
    if (state.third) runs++
    if (state.second) runs++
    next.third = state.first
    next.second = true
    return { runs, state: next }
  }

  if (outcome === 'triple') {
    runs += [state.first, state.second, state.third].filter(Boolean).length
    next.third = true
    return { runs, state: next }
  }

  if (outcome === 'homerun') {
    runs += 1 + [state.first, state.second, state.third].filter(Boolean).length
    return { runs, state: next }
  }

  // outs — small chance to advance
  if (outcome === 'out' && rand() < 0.12 && state.third) {
    runs++
    next.second = state.second
    next.first = state.first
    return { runs, state: next }
  }

  return { runs, state }
}

const OUTCOME_TEXT: Record<AtBatOutcome, (b: string) => string> = {
  strikeout: (b) => `${b} 삼진`,
  walk: (b) => `${b} 볼넷`,
  single: (b) => `${b} 안타`,
  double: (b) => `${b} 2루타`,
  triple: (b) => `${b} 3루타`,
  homerun: (b) => `${b} 홈런!`,
  out: (b) => `${b} 아웃`,
  sacrifice: (b) => `${b} 희생번트`,
  error: (b) => `${b} 실책 출루`,
}

export interface SimOptions {
  homeLineup?: Record<FieldPosition, string>
  awayLineup?: Record<FieldPosition, string>
  homeRotationIndex?: number
  awayRotationIndex?: number
}

export function simulateGame(
  game: ScheduledGame,
  home: Team,
  away: Team,
  options: SimOptions = {},
): GameResult {
  const logs: PlayLog[] = []
  const innings: InningScore[] = Array.from({ length: 9 }, () => ({}))
  let homeTotal = 0
  let awayTotal = 0
  let homeRot = options.homeRotationIndex ?? 0
  let awayRot = options.awayRotationIndex ?? 0

  const homeOrder = battingOrder(home, options.homeLineup)
  const awayOrder = battingOrder(away, options.awayLineup)

  for (let inning = 1; inning <= 9; inning++) {
    // Top half — away bats
    let outs = 0
    let runners: RunnerState = { first: false, second: false, third: false }
    let awayRuns = 0
    let idx = 0
    const awayPitcher = pickPitcher(home, homeRot, inning)

    while (outs < 3) {
      const batter = awayOrder[idx % awayOrder.length]!
      const outcome = resolveAtBat(batter, awayPitcher)
      if (outcome === 'out' || outcome === 'strikeout') outs++
      const { runs, state } = advanceRunners(runners, outcome)
      awayRuns += runs
      runners = state
      logs.push({
        inning,
        half: 'top',
        text: OUTCOME_TEXT[outcome](batter.name) + (runs > 0 ? ` (${runs}득점)` : ''),
        outcome,
        runsScored: runs,
      })
      idx++
    }
    innings[inning - 1]!.top = awayRuns
    awayTotal += awayRuns

    // Bottom half — home bats
    outs = 0
    runners = { first: false, second: false, third: false }
    let homeRuns = 0
    idx = 0
    const homePitcher = pickPitcher(away, awayRot, inning)

    while (outs < 3) {
      const batter = homeOrder[idx % homeOrder.length]!
      const outcome = resolveAtBat(batter, homePitcher)
      if (outcome === 'out' || outcome === 'strikeout') outs++
      const { runs, state } = advanceRunners(runners, outcome)
      homeRuns += runs
      runners = state
      logs.push({
        inning,
        half: 'bottom',
        text: OUTCOME_TEXT[outcome](batter.name) + (runs > 0 ? ` (${runs}득점)` : ''),
        outcome,
        runsScored: runs,
      })
      idx++
    }
    innings[inning - 1]!.bottom = homeRuns
    homeTotal += homeRuns
  }

  return {
    gameId: game.id,
    homeId: game.homeId,
    awayId: game.awayId,
    homeScore: homeTotal,
    awayScore: awayTotal,
    innings,
    logs,
    week: game.week,
  }
}

export function applyResult(
  teams: Team[],
  schedule: ScheduledGame[],
  result: GameResult,
): { teams: Team[]; schedule: ScheduledGame[] } {
  const newTeams = teams.map((t) => {
    const isHome = t.id === result.homeId
    const isAway = t.id === result.awayId
    if (!isHome && !isAway) return t

    const scored = isHome ? result.homeScore : result.awayScore
    const allowed = isHome ? result.awayScore : result.homeScore
    const win = scored > allowed

    return {
      ...t,
      wins: t.wins + (win ? 1 : 0),
      losses: t.losses + (win ? 0 : 1),
      runsScored: t.runsScored + scored,
      runsAllowed: t.runsAllowed + allowed,
    }
  })

  const newSchedule = schedule.map((g) =>
    g.id === result.gameId
      ? { ...g, played: true, homeScore: result.homeScore, awayScore: result.awayScore }
      : g,
  )

  return { teams: newTeams, schedule: newSchedule }
}

export function simulateCpuGames(
  schedule: ScheduledGame[],
  teams: Team[],
  week: number,
  userTeamId: string,
): { results: GameResult[]; teams: Team[]; schedule: ScheduledGame[] } {
  const weekGames = schedule.filter(
    (g) => g.week === week && !g.played && g.homeId !== userTeamId && g.awayId !== userTeamId,
  )

  let currentTeams = teams
  let currentSchedule = schedule
  const results: GameResult[] = []

  for (const game of weekGames) {
    const home = currentTeams.find((t) => t.id === game.homeId)!
    const away = currentTeams.find((t) => t.id === game.awayId)!
    const result = simulateGame(game, home, away)
    results.push(result)
    const applied = applyResult(currentTeams, currentSchedule, result)
    currentTeams = applied.teams
    currentSchedule = applied.schedule
  }

  return { results, teams: currentTeams, schedule: currentSchedule }
}
