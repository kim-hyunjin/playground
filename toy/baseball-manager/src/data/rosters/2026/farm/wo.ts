import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

export const woFarmExtended = [
  batter('WO', '김태연', 'DH', 22, 57, { ...farmOpts, potential: 76 }),
  batter('WO', '이성민', 'SS', 19, 55, { ...farmOpts, potential: 80 }),
  batter('WO', '박지후', 'CF', 20, 54, { ...farmOpts, potential: 77 }),
  batter('WO', '최우빈', 'C', 21, 53, { ...farmOpts, potential: 72 }),
  batter('WO', '한재민', '3B', 20, 52, { ...farmOpts, potential: 74 }),
  batter('WO', '정하늘', 'RF', 19, 51, { ...farmOpts, potential: 75 }),
  batter('WO', '윤도윤', '2B', 22, 50, { ...farmOpts, potential: 71 }),
  pitcher('WO', '김민재', 'SP', 21, 56, { ...farmOpts, potential: 79 }),
  pitcher('WO', '오승준', 'SP', 20, 53, { ...farmOpts, potential: 78 }),
  pitcher('WO', '배성훈', 'RP', 19, 49, { ...farmOpts, potential: 70 }),
  pitcher('WO', '신우진', 'RP', 22, 48, { ...farmOpts, potential: 69 }),
  batter('WO', '장민성', 'LF', 18, 47, { ...farmOpts, potential: 76 }),
  pitcher('WO', '류태양', 'RP', 21, 46, { ...farmOpts, potential: 68 }),
  pitcher('WO', '홍준영', 'RP', 20, 45, { ...farmOpts, potential: 67 }),
]
