import './load-csv-shim.ts'
import { loadLeague2026 } from '../src/data/rosterLoader'
import { overallRating, TEAM_DEFS } from '../src/engine/generator'

const teams = loadLeague2026(0)
const allFirst = teams.flatMap((t) => t.players.filter((p) => p.rosterLevel === 'first'))
const allFarm = teams.flatMap((t) => t.players.filter((p) => p.rosterLevel === 'farm'))
const generated = teams.flatMap((t) => t.players.filter((p) => p.isGenerated))

const TEAM_STAR_MIN = 3
const TEAM_STAR_MAX = 12
const OUTLIER_LOW = 48
const OUTLIER_HIGH = 92
const TEAM_AVG_WARN_DELTA = 5

function summarize(label: string, players: typeof allFirst) {
  if (players.length === 0) return
  const ovrs = players.map(overallRating)
  const min = Math.min(...ovrs)
  const max = Math.max(...ovrs)
  const avg = Math.round(ovrs.reduce((a, b) => a + b, 0) / ovrs.length)
  console.log(`\n${label} (${players.length}명)`)
  console.log(`  min ${min} · avg ${avg} · max ${max}`)
}

function stdDev(values: number[]): number {
  if (values.length === 0) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

console.log('=== 2026 KBO Roster OVR Report ===')

const teamAvgs: number[] = []

for (let i = 0; i < teams.length; i++) {
  const t = teams[i]!
  const def = TEAM_DEFS[i]!
  const first = t.players.filter((p) => p.rosterLevel === 'first')
  const ovrs = first.map(overallRating)
  const min = Math.min(...ovrs)
  const max = Math.max(...ovrs)
  const avg = Math.round(ovrs.reduce((a, b) => a + b, 0) / ovrs.length)
  teamAvgs.push(avg)
  const stars = first.filter((p) => overallRating(p) >= 80).length
  console.log(
    `${def.abbr.padEnd(4)} ${def.name.padEnd(14)} avg ${String(avg).padStart(2)}  min ${min}  max ${max}  ★80+ ${stars}`,
  )
}

summarize('리그 1군 전체', allFirst)
summarize('리그 2군 전체', allFarm)
console.log(`\n프로시저럴 보충 (퓨처스): ${generated.length}명`)

const warnings: string[] = []

for (let i = 0; i < teams.length; i++) {
  const t = teams[i]!
  const def = TEAM_DEFS[i]!
  const first = t.players.filter((p) => p.rosterLevel === 'first')
  const stars = first.filter((p) => overallRating(p) >= 80).length
  if (stars < TEAM_STAR_MIN) {
    warnings.push(`${def.abbr}: ★80+ ${stars}명 (권장 ≥${TEAM_STAR_MIN})`)
  }
  if (stars > TEAM_STAR_MAX) {
    warnings.push(`${def.abbr}: ★80+ ${stars}명 (권장 ≤${TEAM_STAR_MAX})`)
  }
}

const leagueAvg = teamAvgs.reduce((a, b) => a + b, 0) / teamAvgs.length
const spread = stdDev(teamAvgs)
if (spread > 3) {
  warnings.push(`팀 간 1군 평균 OVR 편차 큼 (σ=${spread.toFixed(1)})`)
}

const lowTeams = teams.filter((t, i) => teamAvgs[i]! < leagueAvg - TEAM_AVG_WARN_DELTA)
const highTeams = teams.filter((t, i) => teamAvgs[i]! > leagueAvg + TEAM_AVG_WARN_DELTA)
if (lowTeams.length) {
  warnings.push(`저OVR 팀: ${lowTeams.map((t) => t.abbr).join(', ')}`)
}
if (highTeams.length) {
  warnings.push(`고OVR 팀: ${highTeams.map((t) => t.abbr).join(', ')}`)
}

const outliers = allFirst.filter(
  (p) => overallRating(p) >= OUTLIER_HIGH || overallRating(p) <= OUTLIER_LOW,
)
if (outliers.length > 0) {
  console.log(`\n⚠ 개별 이상치 (OVR ≤${OUTLIER_LOW} 또는 ≥${OUTLIER_HIGH}):`)
  for (const p of outliers) {
    console.log(`  ${p.name} (${p.role}) OVR ${overallRating(p)}`)
  }
}

const farmOutliers = allFarm.filter(
  (p) => overallRating(p) >= 72 || overallRating(p) <= 40,
)
if (farmOutliers.length > 0) {
  console.log(`\n⚠ 2군 이상치 (OVR ≤40 또는 ≥72):`)
  for (const p of farmOutliers.slice(0, 15)) {
    console.log(`  ${p.name} (${p.role}) OVR ${overallRating(p)}`)
  }
  if (farmOutliers.length > 15) {
    console.log(`  … 외 ${farmOutliers.length - 15}명`)
  }
}

if (warnings.length > 0) {
  console.log('\n⚠ 밸런스 경고:')
  for (const w of warnings) console.log(`  - ${w}`)
} else {
  console.log('\n✓ 팀 간 OVR 분포 정상 범위')
}

console.log(`\n리그 1군 평균 기준: ${Math.round(leagueAvg)} (±${TEAM_AVG_WARN_DELTA} 경고)`)
