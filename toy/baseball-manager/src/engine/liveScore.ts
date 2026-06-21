import type { InningScore, PlayLog } from '../types/game'

export interface LiveScore {
  homeScore: number
  awayScore: number
  innings: InningScore[]
}

/** 재생 중인 로그 기준 현재 이닝·초말 표시 */
export function currentInningLabel(logs: PlayLog[], visibleCount: number): string {
  if (visibleCount <= 0) return '1회 초'
  const log = logs[visibleCount - 1]!
  return `${log.inning}회 ${log.half === 'top' ? '초' : '말'}`
}

/** 플레이 로그 N개까지 반영한 누적 스코어 (경기 중 점수 표시용) */
export function computeScoreThroughLogs(logs: PlayLog[], count: number): LiveScore {
  let homeScore = 0
  let awayScore = 0
  const inningRuns = new Map<number, { top: number; bottom: number }>()

  const n = Math.min(count, logs.length)
  for (let i = 0; i < n; i++) {
    const log = logs[i]!
    if (log.runsScored <= 0) continue

    const bucket = inningRuns.get(log.inning) ?? { top: 0, bottom: 0 }
    if (log.half === 'top') {
      awayScore += log.runsScored
      bucket.top += log.runsScored
    } else {
      homeScore += log.runsScored
      bucket.bottom += log.runsScored
    }
    inningRuns.set(log.inning, bucket)
  }

  let currentInning = 1
  let currentHalf: PlayLog['half'] = 'top'
  if (n > 0) {
    const last = logs[n - 1]!
    currentInning = last.inning
    currentHalf = last.half
  }

  const innings: InningScore[] = []
  for (let inn = 1; inn <= currentInning; inn++) {
    const bucket = inningRuns.get(inn) ?? { top: 0, bottom: 0 }
    if (inn < currentInning) {
      innings.push({ top: bucket.top, bottom: bucket.bottom })
    } else {
      innings.push({
        top: bucket.top,
        bottom: currentHalf === 'bottom' ? bucket.bottom : undefined,
      })
    }
  }

  return { homeScore, awayScore, innings }
}
