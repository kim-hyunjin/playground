import { batter, pitcher } from '../builder'

const farmOpts = { rosterLevel: 'farm' as const }

export const ssgFarmExtended = [
  batter('SSG', '김현민', 'DH', 22, 58, { ...farmOpts, potential: 77 }),
  batter('SSG', '이도현', 'SS', 19, 56, { ...farmOpts, potential: 81 }),
  batter('SSG', '박준혁', 'CF', 20, 55, { ...farmOpts, potential: 78 }),
  batter('SSG', '최민성', 'C', 21, 54, { ...farmOpts, potential: 73 }),
  batter('SSG', '한동욱', '3B', 20, 53, { ...farmOpts, potential: 75 }),
  batter('SSG', '정태민', 'RF', 19, 52, { ...farmOpts, potential: 76 }),
  batter('SSG', '윤재원', '2B', 22, 51, { ...farmOpts, potential: 72 }),
  pitcher('SSG', '김승현', 'SP', 21, 57, { ...farmOpts, potential: 80 }),
  pitcher('SSG', '오준서', 'SP', 20, 54, { ...farmOpts, potential: 79 }),
  pitcher('SSG', '배민수', 'RP', 19, 50, { ...farmOpts, potential: 71 }),
  pitcher('SSG', '신재원', 'RP', 22, 49, { ...farmOpts, potential: 70 }),
  batter('SSG', '류승민', 'LF', 18, 48, { ...farmOpts, potential: 77 }),
  pitcher('SSG', '홍성민', 'RP', 21, 47, { ...farmOpts, potential: 69 }),
  pitcher('SSG', '강태민', 'RP', 20, 46, { ...farmOpts, potential: 68 }),
]
