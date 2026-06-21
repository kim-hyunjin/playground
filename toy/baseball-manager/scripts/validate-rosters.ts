import { validateAllRosters } from '../src/data/rosterLoader'

const { ok, errors } = validateAllRosters()

if (ok) {
  console.log('✓ All 2026 rosters valid (10 teams × 26 first-team)')
  process.exit(0)
}

console.error('✗ Roster validation failed:')
for (const e of errors) console.error(`  - ${e}`)
process.exit(1)
