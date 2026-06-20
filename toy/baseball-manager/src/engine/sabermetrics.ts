import type { BatterStats, PitcherStats, Player, Team } from '../types/game'

/** FanGraphs 2023 wOBA weights (approx.) */
const W_BB = 0.690
const W_HBP = 0.722
const W_1B = 0.883
const W_2B = 1.244
const W_3B = 1.569
const W_HR = 2.015

const FIP_CONSTANT = 3.10

function safeDiv(n: number, d: number) {
  return d > 0 ? n / d : 0
}

function fmt3(n: number) {
  return n.toFixed(3)
}

function fmt2(n: number) {
  return n.toFixed(2)
}

function fmt1(n: number) {
  return n.toFixed(1)
}

export function ipFromOuts(outs: number) {
  const full = Math.floor(outs / 3)
  const rem = outs % 3
  return rem === 0 ? `${full}.0` : `${full}.${rem}`
}

export function ipDecimal(outs: number) {
  return outs / 3
}

// ── 타자 파생 스탯 ──

export function calcAvg(s: BatterStats) {
  return safeDiv(s.hits, s.ab)
}

export function calcObp(s: BatterStats) {
  return safeDiv(s.hits + s.bb + s.hbp, s.pa)
}

export function calcSlg(s: BatterStats) {
  const tb = s.singles + s.doubles * 2 + s.triples * 3 + s.hr * 4
  return safeDiv(tb, s.ab)
}

export function calcOps(s: BatterStats) {
  return calcObp(s) + calcSlg(s)
}

export function calcIso(s: BatterStats) {
  return calcSlg(s) - calcAvg(s)
}

export function calcBabip(s: BatterStats) {
  const denom = s.ab - s.k - s.hr
  return safeDiv(s.hits - s.hr, denom)
}

export function calcKPct(s: BatterStats) {
  return safeDiv(s.k, s.pa) * 100
}

export function calcBBPct(s: BatterStats) {
  return safeDiv(s.bb, s.pa) * 100
}

export function calcWoba(s: BatterStats) {
  const num =
    W_BB * s.bb +
    W_HBP * s.hbp +
    W_1B * s.singles +
    W_2B * s.doubles +
    W_3B * s.triples +
    W_HR * s.hr
  return safeDiv(num, s.pa)
}

export interface LeagueBattingRates {
  lgWoba: number
  lgOps: number
}

export function leagueBattingRates(teams: Team[]): LeagueBattingRates {
  let pa = 0
  let wobaNum = 0
  let opsSum = 0
  let hitters = 0

  for (const t of teams) {
    for (const p of t.players) {
      if (p.seasonStats.type !== 'batter' || p.seasonStats.pa === 0) continue
      const s = p.seasonStats
      pa += s.pa
      wobaNum +=
        W_BB * s.bb + W_HBP * s.hbp +
        W_1B * s.singles + W_2B * s.doubles + W_3B * s.triples + W_HR * s.hr
      opsSum += calcOps(s)
      hitters++
    }
  }

  const lgWoba = pa > 0 ? wobaNum / pa : 0.320
  const lgOps = hitters > 0 ? opsSum / hitters : 0.750
  return { lgWoba, lgOps }
}

export function calcWrcPlus(s: BatterStats, lg: LeagueBattingRates) {
  if (s.pa === 0) return 100
  const woba = calcWoba(s)
  return Math.round((woba / lg.lgWoba) * 100)
}

export interface BatterSabermetrics {
  avg: string
  obp: string
  slg: string
  ops: string
  iso: string
  babip: string
  woba: string
  wrcPlus: number
  kPct: string
  bbPct: string
}

export function batterSabermetrics(s: BatterStats, lg: LeagueBattingRates): BatterSabermetrics {
  return {
    avg: fmt3(calcAvg(s)),
    obp: fmt3(calcObp(s)),
    slg: fmt3(calcSlg(s)),
    ops: fmt3(calcOps(s)),
    iso: fmt3(calcIso(s)),
    babip: fmt3(calcBabip(s)),
    woba: fmt3(calcWoba(s)),
    wrcPlus: calcWrcPlus(s, lg),
    kPct: fmt1(calcKPct(s)),
    bbPct: fmt1(calcBBPct(s)),
  }
}

