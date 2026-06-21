/**
 * 1군 로스터 선수별 KBO 검색 매칭 상태를 점검합니다.
 *   npm run kbo:audit-match
 */
import { ROSTERS_KBO } from '../src/data/rosters/2026/kbo/index'
import type { PlayerRecord } from '../src/data/types'
import { searchKboPlayer, sleep, type KboSearchHit } from './kbo/kboClient'
import {
  KBO_PLAYER_OVERRIDES,
  KBO_SEARCH_ALIASES,
  isActiveKboTeam,
} from './kbo/kboPlayerOverrides'
import { abbrFromKboTeam } from './kbo/kboTeamAbbr'
import { teamLabelMatches } from './kbo/teamLabels'

const DELAY_MS = 300

function searchNames(name: string): string[] {
  return [...new Set([name, ...(KBO_SEARCH_ALIASES[name] ?? [])])]
}

async function searchAllNames(name: string): Promise<KboSearchHit[]> {
  const byId = new Map<string, KboSearchHit>()
  for (const q of searchNames(name)) {
    for (const hit of await searchKboPlayer(q)) {
      if (isActiveKboTeam(hit.team)) byId.set(hit.playerId, hit)
    }
    await sleep(DELAY_MS)
  }
  return [...byId.values()]
}

function pickSearchHit(record: PlayerRecord, hits: KboSearchHit[]): KboSearchHit | undefined {
  const teamHits = hits.filter((h) => teamLabelMatches(record.teamAbbr, h.team))
  if (teamHits.length === 1) return teamHits[0]

  if (teamHits.length > 1) {
    const wantPitcher = record.role === 'SP' || record.role === 'RP'
    const roleHits = teamHits.filter((h) => wantPitcher === h.role.includes('투수'))
    return roleHits[0] ?? teamHits[0]
  }

  if (hits.length === 1) return hits[0]
  return undefined
}

async function main() {
  const failures: {
    id: string
    name: string
    team: string
    reason: string
    candidates: string
  }[] = []

  let ok = 0

  for (const file of ROSTERS_KBO) {
    for (const p of file.first) {
      const overrideId = KBO_PLAYER_OVERRIDES[p.id]
      let teamHit: KboSearchHit | undefined
      let hits: KboSearchHit[] = []

      if (overrideId) {
        teamHit = {
          playerId: overrideId,
          name: p.name,
          team: p.teamAbbr,
          role: p.role === 'SP' || p.role === 'RP' ? '투수' : '내야수',
        }
        hits = [teamHit]
      } else {
        hits = await searchAllNames(p.name)
        teamHit = pickSearchHit(p, hits)
      }

      const cand = hits.map((h) => `${h.team}:${h.playerId}:${h.role}`).join(' | ') || '(none)'

      if (!overrideId && hits.length === 0) {
        failures.push({ id: p.id, name: p.name, team: p.teamAbbr, reason: 'no-results', candidates: cand })
      } else if (!teamHit) {
        failures.push({
          id: p.id,
          name: p.name,
          team: p.teamAbbr,
          reason: hits.length === 1 ? 'wrong-team-single' : 'homonym',
          candidates: cand,
        })
      } else {
        const abbr = abbrFromKboTeam(teamHit.team)
        if (abbr && abbr !== p.teamAbbr) {
          failures.push({
            id: p.id,
            name: p.name,
            team: p.teamAbbr,
            reason: 'abbr-mismatch',
            candidates: cand,
          })
        } else {
          ok++
        }
      }
    }
  }

  console.log(`OK: ${ok}, FAIL: ${failures.length}\n`)
  for (const f of failures) {
    console.log(`${f.id}\t${f.reason}\t${f.candidates}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
