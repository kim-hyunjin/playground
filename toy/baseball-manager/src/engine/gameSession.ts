import type { BullpenStrategy, FieldPosition, GameResult, ManagerCommand, PlayLog, ScheduledGame, Team } from '../types/game'
import { computeScoreThroughLogs, type LiveScore } from './liveScore'
import { normalizeSeed } from './sim/random'
import { changePitcher, substituteBatter, substituteRunner, type GameRosterState } from './substitutions'
import type { Player } from '../types/game'
import { recordPitcherRuns, recordPlateAppearance, recordRunsScored, recordStolenBase } from './statsAccumulator'
import { simulateGame } from './simulation'
import { createSeededRandom } from './sim/random'

function rebuildBoxScore(result: GameResult): GameResult {
  const original = result.boxScore
  const box = {
    batters: {}, pitchers: {},
    awayStarterId: original.awayStarterId,
    homeStarterId: original.homeStarterId,
    winningPitcherId: original.winningPitcherId,
    losingPitcherId: original.losingPitcherId,
    savePitcherId: original.savePitcherId,
  }
  for (const log of result.logs) {
    if (!log.batterId || !log.pitcherId || !log.outcome) continue
    if (log.eventType === 'stolenBase') {
      recordStolenBase(box, log.batterId)
      continue
    }
    if (log.eventType !== 'plateAppearance') continue
    const gs = log.pitcherId === original.awayStarterId || log.pitcherId === original.homeStarterId
    recordPlateAppearance(box, log.batterId, log.pitcherId, log.outcome, log.rbi ?? 0, gs)
    recordRunsScored(box, log.batterId, log.runsScored, log.outcome)
    if (log.runsScored > 0) recordPitcherRuns(box, log.pitcherId, log.runsScored)
  }
  return { ...result, boxScore: box }
}

export type GameSessionStatus = 'ready' | 'playing' | 'paused' | 'complete'

/**
 * 저장 가능한 사용자 경기 진행 상태.
 * resolvedResult는 결정된 경기 이벤트 원본이고 cursor까지만 사용자에게 공개한다.
 */
export interface GameSession {
  version: 1
  gameId: string
  seed: number
  status: GameSessionStatus
  cursor: number
  resolvedResult: GameResult
  userRoster?: GameRosterState
  simulationInput?: SessionSimulationInput
  commandChanges?: SessionCommandChange[]
}

export interface SessionSimulationInput {
  game: ScheduledGame
  home: Team
  away: Team
  userTeamId: string
  options: {
    homeLineup?: Record<FieldPosition, string>
    awayLineup?: Record<FieldPosition, string>
    homeRotationIndex?: number
    awayRotationIndex?: number
    homeBullpenStrategy?: BullpenStrategy
    awayBullpenStrategy?: BullpenStrategy
    homeCommand?: ManagerCommand
    awayCommand?: ManagerCommand
  }
}

export interface SessionCommandChange {
  fromPlateAppearance: number
  command: ManagerCommand
}

export interface GameSessionView {
  logs: PlayLog[]
  score: LiveScore
  complete: boolean
}

export function createGameSession(result: GameResult, seed: number, userRoster?: GameRosterState, simulationInput?: SessionSimulationInput): GameSession {
  return {
    version: 1,
    gameId: result.gameId,
    seed: normalizeSeed(seed),
    status: 'ready',
    cursor: 0,
    resolvedResult: result,
    userRoster,
    simulationInput,
    commandChanges: [],
  }
}

export function applySessionCommand(session: GameSession, command: ManagerCommand): { session: GameSession; message: string; ok: boolean } {
  const input = session.simulationInput
  if (!input || session.status === 'complete') return { session, ok: false, message: '현재 경기에 작전을 적용할 수 없습니다.' }
  const fromPlateAppearance = session.resolvedResult.logs.slice(0, session.cursor).filter((log) => (log.eventType ?? 'plateAppearance') === 'plateAppearance').length
  const changes = [...(session.commandChanges ?? []).filter((change) => change.fromPlateAppearance !== fromPlateAppearance), { fromPlateAppearance, command }]
    .sort((a, b) => a.fromPlateAppearance - b.fromPlateAppearance)
  const result = simulateGame(input.game, input.home, input.away, {
    ...input.options,
    random: createSeededRandom({ seed: session.seed }),
    commandProvider: ({ plateAppearanceIndex }) => {
      const active = changes.filter((change) => change.fromPlateAppearance <= plateAppearanceIndex).at(-1)
      if (!active) return {}
      return input.game.homeId === input.userTeamId ? { homeCommand: active.command } : { awayCommand: active.command }
    },
  })
  let next: GameSession = { ...session, resolvedResult: result, commandChanges: changes }
  if (session.userRoster) {
    const originalLineup = input.game.homeId === input.userTeamId ? input.options.homeLineup : input.options.awayLineup
    if (originalLineup) {
      session.userRoster.lineup.forEach((slot) => {
        const originalId = originalLineup[slot.position]
        if (originalId && originalId !== slot.playerId) next = { ...next, resolvedResult: replaceFuturePlayer(next, 'batterId', originalId, slot.playerId) }
      })
    }
    const originalStarter = input.game.homeId === input.userTeamId ? result.boxScore.homeStarterId : result.boxScore.awayStarterId
    if (originalStarter !== session.userRoster.currentPitcherId) next = { ...next, resolvedResult: replaceFuturePlayer(next, 'pitcherId', originalStarter, session.userRoster.currentPitcherId) }
    next = { ...next, resolvedResult: rebuildBoxScore(next.resolvedResult) }
  }
  return { session: next, ok: true, message: '작전이 다음 타석부터 적용됩니다.' }
}

