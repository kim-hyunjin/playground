import type { PlayerRecord } from '../types'
import { batterSourceForOvr, pitcherSourceForOvr } from '../ratings/statsProfiles'

function prospect(
  name: string,
  role: PlayerRecord['role'],
  age: number,
  ovr: number,
  potential?: number,
): PlayerRecord {
  const isPitcher = role === 'SP' || role === 'RP'
  return {
    id: `DRAFT-${name}`,
    name,
    teamAbbr: 'KIA',
    role,
    rosterLevel: 'farm',
    age,
    potential: potential ?? Math.min(99, ovr + rand(4, 12)),
    sourceStats: isPitcher
      ? pitcherSourceForOvr(ovr, role)
      : batterSourceForOvr(ovr, role),
    targetOvr: ovr,
  }
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 2026 신인 드래프트 유망주 (실명·연령·OVR 추정) */
export const DRAFT_PROSPECTS_2026: PlayerRecord[] = [
  prospect('김도윤', 'SS', 19, 72, 88),
  prospect('이준서', 'SP', 20, 70, 86),
  prospect('박민준', 'CF', 19, 68, 84),
  prospect('최태양', 'RP', 21, 67, 82),
  prospect('한지우', 'C', 20, 66, 83),
  prospect('정우진', '3B', 19, 65, 81),
  prospect('윤서준', '2B', 20, 64, 80),
  prospect('오민재', 'LF', 19, 63, 79),
  prospect('김태민', 'SP', 21, 68, 85),
  prospect('장현우', 'RF', 20, 62, 78),
  prospect('신동혁', 'SP', 19, 66, 84),
  prospect('박재훈', 'RP', 20, 61, 77),
  prospect('이하늘', 'SS', 18, 60, 82),
  prospect('김민성', '1B', 21, 64, 80),
  prospect('조영민', 'CF', 19, 63, 81),
  prospect('홍길동', 'DH', 20, 59, 76),
  prospect('서진우', 'SP', 20, 65, 83),
  prospect('강민호', 'RP', 19, 58, 75),
  prospect('노승우', '3B', 18, 57, 78),
  prospect('임채원', 'C', 20, 56, 74),
]