// ── 투수 파생 스탯 ──

export function calcEra(s: PitcherStats) {
  const ip = ipDecimal(s.outs)
  return safeDiv(s.er * 9, ip)
}

export function calcWhip(s: PitcherStats) {
  const ip = ipDecimal(s.outs)
  return safeDiv(s.h + s.bb, ip)
}

export function calcK9(s: PitcherStats) {
  const ip = ipDecimal(s.outs)
  return safeDiv(s.k * 9, ip)
}

export function calcBB9(s: PitcherStats) {
  const ip = ipDecimal(s.outs)
  return safeDiv(s.bb * 9, ip)
}

export function calcHR9(s: PitcherStats) {
  const ip = ipDecimal(s.outs)
  return safeDiv(s.hr * 9, ip)
}

export function calcPitcherKPct(s: PitcherStats) {
  return safeDiv(s.k, s.bf) * 100
}

export function calcPitcherBBPct(s: PitcherStats) {
  return safeDiv(s.bb, s.bf) * 100
}

export function calcFip(s: PitcherStats) {
  const ip = ipDecimal(s.outs)
  if (ip <= 0) return 0
  return safeDiv(13 * s.hr + 3 * (s.bb + s.hbp) - 2 * s.k, ip) + FIP_CONSTANT
}

export interface LeaguePitchingRates {
  lgHr9: number
}

export function leaguePitchingRates(teams: Team[]): LeaguePitchingRates {
  let outs = 0
  let hr = 0
  for (const t of teams) {
    for (const p of t.players) {
      if (p.seasonStats.type !== 'pitcher' || p.seasonStats.outs === 0) continue
      outs += p.seasonStats.outs
      hr += p.seasonStats.hr
    }
  }
  const ip = outs / 3
  const lgHr9 = ip > 0 ? (hr * 9) / ip : 1.1
  return { lgHr9 }
}

/** xFIP: 실제 HR 대신 리그 평균 HR/9 적용 */
export function calcXFip(s: PitcherStats, lg: LeaguePitchingRates) {
  const ip = ipDecimal(s.outs)
  if (ip <= 0) return 0
  const expectedHr = (lg.lgHr9 / 9) * ip
  return safeDiv(13 * expectedHr + 3 * (s.bb + s.hbp) - 2 * s.k, ip) + FIP_CONSTANT
}

export interface PitcherSabermetrics {
  era: string
  fip: string
  xfip: string
  whip: string
  k9: string
  bb9: string
  hr9: string
  kPct: string
  bbPct: string
  ip: string
}

export function pitcherSabermetrics(s: PitcherStats, lg: LeaguePitchingRates): PitcherSabermetrics {
  return {
    era: fmt2(calcEra(s)),
    fip: fmt2(calcFip(s)),
    xfip: fmt2(calcXFip(s, lg)),
    whip: fmt2(calcWhip(s)),
    k9: fmt1(calcK9(s)),
    bb9: fmt1(calcBB9(s)),
    hr9: fmt1(calcHR9(s)),
    kPct: fmt1(calcPitcherKPct(s)),
    bbPct: fmt1(calcPitcherBBPct(s)),
    ip: ipFromOuts(s.outs),
  }
}

export function isBatterStats(s: BatterStats | PitcherStats): s is BatterStats {
  return s.type === 'batter'
}

export function isPitcherStats(s: BatterStats | PitcherStats): s is PitcherStats {
  return s.type === 'pitcher'
}

export function getPlayerSabermetrics(player: Player, teams: Team[]) {
  const lgBat = leagueBattingRates(teams)
  const lgPit = leaguePitchingRates(teams)
  if (player.seasonStats.type === 'batter') {
    return { kind: 'batter' as const, stats: batterSabermetrics(player.seasonStats, lgBat), raw: player.seasonStats }
  }
  return { kind: 'pitcher' as const, stats: pitcherSabermetrics(player.seasonStats, lgPit), raw: player.seasonStats }
}
