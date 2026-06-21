import type { TeamAbbr } from '../../src/data/types'

/** 게임 로스터 abbr → KBO 검색 결과 팀명 */
export const TEAM_TO_KBO_LABEL: Record<TeamAbbr, string[]> = {
  KIA: ['KIA'],
  NC: ['NC'],
  SSG: ['SSG', 'SK'],
  WO: ['키움', 'WO'],
  KT: ['KT'],
  DS: ['두산', 'DS'],
  LG: ['LG'],
  LT: ['롯데', 'LT'],
  HH: ['한화', 'HH'],
  SS: ['삼성', 'SS'],
}

/** KBO 검색·기록실 팀명 — 정확히 일치할 때만 매칭 (SS ⊂ SSG 오매칭 방지) */
export function teamLabelMatches(abbr: TeamAbbr, kboTeam: string): boolean {
  const labels = TEAM_TO_KBO_LABEL[abbr]
  const t = kboTeam.trim()
  return labels.some((l) => t === l)
}
