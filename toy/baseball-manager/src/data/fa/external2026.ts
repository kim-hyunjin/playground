import type { PlayerRecord } from '../types'
import { batterSourceForOvr, pitcherSourceForOvr } from '../ratings/statsProfiles'

function faVeteran(
  name: string,
  role: PlayerRecord['role'],
  age: number,
  ovr: number,
): PlayerRecord {
  const isPitcher = role === 'SP' || role === 'RP'
  return {
    id: `FA-${name}`,
    name,
    teamAbbr: 'KIA',
    role,
    rosterLevel: 'first',
    age,
    sourceStats: isPitcher
      ? pitcherSourceForOvr(ovr, role)
      : batterSourceForOvr(ovr, role),
    targetOvr: ovr,
  }
}

/** 해외·独立 FA 풀 (스토브리그 보충) */
export const EXTERNAL_FA_2026: PlayerRecord[] = [
  faVeteran('마르티네스', '1B', 32, 78),
  faVeteran('존슨', 'CF', 30, 76),
  faVeteran('가르시아', 'SP', 31, 77),
  faVeteran('윌슨', 'RP', 29, 74),
  faVeteran('김해외', 'SS', 28, 72),
  faVeteran('박독립', '3B', 33, 71),
  faVeteran('이FA', 'LF', 31, 70),
  faVeteran('최영입', 'C', 30, 69),
  faVeteran('정볼펜', 'RP', 32, 73),
  faVeteran('한재계약', '2B', 29, 68),
]
