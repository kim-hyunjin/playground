import type { Hand } from '../../src/engine/sim/handedness'

/** KBO 포지션 문자열 예: `내야수(우투좌타)`, `투수(좌투좌타)` */
export function parseKboPositionLabel(raw: string): { bats?: Hand; throws?: Hand } {
  const text = raw.trim()
  if (!text || text === '()') return {}

  const throws: Hand | undefined =
    text.includes('좌투') ? 'L' : text.includes('우투') ? 'R' : undefined

  const bats: Hand | undefined = text.includes('양타')
    ? 'S'
    : text.includes('좌타')
      ? 'L'
      : text.includes('우타')
        ? 'R'
        : undefined

  return { bats, throws }
}
