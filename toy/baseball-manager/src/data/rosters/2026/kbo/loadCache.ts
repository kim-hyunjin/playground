import type { TeamRosterFile } from '../../../types'
import { ROSTERS_KBO } from './index'

function useKboSource(): boolean {
  if (import.meta.env?.VITE_ROSTER_SOURCE === 'kbo') return true
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } }
  return g.process?.env?.VITE_ROSTER_SOURCE === 'kbo'
}

/** VITE_ROSTER_SOURCE=kbo 일 때 sync된 JSON 로스터 */
export function loadKboRosterCache(): TeamRosterFile[] | null {
  if (!useKboSource()) return null
  if (ROSTERS_KBO.length === 0) return null
  return ROSTERS_KBO
}

export function activeRosterSource(): TeamRosterFile[] {
  return loadKboRosterCache() ?? []
}

export function rosterSourceLabel(): 'kbo' | 'static-ts' {
  return loadKboRosterCache() ? 'kbo' : 'static-ts'
}
