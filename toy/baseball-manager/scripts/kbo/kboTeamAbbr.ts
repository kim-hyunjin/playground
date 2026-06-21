import type { TeamAbbr } from '../../src/data/types'
import { TEAM_TO_KBO_LABEL, teamLabelMatches } from './teamLabels'

/** KBO 기록실·검색 팀명 → 게임 abbr */
export function abbrFromKboTeam(kboTeam: string): TeamAbbr | null {
  const t = kboTeam.trim()
  for (const abbr of Object.keys(TEAM_TO_KBO_LABEL) as TeamAbbr[]) {
    if (teamLabelMatches(abbr, t)) return abbr
  }
  return null
}

export const KBO_TEAM_CODES: Record<TeamAbbr, string> = {
  LG: 'LG',
  KT: 'KT',
  SS: 'SS',
  KIA: 'HT',
  DS: 'OB',
  HH: 'HH',
  NC: 'NC',
  LT: 'LT',
  SSG: 'SK',
  WO: 'WO',
}
