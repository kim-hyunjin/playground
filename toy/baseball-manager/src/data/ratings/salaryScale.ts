/** 원화 → 게임 내 달러 (대략 1억원 ≈ $100K, 팀 예산 $8~15M 유지) */
const KRW_PER_GAME_DOLLAR = 1_000_000

export function salaryKrwToGame(salaryKrw: number): number {
  return Math.max(300_000, Math.round(salaryKrw / KRW_PER_GAME_DOLLAR))
}

export function estimateSalaryFromOvr(ovr: number, age: number, isPitcher: boolean): number {
  const base = isPitcher ? 600_000 : 450_000
  const ovrBonus = (ovr - 50) * 45_000
  const ageFactor = age >= 30 ? 1.15 : age <= 23 ? 0.75 : 1
  return Math.round(Math.max(300_000, (base + ovrBonus) * ageFactor))
}
