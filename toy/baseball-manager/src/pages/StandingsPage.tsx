import { sortedStandings, teamRecord } from '../engine/schedule'
import { useGame } from '../store/gameStore'

export function StandingsPage() {
  const { state, userTeam } = useGame()
  if (!state || !userTeam) return null

  const standings = sortedStandings(state.teams)

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">리그 순위</h1>
        <p className="text-sm text-[var(--text-muted)]">{state.currentWeek}주차 · 10개 구단</p>
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
              const rec = teamRecord(t)
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
                  <td>{t.wins + t.losses}</td>
                  <td>{t.wins}</td>
                  <td>{t.losses}</td>
                  <td>{rec.pct}</td>
                  <td>{t.runsScored}</td>
                  <td>{t.runsAllowed}</td>
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
