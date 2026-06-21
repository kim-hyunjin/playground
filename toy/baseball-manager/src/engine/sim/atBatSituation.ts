import type { AtBatOutcome } from '../../types/game'
import type { RunnerState } from './runners'

export interface AtBatSituation {
  outs: number
  runners: RunnerState
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/** 2사 미만 + 2·3루 주자 → 희생번트 시도 가능 */
export function canAttemptSacrifice(situation: AtBatSituation): boolean {
  if (situation.outs >= 2) return false
  return situation.runners.second || situation.runners.third
}

export function sacrificeRate(batterSpeed: number): number {
  return clamp(0.018 + (55 - batterSpeed) / 4000, 0.012, 0.04)
}

/** 타구 아웃 전 실책 전환 확률 — 수비력 낮을수록 ↑ */
export function errorRate(defenseFielding: number): number {
  return clamp(0.006 + (52 - defenseFielding) / 3500, 0.004, 0.022)
}

export function pickContactOutcome(
  wouldOut: boolean,
  batterSpeed: number,
  defenseFielding: number,
  situation: AtBatSituation,
  rand: () => number,
): AtBatOutcome {
  if (
    wouldOut &&
    canAttemptSacrifice(situation) &&
    rand() < sacrificeRate(batterSpeed)
  ) {
    return 'sacrifice'
  }
  if (wouldOut && rand() < errorRate(defenseFielding)) {
    return 'error'
  }
  return wouldOut ? 'out' : 'single'
}
