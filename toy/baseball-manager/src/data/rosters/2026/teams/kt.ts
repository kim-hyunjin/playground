import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'
import { ktFarmExtended } from '../farm/kt'

const T = 'KT' as const

const first = [
  batter(T, '강백호', '1B', 25, 86, { salaryKrw: 600_000_000, potential: 91 }),
  batter(T, '알몬테', 'LF', 30, 84, { salaryKrw: 850_000_000 }),
  batter(T, '김상수', '2B', 34, 81, { salaryKrw: 550_000_000 }),
  batter(T, '장성우', 'C', 33, 79, { salaryKrw: 420_000_000 }),
  batter(T, '배정대', 'CF', 30, 78, { salaryKrw: 380_000_000 }),
  batter(T, '오윤석', '3B', 28, 76, { salaryKrw: 320_000_000 }),
  batter(T, '황재균', '3B', 37, 75, { salaryKrw: 350_000_000 }),
  batter(T, '김민혁', 'RF', 27, 73, { salaryKrw: 260_000_000 }),
  batter(T, '조용호', 'DH', 32, 72, { salaryKrw: 240_000_000 }),
  batter(T, '심우준', 'SS', 29, 71, { salaryKrw: 220_000_000 }),
  batter(T, '김현수', 'C', 26, 69, { salaryKrw: 180_000_000 }),
  batter(T, '박경수', '2B', 30, 68, { salaryKrw: 160_000_000 }),
  batter(T, '이상동', 'SS', 25, 67, { salaryKrw: 140_000_000 }),
  pitcher(T, '고영표', 'SP', 28, 85, { salaryKrw: 550_000_000 }),
  pitcher(T, '쿠에바스', 'SP', 29, 83, { salaryKrw: 800_000_000 }),
  pitcher(T, '소형준', 'SP', 27, 79, { salaryKrw: 380_000_000 }),
  pitcher(T, '주권', 'SP', 26, 76, { salaryKrw: 300_000_000, potential: 83 }),
  pitcher(T, '유준', 'SP', 25, 73, { salaryKrw: 220_000_000, potential: 80 }),
  pitcher(T, '박영현', 'RP', 31, 80, { salaryKrw: 350_000_000 }),
  pitcher(T, '김재윤', 'RP', 30, 78, { salaryKrw: 300_000_000 }),
  pitcher(T, '이상화', 'RP', 29, 75, { salaryKrw: 250_000_000 }),
  pitcher(T, '박시영', 'RP', 28, 73, { salaryKrw: 210_000_000 }),
  pitcher(T, '김민', 'RP', 27, 71, { salaryKrw: 180_000_000 }),
  pitcher(T, '오유진', 'RP', 26, 69, { salaryKrw: 150_000_000 }),
  pitcher(T, '박준영', 'RP', 25, 68, { salaryKrw: 130_000_000 }),
  pitcher(T, '이호민', 'RP', 24, 67, { salaryKrw: 120_000_000, potential: 75 }),
]

const farm = [
  batter(T, '김준서', 'SS', 21, 60, { rosterLevel: 'farm', potential: 81 }),
  batter(T, '이민준', 'CF', 20, 57, { rosterLevel: 'farm', potential: 79 }),
  pitcher(T, '박태양', 'SP', 21, 58, { rosterLevel: 'farm', potential: 83 }),
  batter(T, '최민호', 'C', 22, 55, { rosterLevel: 'farm', potential: 73 }),
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
  ...ktFarmExtended,
]

export const kt2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
