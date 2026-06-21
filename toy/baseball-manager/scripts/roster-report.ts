import { loadLeague2026 } from '../src/data/rosterLoader'
import { overallRating } from '../src/engine/generator'
import { TEAM_DEFS } from '../src/engine/generator'

const teams = loadLeague2026(0)
const allFirst = teams.flatMap((t) => t.players.filter((p) => p.rosterLevel === 'first'))
const allFarm = teams.flatMap((t) => t.players.filter((p) => p.rosterLevel === 'farm'))
const generated = teams.flatMap((t) => t.players.filter((p) => p.isGenerated))

function summarize(label: string, players: typeof allFirst) {
  if (players.length === 0) return
  const ovrs = players.map(overallRating)
  const min = Math.min(...ovrs)
  const max = Math.max(...ovrs)
  const avg = Math.round(ovrs.reduce((a, b) => a + b, 0) / ovrs.length)
  console.log(`\n${label} (${players.length}명)`)
  console.log(`  min ${min} · avg ${avg} · max ${max}`)
}

console.log('=== 2026 KBO Roster OVR Report ===')

for (let i = 0; i < teams.length; i++) {
  const t = teams[i]!
  const def = TEAM_DEFS[i]!
  const first = t.players.filter((p) => p.rosterLevel === 'first')
  const ovrs = first.map(overallRating)
  const min = Math.min(...ovrs)
  const max = Math.max(...ovrs)
  const avg = Math.round(ovrs.reduce((a, b) => a + b, 0) / ovrs.length)
  const stars = first.filter((p) => overallRating(p) >= 80).length
  console.log(
    `${def.abbr.padEnd(4)} ${def.name.padEnd(14)} avg ${String(avg).padStart(2)}  min ${min}  max ${max}  ★80+ ${stars}`,
  )
}

summarize('리그 1군 전체', allFirst)
summarize('리그 2군 전체', allFarm)
console.log(`\n프로시저럴 보충 (퓨처스): ${generated.length}명`)

const outliers = allFirst.filter((p) => overallRating(p) >= 92 || overallRating(p) <= 48)
if (outliers.length > 0) {
  console.log('\n⚠ 이상치 (OVR ≤48 또는 ≥92):')
  for (const p of outliers) {
    console.log(`  ${p.name} (${p.role}) OVR ${overallRating(p)}`)
  }
}
