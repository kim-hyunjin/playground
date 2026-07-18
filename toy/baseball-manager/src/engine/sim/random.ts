/** JSON으로 저장 가능한 32-bit 결정론적 난수 상태 */
export interface RandomState {
  seed: number
}

export function normalizeSeed(seed: number): number {
  const value = seed >>> 0
  return value === 0 ? 0x6d2b79f5 : value
}

/** Mulberry32. 호출할 때마다 state.seed도 갱신된다. */
export function createSeededRandom(state: RandomState): () => number {
  state.seed = normalizeSeed(state.seed)
  return () => {
    let next = (state.seed += 0x6d2b79f5)
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}
