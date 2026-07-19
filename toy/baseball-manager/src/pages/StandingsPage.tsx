import { useState } from 'react'
import { sortedStandings, sortedFarmStandings, teamRecord, teamFarmRecord } from '../engine/schedule'
import { useGame } from '../store/gameStore'
import { SortableHeader, sortRows, useTableSort } from '../components/SortableTable'

type StandingsSortKey = 'rank' | 'team' | 'games' | 'wins' | 'losses' | 'pct' | 'rs' | 'ra' | 'diff'

export function StandingsPage() {
  const { state, userTeam } = useGame()
  const [tab, setTab] = useState<'first' | 'farm'>('first')
  const { sort, requestSort } = useTableSort<StandingsSortKey>({ key: 'rank', direction: 'asc' })

  if (!state || !userTeam) return null

  const standings = tab === 'first' ? sortedStandings(state.teams) : sortedFarmStandings(state.teams)
  const ranked = standings.map((team, index) => ({ team, rank: index + 1 }))
  const rows = sortRows(ranked, {
    rank: (r) => r.rank,
    team: (r) => r.team.name,
    games: (r) => tab === 'first' ? r.team.wins + r.team.losses : r.team.farmWins + r.team.farmLosses,
    wins: (r) => tab === 'first' ? r.team.wins : r.team.farmWins,
    losses: (r) => tab === 'first' ? r.team.losses : r.team.farmLosses,
    pct: (r) => Number((tab === 'first' ? teamRecord(r.team) : teamFarmRecord(r.team)).pct),
    rs: (r) => tab === 'first' ? r.team.runsScored : r.team.farmRunsScored,
    ra: (r) => tab === 'first' ? r.team.runsAllowed : r.team.farmRunsAllowed,
    diff: (r) => (tab === 'first' ? teamRecord(r.team) : teamFarmRecord(r.team)).diff,
  }, sort)

  return (
    <div className="bm-animate-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-h)]">리그 순위</h1>
          <p className="text-sm text-[var(--text-muted)]">{state.currentWeek}주차 · 10개 구단</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`bm-btn text-xs ${tab === 'first' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
            onClick={() => setTab('first')}
          >
            1군
          </button>
          <button
            type="button"
            className={`bm-btn text-xs ${tab === 'farm' ? 'bm-btn-primary' : 'bm-btn-ghost'}`}
            onClick={() => setTab('farm')}
          >
            2군
          </button>
        </div>
      </div>

      <div className="bm-card overflow-x-auto">
        <table className="bm-table">
          <thead>
            <tr>
              <SortableHeader column="rank" sort={sort} onSort={requestSort}>#</SortableHeader>
              <SortableHeader column="team" sort={sort} onSort={requestSort}>팀</SortableHeader>
              <SortableHeader column="games" sort={sort} onSort={requestSort}>경기</SortableHeader>
              <SortableHeader column="wins" sort={sort} onSort={requestSort}>승</SortableHeader>
              <SortableHeader column="losses" sort={sort} onSort={requestSort}>패</SortableHeader>
              <SortableHeader column="pct" sort={sort} onSort={requestSort}>승률</SortableHeader>
              <SortableHeader column="rs" sort={sort} onSort={requestSort}>득</SortableHeader>
              <SortableHeader column="ra" sort={sort} onSort={requestSort}>실</SortableHeader>
              <SortableHeader column="diff" sort={sort} onSort={requestSort}>DIFF</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ team: t, rank }) => {
              const rec = tab === 'first' ? teamRecord(t) : teamFarmRecord(t)
              const wins = tab === 'first' ? t.wins : t.farmWins
              const losses = tab === 'first' ? t.losses : t.farmLosses
              const rs = tab === 'first' ? t.runsScored : t.farmRunsScored
              const ra = tab === 'first' ? t.runsAllowed : t.farmRunsAllowed
              return (
                <tr
                  key={t.id}
                  className={t.id === userTeam.id ? 'bg-[var(--accent-dim)]' : ''}
                >
                  <td>
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </td>
                  <td>
                    <span className="font-medium text-[var(--text-h)]">
                      {t.name}
                    </span>
                  </td>
                  <td>{wins + losses}</td>
                  <td>{wins}</td>
                  <td>{losses}</td>
                  <td>{rec.pct}</td>
                  <td>{rs}</td>
                  <td>{ra}</td>
                  <td className={rec.diff >= 0 ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}>
                    {rec.diff >= 0 ? '+' : ''}{rec.diff}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
