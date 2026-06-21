import type { Hand } from '../../../engine/sim/handedness'

/** 2026 실명 선수 투타 — 미등록 시 ID 해시 추론 */
export const HANDEDNESS_OVERRIDES_2026: Record<
  string,
  { bats?: Hand; throws?: Hand }
> = {
  'KIA-김도영': { bats: 'R', throws: 'R' },
  'KIA-나성범': { bats: 'L', throws: 'R' },
  'KIA-최원준': { bats: 'L', throws: 'R' },
  'KIA-변우혁': { bats: 'R', throws: 'R' },
  'KIA-김석환': { bats: 'L', throws: 'R' },
  'KIA-김선빈': { bats: 'R', throws: 'R' },
  'KIA-김태군': { bats: 'R', throws: 'R' },
  'KIA-양현종': { throws: 'L' },
  'KIA-네일': { throws: 'R' },
  'KIA-정해영': { throws: 'R' },
  'NC-박민우': { bats: 'L', throws: 'R' },
  'NC-김주원': { bats: 'R', throws: 'R' },
  'NC-김성욱': { bats: 'L', throws: 'R' },
  'NC-구창모': { throws: 'L' },
  'SSG-최정': { bats: 'R', throws: 'R' },
  'SSG-김강민': { bats: 'R', throws: 'R' },
  'LG-오지환': { bats: 'L', throws: 'R' },
  'LG-문보경': { bats: 'L', throws: 'R' },
  'LG-박해민': { bats: 'L', throws: 'R' },
  'DS-양의지': { bats: 'R', throws: 'R' },
  'DS-김재환': { bats: 'L', throws: 'R' },
  'KT-강백호': { bats: 'L', throws: 'R' },
  'HH-노시환': { bats: 'R', throws: 'R' },
  'HH-문현빈': { bats: 'R', throws: 'R' },
  'LT-손아섭': { bats: 'L', throws: 'R' },
  'LT-전준우': { bats: 'R', throws: 'R' },
  'SS-구자욱': { bats: 'L', throws: 'R' },
  'SS-이재현': { bats: 'R', throws: 'R' },
  'SS-김영웅': { bats: 'R', throws: 'R' },
  'WO-이주형': { bats: 'R', throws: 'R' },
}

export function handednessForPlayerId(id: string): { bats?: Hand; throws?: Hand } | undefined {
  return HANDEDNESS_OVERRIDES_2026[id]
}
