import { calcFip, calcOps, calcWoba, calcWrcPlus, calcXFip, leagueBattingRates, leaguePitchingRates, ipFromOuts } from '../engine/sabermetrics'
import { isBatter, isPitcher } from '../engine/generator'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'

export function StatsPage() {
  const { userTeam, state } = useGame()
  if (!userTeam || !state) return null

  const lgBat = leagueBattingRates(state.teams)
  const lgPit = leaguePitchingRates(state.teams)

  const batters = userTeam.players
    .filter(isBatter)
    .filter((p) => p.seasonStats.type === 'batter' && p.seasonStats.pa > 0)
    .sort((a, b) => {
      const sa = a.seasonStats.type === 'batter' ? a.seasonStats : null
      const sb = b.seasonStats.type === 'batter' ? b.seasonStats : null
      return calcWrcPlus(sb!, lgBat) - calcWrcPlus(sa!, lgBat)
    })

  const pitchers = userTeam.players
    .filter(isPitcher)
    .filter((p) => p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0)
    .sort((a, b) => {
      const sa = a.seasonStats.type === 'pitcher' ? a.seasonStats : null
      const sb = b.seasonStats.type === 'pitcher' ? b.seasonStats : null
      return calcFip(sa!) - calcFip(sb!)
    })

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">팀 스탯 리더</h1>
        <p className="text-sm text-[var(--text-muted)]">
          리그 wOBA {lgBat.lgWoba.toFixed(3)} · 리그 HR/9 {lgPit.lgHr9.toFixed(2)}
        </p>
      </div>

      <div className="bm-card overflow-x-auto p-4">
        <h2 className="mb-3 font-semibold text-[var(--text-h)]">타자 — wRC+ 순</h2>
        <table className="bm-table">
          <thead>
            <tr>
              <th>선수</th>
              <th>Pos</th>
              <th>PA</th>
              <th>wOBA</th>
              <th>wRC+</th>
              <th>OPS</th>
              <th>AVG</th>
              <th>K%</th>
              <th>BB%</th>
              <th>HR</th>
              <th>RBI</th>
            </tr>
          </thead>
          <tbody>
            {batters.length === 0 ? (
              <tr><td colSpan={11} className="text-center text-[var(--text-muted)]">기록 없음</td></tr>
            ) : batters.map((p) => {
              const s = p.seasonStats
              if (s.type !== 'batter') return null
              const woba = calcWoba(s)
              const ops = calcOps(s)
              const wrc = calcWrcPlus(s, lgBat)
              const avg = s.ab > 0 ? (s.hits / s.ab).toFixed(3) : '.000'
              const kPct = s.pa > 0 ? ((s.k / s.pa) * 100).toFixed(1) : '0.0'
              const bbPct = s.pa > 0 ? ((s.bb / s.pa) * 100).toFixed(1) : '0.0'
              return (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td>{POSITION_LABEL[p.role]}</td>
                  <td>{s.pa}</td>
                  <td className="text-[var(--accent)]">{woba.toFixed(3)}</td>
                  <td className="font-bold text-[var(--accent)]">{wrc}</td>
                  <td>{ops.toFixed(3)}</td>
                  <td>{avg}</td>
                  <td>{kPct}%</td>
                  <td>{bbPct}%</td>
                  <td>{s.hr}</td>
                  <td>{s.rbi}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bm-card overflow-x-auto p-4">
        <h2 className="mb-3 font-semibold text-[var(--text-h)]">투수 — FIP 순 (낮을수록 좋음)</h2>
        <table className="bm-table">
          <thead>
            <tr>
              <th>선수</th>
              <th>Pos</th>
              <th>W-L</th>
              <th>IP</th>
              <th>FIP</th>
              <th>xFIP</th>
              <th>ERA</th>
              <th>WHIP</th>
              <th>K/9</th>
              <th>BB/9</th>
              <th>K</th>
            </tr>
          </thead>
          <tbody>
            {pitchers.length === 0 ? (
              <tr><td colSpan={11} className="text-center text-[var(--text-muted)]">기록 없음</td></tr>
            ) : pitchers.map((p) => {
              const s = p.seasonStats
              if (s.type !== 'pitcher') return null
              const ip = ipFromOuts(s.outs)
              const fip = calcFip(s)
              const era = s.outs > 0 ? ((s.er * 9) / (s.outs / 3)).toFixed(2) : '0.00'
              const whip = s.outs > 0 ? ((s.h + s.bb) / (s.outs / 3)).toFixed(2) : '0.00'
              const k9 = s.outs > 0 ? ((s.k * 9) / (s.outs / 3)).toFixed(1) : '0.0'
              const bb9 = s.outs > 0 ? ((s.bb * 9) / (s.outs / 3)).toFixed(1) : '0.0'
              const xfip = calcXFip(s, lgPit)
              return (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td>{POSITION_LABEL[p.role]}</td>
                  <td>{s.wins}-{s.losses}</td>
                  <td>{ip}</td>
                  <td className="text-[var(--accent)]">{fip.toFixed(2)}</td>
                  <td>{xfip.toFixed(2)}</td>
                  <td>{era}</td>
                  <td>{whip}</td>
                  <td>{k9}</td>
                  <td>{bb9}</td>
                  <td>{s.k}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
