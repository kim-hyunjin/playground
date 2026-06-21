import type { AtBatOutcome } from '../../types/game'

export interface RunnerState {
  first: boolean
  second: boolean
  third: boolean
  firstId?: string
  secondId?: string
  thirdId?: string
}

export function emptyRunners(): RunnerState {
  return { first: false, second: false, third: false }
}

export function advanceRunners(
  state: RunnerState,
  outcome: AtBatOutcome,
  batterId: string,
  rand = Math.random,
): { runs: number; state: RunnerState } {
  let runs = 0
  const next: RunnerState = { first: false, second: false, third: false }

  if (outcome === 'walk') {
    if (state.first && state.second && state.third) runs++
    next.third = state.second || state.third
    next.second = state.first || state.second
    next.first = true
    next.firstId = batterId
    if (state.first && state.second && state.third) {
      next.third = true
      next.second = true
      next.first = true
      next.thirdId = state.thirdId
      next.secondId = state.secondId
      next.firstId = batterId
    } else if (state.first && state.second) {
      next.third = true
      next.second = true
      next.first = true
      next.thirdId = state.secondId
      next.secondId = state.firstId
      next.firstId = batterId
    } else if (state.first) {
      next.second = true
      next.first = true
      next.secondId = state.firstId
      next.firstId = batterId
    } else {
      next.first = true
      next.firstId = batterId
    }
    return { runs, state: next }
  }

  if (outcome === 'error') {
    if (state.third) runs++
    next.third = state.second
    next.second = state.first
    next.first = true
    next.thirdId = state.secondId
    next.secondId = state.firstId
    next.firstId = batterId
    return { runs, state: next }
  }

  if (outcome === 'sacrifice') {
    if (state.third) runs++
    next.third = state.second
    next.second = state.first
    next.thirdId = state.secondId
    next.secondId = state.firstId
    return { runs, state: next }
  }

  if (outcome === 'single') {
    if (state.third) runs++
    next.third = state.second
    next.second = state.first
    next.first = true
    next.thirdId = state.secondId
    next.secondId = state.firstId
    next.firstId = batterId
    return { runs, state: next }
  }

  if (outcome === 'double') {
    if (state.third) runs++
    if (state.second) runs++
    next.third = state.first
    next.second = true
    next.thirdId = state.firstId
    next.secondId = batterId
    return { runs, state: next }
  }

  if (outcome === 'triple') {
    runs += [state.first, state.second, state.third].filter(Boolean).length
    next.third = true
    next.thirdId = batterId
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
    next.secondId = state.secondId
    next.firstId = state.firstId
    return { runs, state: next }
  }

  next.second = state.second
  next.first = state.first
  next.third = state.third
  next.secondId = state.secondId
  next.firstId = state.firstId
  next.thirdId = state.thirdId
  return { runs, state: next }
}

export function tryStealAttempt(
  state: RunnerState,
  runnerSpeed: number,
  pitcherControl: number,
  outs: number,
  rand = Math.random,
): { state: RunnerState; stolen: boolean; stealerId?: string } {
  if (outs >= 3 || !state.first || state.second) {
    return { state, stolen: false }
  }

  const chance = Math.max(
    0.012,
    Math.min(0.14, 0.025 + runnerSpeed / 380 - pitcherControl / 520),
  )
  if (rand() >= chance) return { state, stolen: false }

  const stealerId = state.firstId
  return {
    stolen: true,
    stealerId,
    state: {
      ...state,
      first: false,
      second: true,
      firstId: undefined,
      secondId: stealerId ?? state.secondId,
    },
  }
}

export function calcRbi(outcome: AtBatOutcome, runs: number): number {
  if (outcome === 'homerun') return runs
  if (['single', 'double', 'triple', 'walk', 'out', 'sacrifice', 'error'].includes(outcome)) {
    return runs
  }
  return 0
}
