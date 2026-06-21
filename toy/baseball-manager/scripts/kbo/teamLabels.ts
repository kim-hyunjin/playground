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

export function teamLabelMatches(abbr: TeamAbbr, kboTeam: string): boolean {
  const labels = TEAM_TO_KBO_LABEL[abbr]
  return labels.some((l) => kboTeam.trim() === l || kboTeam.includes(l))
}
