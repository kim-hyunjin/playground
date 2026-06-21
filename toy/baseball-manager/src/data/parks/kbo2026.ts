import type { TeamAbbr } from '../types'

/** 1.0 = 리그 평균 구장 */
export interface ParkProfile {
  abbr: TeamAbbr
  stadium: string
  runFactor: number
  hrFactor: number
  /** 실내 구장 (습도·바람 영향 축소) */
  dome?: boolean
}

export const PARKS_2026: ParkProfile[] = [
  { abbr: 'KIA', stadium: '광주-기아 챔피언스 필드', runFactor: 1.0, hrFactor: 1.0 },
  { abbr: 'NC', stadium: '창원 NC 파크', runFactor: 0.96, hrFactor: 0.94 },
  { abbr: 'SSG', stadium: '인천 SSG 랜더스필드', runFactor: 0.98, hrFactor: 0.97 },
  { abbr: '키움', stadium: '고척 스카이돔', runFactor: 0.97, hrFactor: 0.93, dome: true },
  { abbr: 'KT', stadium: 'KT 위즈파크', runFactor: 1.0, hrFactor: 0.98 },
  { abbr: '두산', stadium: '잠실 야구장', runFactor: 1.02, hrFactor: 1.01 },
  { abbr: 'LG', stadium: '잠실 야구장', runFactor: 1.02, hrFactor: 1.01 },
  { abbr: '롯데', stadium: '사직야구장', runFactor: 1.05, hrFactor: 1.06 },
  { abbr: '한화', stadium: '대전 한화생명 이글스파크', runFactor: 0.98, hrFactor: 0.96 },
  { abbr: '삼성', stadium: '대구 삼성 라이온즈 파크', runFactor: 0.95, hrFactor: 0.93 },
]

const parkByAbbr = new Map(PARKS_2026.map((p) => [p.abbr, p]))

export function parkForTeamAbbr(abbr: string): ParkProfile {
  return parkByAbbr.get(abbr as TeamAbbr) ?? NEUTRAL_PARK
}

export const NEUTRAL_PARK: ParkProfile = {
  abbr: 'KIA',
  stadium: '중립',
  runFactor: 1.0,
  hrFactor: 1.0,
}
