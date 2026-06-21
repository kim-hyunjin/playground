import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'
import { hhFarmExtended } from '../farm/hh'

const T = 'HH' as const

const first = [
  batter(T, '노시환', '3B', 25, 87, { salaryKrw: 650_000_000, potential: 93 }),
  batter(T, '문현빈', 'SS', 24, 84, { salaryKrw: 500_000_000, potential: 91 }),
  batter(T, '채은성', 'LF', 30, 82, { salaryKrw: 550_000_000 }),
  batter(T, '이재원', '1B', 28, 80, { salaryKrw: 420_000_000 }),
  batter(T, '김태연', '2B', 29, 78, { salaryKrw: 350_000_000 }),
  batter(T, '최재훈', 'C', 33, 76, { salaryKrw: 320_000_000 }),
  batter(T, '이진영', 'CF', 27, 74, { salaryKrw: 280_000_000 }),
  batter(T, '김민우', 'RF', 26, 72, { salaryKrw: 240_000_000 }),
  batter(T, '하주석', 'SS', 30, 71, { salaryKrw: 220_000_000 }),
  batter(T, '장진혁', 'DH', 31, 70, { salaryKrw: 200_000_000 }),
  batter(T, '박상언', 'C', 28, 68, { salaryKrw: 160_000_000 }),
  batter(T, '김지수', '2B', 25, 67, { salaryKrw: 150_000_000, potential: 77 }),
  batter(T, '이도윤', '3B', 24, 66, { salaryKrw: 140_000_000, potential: 76 }),
  pitcher(T, '폰세', 'SP', 28, 86, { salaryKrw: 900_000_000 }),
  pitcher(T, '와이스', 'SP', 27, 84, { salaryKrw: 800_000_000 }),
  pitcher(T, '김영수', 'SP', 26, 79, { salaryKrw: 380_000_000 }),
  pitcher(T, '한승주', 'SP', 25, 76, { salaryKrw: 300_000_000, potential: 84 }),
  pitcher(T, '정우람', 'SP', 24, 73, { salaryKrw: 220_000_000, potential: 81 }),
  pitcher(T, '김서현', 'RP', 30, 80, { salaryKrw: 350_000_000 }),
  pitcher(T, '주현상', 'RP', 29, 78, { salaryKrw: 300_000_000 }),
  pitcher(T, '김재승', 'RP', 28, 75, { salaryKrw: 250_000_000 }),
  pitcher(T, '박상원', 'RP', 27, 73, { salaryKrw: 210_000_000 }),
  pitcher(T, '이상규', 'RP', 26, 71, { salaryKrw: 180_000_000 }),
  pitcher(T, '김기중', 'RP', 25, 69, { salaryKrw: 150_000_000 }),
  pitcher(T, '오동욱', 'RP', 24, 68, { salaryKrw: 130_000_000 }),
  pitcher(T, '박준호', 'RP', 23, 67, { salaryKrw: 120_000_000, potential: 75 }),
]

const farm = [
  batter(T, '김준서', 'SS', 21, 61, { rosterLevel: 'farm', potential: 82 }),
  batter(T, '이민준', 'CF', 20, 58, { rosterLevel: 'farm', potential: 80 }),
  pitcher(T, '박태양', 'SP', 21, 57, { rosterLevel: 'farm', potential: 83 }),
  batter(T, '최동현', 'C', 22, 55, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '김서준', 'SP', 20, 54, { rosterLevel: 'farm', potential: 80 }),
  batter(T, '한지우', '3B', 21, 53, { rosterLevel: 'farm', potential: 75 }),
  pitcher(T, '오태민', 'RP', 22, 52, { rosterLevel: 'farm', potential: 72 }),
  batter(T, '정민재', 'RF', 20, 51, { rosterLevel: 'farm', potential: 74 }),
  pitcher(T, '윤서영', 'RP', 19, 50, { rosterLevel: 'farm', potential: 71 }),
  batter(T, '장우진', '2B', 21, 49, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '신동욱', 'SP', 20, 48, { rosterLevel: 'farm', potential: 77 }),
  batter(T, '박재민', 'LF', 19, 47, { rosterLevel: 'farm', potential: 72 }),
  pitcher(T, '김태우', 'RP', 21, 46, { rosterLevel: 'farm', potential: 70 }),
  batter(T, '이우진', '1B', 20, 45, { rosterLevel: 'farm', potential: 71 }),
  ...hhFarmExtended,
]

export const hh2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
