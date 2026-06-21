import type { AtBatOutcome } from '../../types/game'

export interface RunnerState {
  first: boolean
  second: boolean
  third: boolean
}

export function advanceRunners(
  state: RunnerState,
  outcome: AtBatOutcome,
  rand = Math.random,
): { runs: number; state: RunnerState } {
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

  if (outcome === 'out' && rand() < 0.12 && state.third) {
    runs++
    next.second = state.second
    next.first = state.first
    return { runs, state: next }
  }

  return { runs, state: next }
}

export function calcRbi(outcome: AtBatOutcome, runs: number): number {
  if (outcome === 'homerun') return runs
  if (['single', 'double', 'triple', 'walk', 'out', 'sacrifice'].includes(outcome)) return runs
  return 0
}
