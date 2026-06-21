import type { BatterSourceStats, PitcherSourceStats } from '../types'

/** OVR 목표치 → sourceStats (batterFromStats / pitcherFromStats 파이프라인 입력) */
export function batterSourceForOvr(ovr: number, role?: string): BatterSourceStats {
  const t = (ovr - 55) / 28
  const speedRoles = new Set(['SS', 'CF', '2B'])
  const sb = speedRoles.has(role ?? '') ? Math.round(8 + t * 22) : Math.round(2 + t * 10)

  return {
    pa: ovr >= 70 ? 520 : 380,
    woba: 0.31 + t * 0.09,
    iso: 0.11 + t * 0.08,
    bbPct: 0.07 + t * 0.035,
    kPct: 0.22 - t * 0.05,
    sb: Math.max(0, sb),
  }
}

export function pitcherSourceForOvr(ovr: number, role: 'SP' | 'RP'): PitcherSourceStats {
  const t = (ovr - 55) / 28
  const isSp = role === 'SP'

  return {
    ip: isSp ? 110 + Math.round(t * 40) : 38 + Math.round(t * 15),
    era: 5.2 - t * 1.4,
    fip: 5.0 - t * 1.2,
    k9: 6.5 + t * 4.5,
    bb9: 4.0 - t * 1.1,
    gs: isSp ? 18 + Math.round(t * 6) : 0,
    games: isSp ? 22 + Math.round(t * 4) : 35 + Math.round(t * 8),
  }
}
