import type { GameResult, PlayLog } from '../types/game'
import { computeScoreThroughLogs, type LiveScore } from './liveScore'
import { normalizeSeed } from './sim/random'

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
}

export interface GameSessionView {
  logs: PlayLog[]
  score: LiveScore
  complete: boolean
}

export function createGameSession(result: GameResult, seed: number): GameSession {
  return {
    version: 1,
    gameId: result.gameId,
    seed: normalizeSeed(seed),
    status: 'ready',
    cursor: 0,
    resolvedResult: result,
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
  }
}
