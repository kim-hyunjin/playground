/** KBO 검색용 이름 별칭 (record.name → search names) */
export const KBO_SEARCH_ALIASES: Record<string, string[]> = {
  '켈ley': ['켈리', 'Kelly'],
  찰스: ['Charles', '찰스'],
  로건: ['Logan'],
  앤더슨: ['Anderson'],
  데이비슨: ['Davidson'],
  쿠에바스: ['Cuas'],
}

/** record.id → KBO playerId (확실한 경우만) */
export const KBO_PLAYER_OVERRIDES: Record<string, string> = {}

/** KBO 검색 결과에서 제외할 팀 (군/2군/역사 팀) */
export const KBO_INACTIVE_TEAMS = new Set([
  '상무',
  '고양',
  '쌍방울',
  '대학',
  '울산',
  '삼미',
  '넥센',
  '현대',
  'SK', // SSG 구단명은 SSG — SK 단독은 구단 변천 잔재
])

export function isActiveKboTeam(team: string): boolean {
  const t = team.trim()
  if (KBO_INACTIVE_TEAMS.has(t)) return false
  if (t.includes('상무') || t.includes('고양') || t.includes('쌍방울')) return false
  return true
}
