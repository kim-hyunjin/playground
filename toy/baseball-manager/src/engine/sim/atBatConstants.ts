/** KBO 타깃 R/G ~4.5–5.5 (팀당) — sim:sanity / sim-outcomes로 검증 */
export const AT_BAT_TUNING = {
  kDivisor: 205,
  kMin: 0.18,
  kMax: 0.37,
  bbDivisor: 310,
  bbMin: 0.028,
  bbMax: 0.088,
  /** contactRoll > threshold → out. contactBase ↑ → threshold ↑ → 아웃 ↓ → 득점 ↑ */
  contactBase: 38,
  contactSkillScale: 0.20,
  contactThresholdMin: 12,
  contactThresholdMax: 55,
  hrBase: 97.8,
  hrPowerScale: 0.22,
  hrMin: 93.5,
  hrMax: 99.5,
  tripleGate: 98,
  triplePowerScale: 0.038,
  doubleGate: 89.5,
  doublePowerScale: 0.075,
} as const
