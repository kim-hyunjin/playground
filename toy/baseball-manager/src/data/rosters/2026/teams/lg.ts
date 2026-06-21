import type { TeamRosterFile } from '../../../types'
import { batter, pitcher } from '../builder'

const T = 'LG' as const

const first = [
  batter(T, '오스틴', '1B', 29, 87, { salaryKrw: 1_100_000_000 }),
  batter(T, '박해민', 'CF', 34, 84, { salaryKrw: 800_000_000 }),
  batter(T, '오지환', 'SS', 34, 82, { salaryKrw: 700_000_000 }),
  batter(T, '김현수', 'LF', 36, 81, { salaryKrw: 650_000_000 }),
  batter(T, '문보경', '3B', 25, 79, { salaryKrw: 450_000_000, potential: 88 }),
  batter(T, '홍창기', 'RF', 29, 77, { salaryKrw: 380_000_000 }),
  batter(T, '유강남', 'C', 32, 75, { salaryKrw: 320_000_000 }),
  batter(T, '신민재', '2B', 28, 73, { salaryKrw: 280_000_000 }),
  batter(T, '천성호', 'DH', 27, 72, { salaryKrw: 250_000_000 }),
  batter(T, '구본혁', 'SS', 26, 71, { salaryKrw: 220_000_000 }),
  batter(T, '이영빈', '2B', 24, 69, { salaryKrw: 180_000_000, potential: 80 }),
  batter(T, '이성원', 'C', 28, 68, { salaryKrw: 150_000_000 }),
  batter(T, '김민성', '3B', 30, 67, { salaryKrw: 140_000_000 }),
  pitcher(T, '켈ley', 'SP', 28, 85, { salaryKrw: 950_000_000 }),
  pitcher(T, '손주환', 'SP', 27, 80, { salaryKrw: 400_000_000 }),
  pitcher(T, '엔스', 'SP', 26, 78, { salaryKrw: 350_000_000 }),
  pitcher(T, '송승기', 'SP', 25, 75, { salaryKrw: 280_000_000, potential: 84 }),
  pitcher(T, '임찬규', 'SP', 31, 73, { salaryKrw: 220_000_000 }),
  pitcher(T, '고우석', 'RP', 35, 82, { salaryKrw: 500_000_000 }),
  pitcher(T, '김진성', 'RP', 32, 79, { salaryKrw: 380_000_000 }),
  pitcher(T, '함덕주', 'RP', 29, 76, { salaryKrw: 260_000_000 }),
  pitcher(T, '이정용', 'RP', 28, 74, { salaryKrw: 210_000_000 }),
  pitcher(T, '박치국', 'RP', 27, 72, { salaryKrw: 180_000_000 }),
  pitcher(T, '이우찬', 'RP', 26, 71, { salaryKrw: 160_000_000 }),
  pitcher(T, '최채훈', 'RP', 25, 69, { salaryKrw: 130_000_000 }),
  pitcher(T, '김영우', 'RP', 24, 68, { salaryKrw: 120_000_000, potential: 76 }),
]

const farm = [
  batter(T, '이주헌', 'SS', 21, 61, { rosterLevel: 'farm', potential: 81 }),
  batter(T, '박준', 'CF', 20, 57, { rosterLevel: 'farm', potential: 79 }),
  batter(T, '김태훈', 'C', 22, 55, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '정우준', 'SP', 21, 59, { rosterLevel: 'farm', potential: 83 }),
  pitcher(T, '이민호', 'SP', 20, 56, { rosterLevel: 'farm', potential: 80 }),
  batter(T, '최승민', '3B', 21, 54, { rosterLevel: 'farm', potential: 75 }),
  pitcher(T, '박건우', 'RP', 22, 53, { rosterLevel: 'farm', potential: 74 }),
  batter(T, '한지민', 'RF', 20, 52, { rosterLevel: 'farm', potential: 76 }),
  pitcher(T, '서동현', 'RP', 19, 51, { rosterLevel: 'farm', potential: 72 }),
  batter(T, '장민재', '2B', 21, 50, { rosterLevel: 'farm', potential: 73 }),
  pitcher(T, '김도현', 'SP', 20, 49, { rosterLevel: 'farm', potential: 78 }),
  batter(T, '윤서준', 'LF', 19, 48, { rosterLevel: 'farm', potential: 75 }),
  pitcher(T, '오민석', 'RP', 21, 47, { rosterLevel: 'farm', potential: 71 }),
  batter(T, '이준영', '1B', 20, 46, { rosterLevel: 'farm', potential: 70 }),
]

export const lg2026: TeamRosterFile = {
  teamAbbr: T,
  season: 2026,
  first,
  farm,
}