function replaceFuturePlayer(
  session: GameSession,
  field: 'batterId' | 'pitcherId',
  outgoingId: string,
  incomingId: string,
): GameResult {
  return {
    ...session.resolvedResult,
    logs: session.resolvedResult.logs.map((log, index) => {
      if (index < session.cursor || log[field] !== outgoingId) return log
      const before = log.situationBefore
      const after = log.situationAfter
      return {
        ...log,
        [field]: incomingId,
        situationBefore: before ? { ...before, [field]: incomingId } : before,
        situationAfter: after ? { ...after, [field]: incomingId } : after,
      }
    }),
  }
}

export function substituteSessionPitcher(session: GameSession, incoming: Player): { session: GameSession; message: string; ok: boolean } {
  if (!session.userRoster) return { session, ok: false, message: '경기 엔트리가 없습니다.' }
  const outgoingId = session.userRoster.currentPitcherId
  const changed = changePitcher(session.userRoster, incoming)
  if (!changed.ok) return { session, ok: false, message: changed.message }
  return {
    ok: true,
    message: changed.message,
    session: {
      ...session,
      status: 'paused',
      userRoster: changed.roster,
      resolvedResult: rebuildBoxScore(replaceFuturePlayer(session, 'pitcherId', outgoingId, incoming.id)),
    },
  }
}

export function substituteSessionBatter(session: GameSession, battingOrder: number, incoming: Player): { session: GameSession; message: string; ok: boolean } {
  if (!session.userRoster) return { session, ok: false, message: '경기 엔트리가 없습니다.' }
  const outgoingId = session.userRoster.lineup.find((slot) => slot.battingOrder === battingOrder)?.playerId
  if (!outgoingId) return { session, ok: false, message: '해당 타순이 없습니다.' }
  const changed = substituteBatter(session.userRoster, battingOrder, incoming)
  if (!changed.ok) return { session, ok: false, message: changed.message }
  return {
    ok: true,
    message: changed.message,
    session: {
      ...session,
      status: 'paused',
      userRoster: changed.roster,
      resolvedResult: rebuildBoxScore(replaceFuturePlayer(session, 'batterId', outgoingId, incoming.id)),
    },
  }
}

export function substituteSessionRunner(session: GameSession, outgoingId: string, incoming: Player): { session: GameSession; message: string; ok: boolean } {
  if (!session.userRoster) return { session, ok: false, message: '경기 엔트리가 없습니다.' }
  const changed = substituteRunner(session.userRoster, outgoingId, incoming)
  if (!changed.ok) return { session, ok: false, message: changed.message }
  const result = replaceFuturePlayer(session, 'batterId', outgoingId, incoming.id)
  const replaceRunner = (id?: string) => id === outgoingId ? incoming.id : id
  return {
    ok: true,
    message: changed.message,
    session: {
      ...session,
      status: 'paused',
      userRoster: changed.roster,
      resolvedResult: rebuildBoxScore({
        ...result,
        logs: result.logs.map((log, index) => index < session.cursor ? log : ({
          ...log,
          situationBefore: log.situationBefore ? { ...log.situationBefore, runners: {
            firstId: replaceRunner(log.situationBefore.runners.firstId), secondId: replaceRunner(log.situationBefore.runners.secondId), thirdId: replaceRunner(log.situationBefore.runners.thirdId),
          } } : undefined,
          situationAfter: log.situationAfter ? { ...log.situationAfter, runners: {
            firstId: replaceRunner(log.situationAfter.runners.firstId), secondId: replaceRunner(log.situationAfter.runners.secondId), thirdId: replaceRunner(log.situationAfter.runners.thirdId),
          } } : undefined,
        })),
      }),
    },
  }
}

/** 도루 같은 선행 이벤트를 포함해 다음 타석 결과까지 한 번에 공개한다. */
export function advancePlateAppearance(session: GameSession): GameSession {
  if (session.status === 'complete') return session

  let cursor = session.cursor
  const logs = session.resolvedResult.logs
  while (cursor < logs.length) {
    const log = logs[cursor++]!
    if ((log.eventType ?? 'plateAppearance') === 'plateAppearance') break
  }

  return {
    ...session,
    cursor,
    status: cursor >= logs.length ? 'complete' : 'playing',
  }
}

export function pauseGameSession(session: GameSession): GameSession {
  if (session.status === 'complete') return session
  return { ...session, status: 'paused' }
}

export function resumeGameSession(session: GameSession): GameSession {
  if (session.status === 'complete') return session
  return { ...session, status: 'playing' }
}

export function gameSessionView(session: GameSession): GameSessionView {
  return {
    logs: session.resolvedResult.logs.slice(0, session.cursor),
    score: computeScoreThroughLogs(session.resolvedResult.logs, session.cursor),
    complete: session.status === 'complete',
  }
}

export function restoreGameSession(value: unknown): GameSession | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<GameSession>
  if (
    candidate.version !== 1 ||
    typeof candidate.gameId !== 'string' ||
    typeof candidate.seed !== 'number' ||
    typeof candidate.cursor !== 'number' ||
    !candidate.resolvedResult ||
    !Array.isArray(candidate.resolvedResult.logs)
  ) return null

  const cursor = Math.max(0, Math.min(Math.trunc(candidate.cursor), candidate.resolvedResult.logs.length))
  return {
    version: 1,
    gameId: candidate.gameId,
    seed: normalizeSeed(candidate.seed),
    cursor,
    status: cursor >= candidate.resolvedResult.logs.length
      ? 'complete'
      : candidate.status === 'paused' ? 'paused' : candidate.status === 'ready' ? 'ready' : 'playing',
    resolvedResult: candidate.resolvedResult,
    userRoster: candidate.userRoster,
    simulationInput: candidate.simulationInput,
    commandChanges: candidate.commandChanges ?? [],
  }
}
