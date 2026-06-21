/**
 * KBO 공식 사이트에서 투타 정보를 수집해 캐시·override 파일을 갱신합니다.
 *
 * 파이프라인:
 *   1. 선수명 검색 (Player/Search.aspx POST) → playerId + 팀명
 *   2. 상세 페이지 (HitterDetail/PitcherDetail) → `내야수(우투좌타)` 파싱
 *   3. data/cache/kbo-handedness.json 저장
 *   4. src/data/rosters/2026/handednessOverrides.ts 재생성
 *
 * 사용:
 *   npm run kbo:handedness              # 미수집 선수만
 *   npm run kbo:handedness -- --all     # 전체 재수집
 *   npm run kbo:handedness -- --dry-run # 파일 쓰기 없이 로그만
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROSTERS_KBO } from '../src/data/rosters/2026/kbo/index'
import { handednessForPlayerId } from '../src/data/rosters/2026/handednessOverrides'
import type { PlayerRecord, TeamAbbr } from '../src/data/types'
import { parseKboPositionLabel } from './kbo/parseHandedness'
import { fetchKboPositionLabel, searchKboPlayer, sleep } from './kbo/kboClient'
import { teamLabelMatches } from './kbo/teamLabels'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CACHE_PATH = path.join(ROOT, 'data/cache/kbo-handedness.json')
const OVERRIDES_PATH = path.join(ROOT, 'src/data/rosters/2026/handednessOverrides.ts')

const DELAY_MS = 350

interface HandednessEntry {
  playerId: string
  kboPlayerId: string
  name: string
  teamAbbr: TeamAbbr
  kboTeam: string
  positionLabel: string
  bats?: 'L' | 'R' | 'S'
  throws?: 'L' | 'R' | 'S'
  fetchedAt: string
  source: 'kbo-search'
}

type CacheFile = Record<string, HandednessEntry>

function allRecords(): PlayerRecord[] {
  const out: PlayerRecord[] = []
  for (const file of ROSTERS_KBO) {
    out.push(...file.first, ...file.farm)
  }
  return out
}

function loadCache(): CacheFile {
  if (!fs.existsSync(CACHE_PATH)) return {}
  return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8')) as CacheFile
}

function saveCache(cache: CacheFile) {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true })
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf-8')
}

function writeOverrides(cache: CacheFile) {
  const lines: string[] = [
    "import type { Hand } from '../../../engine/sim/handedness'",
    '',
    '/** KBO 공식 기록실에서 자동 수집 — npm run kbo:handedness */',
    'export const HANDEDNESS_OVERRIDES_2026: Record<',
    '  string,',
    '  { bats?: Hand; throws?: Hand }',
    '> = {',
  ]

  const sorted = Object.keys(cache).sort()
  for (const id of sorted) {
    const e = cache[id]!
    const parts: string[] = []
    if (e.bats) parts.push(`bats: '${e.bats}'`)
    if (e.throws) parts.push(`throws: '${e.throws}'`)
    if (parts.length === 0) continue
    lines.push(`  '${id}': { ${parts.join(', ')} },`)
  }

  lines.push('}', '', 'export function handednessForPlayerId(id: string): { bats?: Hand; throws?: Hand } | undefined {', '  return HANDEDNESS_OVERRIDES_2026[id]', '}', '')
  fs.writeFileSync(OVERRIDES_PATH, lines.join('\n'), 'utf-8')
}

async function resolvePlayer(record: PlayerRecord): Promise<HandednessEntry | null> {
  if (record.generated) return null
  if (record.name.startsWith('(퓨처스)')) return null

  const hits = await searchKboPlayer(record.name)
  await sleep(DELAY_MS)

  if (hits.length === 0) {
    console.warn(`  ⚠ 검색 결과 없음: ${record.id} (${record.name})`)
    return null
  }

  const match =
    hits.find((h) => teamLabelMatches(record.teamAbbr, h.team)) ??
    (hits.length === 1 ? hits[0] : undefined)

  if (!match) {
    console.warn(
      `  ⚠ 동명이인/팀 불일치: ${record.id} — ${hits.map((h) => `${h.team}:${h.playerId}`).join(', ')}`,
    )
    return null
  }

  const positionLabel = await fetchKboPositionLabel(match.playerId)
  await sleep(DELAY_MS)

  const { bats, throws } = parseKboPositionLabel(positionLabel)
  if (!bats && !throws) {
    console.warn(`  ⚠ 투타 파싱 실패: ${record.id} raw="${positionLabel}"`)
    return null
  }

  return {
    playerId: record.id,
    kboPlayerId: match.playerId,
    name: record.name,
    teamAbbr: record.teamAbbr,
    kboTeam: match.team,
    positionLabel,
    bats,
    throws,
    fetchedAt: new Date().toISOString(),
    source: 'kbo-search',
  }
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const dryRun = args.has('--dry-run')
  const fetchAll = args.has('--all')
  const limitArg = process.argv.find((a) => a.startsWith('--limit='))
  const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined

  const cache = loadCache()
  const records = allRecords()

  let fetched = 0
  let skipped = 0
  let failed = 0

  console.log(`=== KBO 투타 수집 (${records.length}명) ===\n`)

  for (const record of records) {
    if (limit !== undefined && fetched + failed >= limit) break

    const existing = cache[record.id]
    const hasOverride = Boolean(handednessForPlayerId(record.id))
    const hasRecordFields = Boolean(record.bats || record.throws)

    if (!fetchAll && (existing || hasOverride || hasRecordFields)) {
      skipped++
      continue
    }

    if (record.bats || record.throws) {
      cache[record.id] = {
        playerId: record.id,
        kboPlayerId: existing?.kboPlayerId ?? '',
        name: record.name,
        teamAbbr: record.teamAbbr,
        kboTeam: existing?.kboTeam ?? '',
        positionLabel: existing?.positionLabel ?? '',
        bats: record.bats,
        throws: record.throws,
        fetchedAt: new Date().toISOString(),
        source: 'kbo-search',
      }
      skipped++
      continue
    }

    process.stdout.write(`→ ${record.id} ... `)
    try {
      const entry = await resolvePlayer(record)
      if (entry) {
        cache[record.id] = entry
        console.log(`${entry.throws ?? '?'}/${entry.bats ?? '?'} (${entry.positionLabel})`)
        fetched++
      } else {
        console.log('skip')
        failed++
      }
    } catch (err) {
      console.log(`error: ${err instanceof Error ? err.message : err}`)
      failed++
    }
  }

  const withHand = Object.values(cache).filter((e) => e.bats || e.throws).length
  console.log(`\n완료: 신규 ${fetched}, 스킵 ${skipped}, 실패 ${failed}, 캐시 ${withHand}명`)

  if (dryRun) {
    console.log('(dry-run — 파일 미저장)')
    return
  }

  saveCache(cache)
  writeOverrides(cache)
  console.log(`\n저장: ${CACHE_PATH}`)
  console.log(`갱신: ${OVERRIDES_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
