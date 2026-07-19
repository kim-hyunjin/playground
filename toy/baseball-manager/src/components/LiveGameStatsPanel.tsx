import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { pitchCountForOutcome } from '../engine/livePitch'
import { findPlayerInLeague } from '../engine/playerLookup'
import type { PlayLog, Team } from '../types/game'
import { PlayerNameButton } from './PlayerNameButton'
import { SortableHeader, sortRows, useTableSort, type SortValue } from './SortableTable'

interface Props {
  logs: PlayLog[]
  teams: Team[]
  currentPitcherId?: string
  currentPitchCount?: number
}

interface BatterLine { pa: number; ab: number; h: number; hr: number; bb: number; k: number; rbi: number }
interface PitcherLine { pitches: number; batters: number; hits: number; walks: number; strikeouts: number; runs: number }

export function LiveGameStatsPanel({ logs, teams, currentPitcherId, currentPitchCount = 0 }: Props) {
  const stats = useMemo(() => {
    const batters = new Map<string, BatterLine>()
    const pitchers = new Map<string, PitcherLine>()
    for (const log of logs) {
      if ((log.eventType ?? 'plateAppearance') !== 'plateAppearance' || !log.outcome) continue
      if (log.batterId) {
        const line = batters.get(log.batterId) ?? { pa: 0, ab: 0, h: 0, hr: 0, bb: 0, k: 0, rbi: 0 }
        line.pa++
        if (log.outcome !== 'walk' && log.outcome !== 'sacrifice') line.ab++
        if (['single', 'double', 'triple', 'homerun'].includes(log.outcome)) line.h++
        if (log.outcome === 'homerun') line.hr++
        if (log.outcome === 'walk') line.bb++
        if (log.outcome === 'strikeout') line.k++
        line.rbi += log.rbi ?? 0
        batters.set(log.batterId, line)
      }
      if (log.pitcherId) {
        const line = pitchers.get(log.pitcherId) ?? { pitches: 0, batters: 0, hits: 0, walks: 0, strikeouts: 0, runs: 0 }
        line.pitches += pitchCountForOutcome(log.outcome)
        line.batters++
        if (['single', 'double', 'triple', 'homerun'].includes(log.outcome)) line.hits++
        if (log.outcome === 'walk') line.walks++
        if (log.outcome === 'strikeout') line.strikeouts++
        line.runs += log.runsScored
        pitchers.set(log.pitcherId, line)
      }
    }
    if (currentPitcherId && currentPitchCount > 0) {
      const line = pitchers.get(currentPitcherId) ?? { pitches: 0, batters: 0, hits: 0, walks: 0, strikeouts: 0, runs: 0 }
      line.pitches += currentPitchCount
      pitchers.set(currentPitcherId, line)
    }
    return { batters: [...batters.entries()], pitchers: [...pitchers.entries()] }
  }, [currentPitchCount, currentPitcherId, logs])

  const name = (id: string) => findPlayerInLeague(teams, id)?.player.name ?? id

  return (
    <section className="bm-card p-3" aria-labelledby="live-stats-title">
      <div className="mb-2 flex items-baseline gap-2">
        <h2 id="live-stats-title" className="text-sm font-semibold text-[var(--text-h)]">라이브 경기 기록</h2>
        <span className="text-xs text-[var(--text-muted)]">현재까지 공개된 기록</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <StatTable title="투수" headers={['선수', '투구', '타자', '피안타', '볼넷', '삼진', '실점']} rows={stats.pitchers.map(([id, line]) => ({ cells: [<PlayerNameButton key={id} playerId={id} name={name(id)} />, line.pitches, line.batters, line.hits, line.walks, line.strikeouts, line.runs], values: [name(id), line.pitches, line.batters, line.hits, line.walks, line.strikeouts, line.runs] }))} />
        <StatTable title="타자" headers={['선수', '타석', '타수', '안타', '홈런', '볼넷', '삼진', '타점']} rows={stats.batters.map(([id, line]) => ({ cells: [<PlayerNameButton key={id} playerId={id} name={name(id)} />, line.pa, line.ab, line.h, line.hr, line.bb, line.k, line.rbi], values: [name(id), line.pa, line.ab, line.h, line.hr, line.bb, line.k, line.rbi] }))} />
      </div>
    </section>
  )
}

function StatTable({ title, headers, rows }: { title: string; headers: string[]; rows: { cells: ReactNode[]; values: SortValue[] }[] }) {
  const tableSort = useTableSort<string>()
  const accessors = Object.fromEntries(headers.map((_, index) => [String(index), (row: { values: SortValue[] }) => row.values[index]]))
  const sortedRows = sortRows(rows, accessors, tableSort.sort)
  return <div className="min-w-0"><h3 className="mb-1 text-xs font-semibold text-[var(--accent)]">{title}</h3><div className="max-h-32 overflow-auto"><table className="bm-table whitespace-nowrap text-xs"><thead className="sticky top-0 bg-[var(--panel)]"><tr>{headers.map((header, index) => <SortableHeader key={header} column={String(index)} sort={tableSort.sort} onSort={tableSort.requestSort}>{header}</SortableHeader>)}</tr></thead><tbody>{sortedRows.length > 0 ? sortedRows.map((row, index) => <tr key={index}>{row.cells.map((cell, cellIndex) => <td key={cellIndex} className="tabular-nums">{cell}</td>)}</tr>) : <tr><td colSpan={headers.length} className="text-center text-[var(--text-muted)]">기록 없음</td></tr>}</tbody></table></div></div>
}
