import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'
import { ssFarmExtended } from '../farm/ss'

const T = 'SS' as const

const first = [
  batter(T, '김영웅', 'SS', 24, 86, { salaryKrw: 600_000_000, potential: 92 }),
  batter(T, '디아즈', '1B', 30, 85, { salaryKrw: 1_000_000_000 }),
  batter(T, '이성규', 'LF', 29, 82, { salaryKrw: 550_000_000 }),
  batter(T, '구자욱', 'CF', 32, 81, { salaryKrw: 700_000_000 }),
  batter(T, '김헌곤', 'RF', 31, 78, { salaryKrw: 420_000_000 }),
  batter(T, '김지찬', '2B', 25, 77, { salaryKrw: 380_000_000, potential: 85 }),
  batter(T, '강민호', 'C', 38, 75, { salaryKrw: 350_000_000 }),
  batter(T, '이재현', '3B', 27, 74, { salaryKrw: 300_000_000 }),
  batter(T, '김동엽', 'DH', 33, 73, { salaryKrw: 280_000_000 }),
  batter(T, '김성욱', 'CF', 28, 71, { salaryKrw: 240_000_000 }),
  batter(T, '이해승', 'C', 26, 69, { salaryKrw: 180_000_000 }),
  batter(T, '양우현', 'SS', 25, 68, { salaryKrw: 160_000_000 }),
  batter(T, '김재상', '2B', 29, 67, { salaryKrw: 140_000_000 }),
  pitcher(T, '원태인', 'SP', 26, 86, { salaryKrw: 650_000_000, potential: 90 }),
  pitcher(T, '후라도', 'SP', 28, 84, { salaryKrw: 900_000_000 }),
  pitcher(T, '이승현', 'SP', 27, 79, { salaryKrw: 400_000_000 }),
  pitcher(T, '최원태', 'SP', 25, 76, { salaryKrw: 320_000_000, potential: 84 }),
  pitcher(T, '최충헌', 'SP', 24, 73, { salaryKrw: 220_000_000, potential: 82 }),
  pitcher(T, '이재익', 'RP', 30, 80, { salaryKrw: 380_000_000 }),
  pitcher(T, '김재윤', 'RP', 32, 78, { salaryKrw: 320_000_000 }),
  pitcher(T, '오승환', 'RP', 36, 77, { salaryKrw: 450_000_000 }),
  pitcher(T, '이호성', 'RP', 28, 74, { salaryKrw: 230_000_000 }),
  pitcher(T, '김대호', 'RP', 27, 72, { salaryKrw: 190_000_000 }),
  pitcher(T, '박세웅', 'RP', 26, 71, { salaryKrw: 170_000_000 }),
  pitcher(T, '윤대경', 'RP', 25, 69, { salaryKrw: 140_000_000 }),
  pitcher(T, '정현우', 'RP', 24, 68, { salaryKrw: 120_000_000, potential: 76 }),
]

const farm = [
  batter(T, '박진', 'SS', 21, 60, { rosterLevel: 'farm', potential: 82 }),
  batter(T, '이준', 'CF', 20, 57, { rosterLevel: 'farm', potential: 80 }),
  pitcher(T, '김민준', 'SP', 21, 58, { rosterLevel: 'farm', potential: 84 }),
  batter(T, '최우진', 'C', 22, 55, { rosterLevel: 'farm', potential: 74 }),
  pitcher(T, '박서준', 'SP', 20, 54, { rosterLevel: 'farm', potential: 81 }),
  batter(T, '한동민', '3B', 21, 53, { rosterLevel: 'farm', potential: 76 }),
  pitcher(T, '이태민', 'RP', 22, 52, { rosterLevel: 'farm', potential: 73 }),
  batter(T, '김우진', 'RF', 20, 51, { rosterLevel: 'farm', potential: 75 }),
  pitcher(T, '정민호', 'RP', 19, 50, { rosterLevel: 'farm', potential: 72 }),
  batter(T, '오준혁', '2B', 21, 49, { rosterLevel: 'farm', potential: 74 }),
  pitcher(T, '강태우', 'SP', 20, 48, { rosterLevel: 'farm', potential: 77 }),
  batter(T, '신재민', 'LF', 19, 47, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '윤성민', 'RP', 21, 46, { rosterLevel: 'farm', potential: 70 }),
  batter(T, '장우석', '1B', 20, 45, { rosterLevel: 'farm', potential: 71 }),
  ...ssFarmExtended,
]

export const ss2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
