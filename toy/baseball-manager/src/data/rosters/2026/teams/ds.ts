import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'

const T = 'DS' as const

const first = [
  batter(T, '양의지', 'C', 37, 86, { salaryKrw: 1_000_000_000 }),
  batter(T, '김재환', 'LF', 36, 84, { salaryKrw: 750_000_000 }),
  batter(T, '케이브', 'CF', 30, 82, { salaryKrw: 700_000_000 }),
  batter(T, '양석환', '1B', 29, 80, { salaryKrw: 480_000_000 }),
  batter(T, '김재호', 'SS', 38, 78, { salaryKrw: 400_000_000 }),
  batter(T, '허경민', '3B', 34, 77, { salaryKrw: 380_000_000 }),
  batter(T, '박계범', '2B', 28, 75, { salaryKrw: 320_000_000 }),
  batter(T, '김민석', 'RF', 27, 73, { salaryKrw: 260_000_000 }),
  batter(T, '강승호', '2B', 26, 72, { salaryKrw: 240_000_000, potential: 82 }),
  batter(T, '김인태', 'DH', 31, 71, { salaryKrw: 220_000_000 }),
  batter(T, '박세혁', 'C', 29, 69, { salaryKrw: 180_000_000 }),
  batter(T, '이유찬', 'SS', 25, 68, { salaryKrw: 160_000_000, potential: 78 }),
  batter(T, '조수행', 'CF', 26, 67, { salaryKrw: 140_000_000 }),
  pitcher(T, '곽빈', 'SP', 26, 84, { salaryKrw: 500_000_000, potential: 88 }),
  pitcher(T, '잭로그', 'SP', 28, 83, { salaryKrw: 850_000_000 }),
  pitcher(T, '최승용', 'SP', 27, 79, { salaryKrw: 380_000_000 }),
  pitcher(T, '이영하', 'SP', 25, 76, { salaryKrw: 300_000_000, potential: 84 }),
  pitcher(T, '김민규', 'SP', 24, 73, { salaryKrw: 220_000_000, potential: 81 }),
  pitcher(T, '김강률', 'RP', 32, 80, { salaryKrw: 350_000_000 }),
  pitcher(T, '홍건희', 'RP', 30, 78, { salaryKrw: 300_000_000 }),
  pitcher(T, '이승진', 'RP', 29, 75, { salaryKrw: 250_000_000 }),
  pitcher(T, '박치국', 'RP', 28, 73, { salaryKrw: 210_000_000 }),
  pitcher(T, '김재훈', 'RP', 27, 71, { salaryKrw: 180_000_000 }),
  pitcher(T, '이재민', 'RP', 26, 69, { salaryKrw: 150_000_000 }),
  pitcher(T, '최민준', 'RP', 25, 68, { salaryKrw: 130_000_000 }),
  pitcher(T, '박준형', 'RP', 24, 67, { salaryKrw: 120_000_000, potential: 75 }),
]

const farm = [
  batter(T, '김도윤', 'SS', 21, 60, { rosterLevel: 'farm', potential: 81 }),
  batter(T, '이준호', 'CF', 20, 57, { rosterLevel: 'farm', potential: 79 }),
  pitcher(T, '박민재', 'SP', 21, 58, { rosterLevel: 'farm', potential: 83 }),
  batter(T, '최우진', 'C', 22, 55, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '김태민', 'SP', 20, 54, { rosterLevel: 'farm', potential: 80 }),
  batter(T, '한승우', '3B', 21, 53, { rosterLevel: 'farm', potential: 75 }),
  pitcher(T, '오준영', 'RP', 22, 52, { rosterLevel: 'farm', potential: 72 }),
  batter(T, '정민수', 'RF', 20, 51, { rosterLevel: 'farm', potential: 74 }),
  pitcher(T, '윤재호', 'RP', 19, 50, { rosterLevel: 'farm', potential: 71 }),
  batter(T, '장서준', '2B', 21, 49, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '신태양', 'SP', 20, 48, { rosterLevel: 'farm', potential: 77 }),
  batter(T, '박우진', 'LF', 19, 47, { rosterLevel: 'farm', potential: 72 }),
  pitcher(T, '김민호', 'RP', 21, 46, { rosterLevel: 'farm', potential: 70 }),
  batter(T, '이동민', '1B', 20, 45, { rosterLevel: 'farm', potential: 71 }),
]

export const ds2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
