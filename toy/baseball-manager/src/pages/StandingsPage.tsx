import { useState } from 'react'
import { sortedStandings, sortedFarmStandings, teamRecord, teamFarmRecord } from '../engine/schedule'
import { useGame } from '../store/gameStore'

export function StandingsPage() {
  const { state, userTeam } = useGame()
  const [tab, setTab] = useState<'first' | 'farm'>('first')

  if (!state || !userTeam) return null

  const standings = tab === 'first' ? sortedStandings(state.teams) : sortedFarmStandings(state.teams)

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
              <th>#</th>
              <th>팀</th>
              <th>경기</th>
              <th>승</th>
              <th>패</th>
              <th>승률</th>
              <th>득</th>
              <th>실</th>
              <th>DIFF</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((t, i) => {
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
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </td>
                  <td>
                    <span className="font-medium" style={{ color: t.color }}>
                      {t.city} {t.name}
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
