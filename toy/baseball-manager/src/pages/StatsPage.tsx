import { calcFip, calcOps, calcWoba, calcWrcPlus, calcXFip, leagueBattingRates, leaguePitchingRates, ipFromOuts } from '../engine/sabermetrics'
import { isBatter, isPitcher } from '../engine/generator'
import { firstTeamPlayers } from '../engine/roster'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { useGame } from '../store/gameStore'
import { POSITION_LABEL } from '../types/game'
import { SortableHeader, sortRows, useTableSort } from '../components/SortableTable'

type BatterSortKey = 'name' | 'pos' | 'pa' | 'woba' | 'wrc' | 'ops' | 'avg' | 'kpct' | 'bbpct' | 'hr' | 'sb' | 'rbi'
type PitcherSortKey = 'name' | 'pos' | 'wl' | 'ip' | 'fip' | 'xfip' | 'era' | 'whip' | 'k9' | 'bb9' | 'sv' | 'k'

export function StatsPage() {
  const { userTeam, state } = useGame()
  const batterSort = useTableSort<BatterSortKey>({ key: 'wrc', direction: 'desc' })
  const pitcherSort = useTableSort<PitcherSortKey>({ key: 'fip', direction: 'asc' })
  if (!userTeam || !state) return null

  const lgBat = leagueBattingRates(state.teams)
  const lgPit = leaguePitchingRates(state.teams)

  const batterRows = firstTeamPlayers(userTeam)
    .filter(isBatter)
    .filter((p) => p.seasonStats.type === 'batter' && p.seasonStats.pa > 0)
    .sort((a, b) => {
      const sa = a.seasonStats.type === 'batter' ? a.seasonStats : null
      const sb = b.seasonStats.type === 'batter' ? b.seasonStats : null
      return calcWrcPlus(sb!, lgBat) - calcWrcPlus(sa!, lgBat)
    })

  const pitcherRows = firstTeamPlayers(userTeam)
    .filter(isPitcher)
    .filter((p) => p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0)
    .sort((a, b) => {
      const sa = a.seasonStats.type === 'pitcher' ? a.seasonStats : null
      const sb = b.seasonStats.type === 'pitcher' ? b.seasonStats : null
      return calcFip(sa!) - calcFip(sb!)
    })
  const batters = sortRows(batterRows, {
    name: (p) => p.name, pos: (p) => POSITION_LABEL[p.role],
    pa: (p) => p.seasonStats.type === 'batter' ? p.seasonStats.pa : null,
    woba: (p) => p.seasonStats.type === 'batter' ? calcWoba(p.seasonStats) : null,
    wrc: (p) => p.seasonStats.type === 'batter' ? calcWrcPlus(p.seasonStats, lgBat) : null,
    ops: (p) => p.seasonStats.type === 'batter' ? calcOps(p.seasonStats) : null,
    avg: (p) => p.seasonStats.type === 'batter' && p.seasonStats.ab > 0 ? p.seasonStats.hits / p.seasonStats.ab : null,
    kpct: (p) => p.seasonStats.type === 'batter' && p.seasonStats.pa > 0 ? p.seasonStats.k / p.seasonStats.pa : null,
    bbpct: (p) => p.seasonStats.type === 'batter' && p.seasonStats.pa > 0 ? p.seasonStats.bb / p.seasonStats.pa : null,
    hr: (p) => p.seasonStats.type === 'batter' ? p.seasonStats.hr : null,
    sb: (p) => p.seasonStats.type === 'batter' ? p.seasonStats.sb : null,
    rbi: (p) => p.seasonStats.type === 'batter' ? p.seasonStats.rbi : null,
  }, batterSort.sort)
  const pitchers = sortRows(pitcherRows, {
    name: (p) => p.name, pos: (p) => POSITION_LABEL[p.role],
    wl: (p) => p.seasonStats.type === 'pitcher' ? p.seasonStats.wins * 10000 - p.seasonStats.losses : null,
    ip: (p) => p.seasonStats.type === 'pitcher' ? p.seasonStats.outs : null,
    fip: (p) => p.seasonStats.type === 'pitcher' ? calcFip(p.seasonStats) : null,
    xfip: (p) => p.seasonStats.type === 'pitcher' ? calcXFip(p.seasonStats, lgPit) : null,
    era: (p) => p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0 ? p.seasonStats.er * 27 / p.seasonStats.outs : null,
    whip: (p) => p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0 ? (p.seasonStats.h + p.seasonStats.bb) * 3 / p.seasonStats.outs : null,
    k9: (p) => p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0 ? p.seasonStats.k * 27 / p.seasonStats.outs : null,
    bb9: (p) => p.seasonStats.type === 'pitcher' && p.seasonStats.outs > 0 ? p.seasonStats.bb * 27 / p.seasonStats.outs : null,
    sv: (p) => p.seasonStats.type === 'pitcher' ? p.seasonStats.saves : null,
    k: (p) => p.seasonStats.type === 'pitcher' ? p.seasonStats.k : null,
  }, pitcherSort.sort)

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
              {([['name','선수'],['pos','Pos'],['pa','PA'],['woba','wOBA'],['wrc','wRC+'],['ops','OPS'],['avg','AVG'],['kpct','K%'],['bbpct','BB%'],['hr','HR'],['sb','SB'],['rbi','RBI']] as const).map(([key, label]) => <SortableHeader key={key} column={key} sort={batterSort.sort} onSort={batterSort.requestSort}>{label}</SortableHeader>)}
            </tr>
          </thead>
          <tbody>
            {batters.length === 0 ? (
              <tr><td colSpan={12} className="text-center text-[var(--text-muted)]">기록 없음</td></tr>
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
                  <td><PlayerNameButton playerId={p.id} name={p.name} /></td>
                  <td>{POSITION_LABEL[p.role]}</td>
                  <td>{s.pa}</td>
                  <td className="text-[var(--accent)]">{woba.toFixed(3)}</td>
                  <td className="font-bold text-[var(--accent)]">{wrc}</td>
                  <td>{ops.toFixed(3)}</td>
                  <td>{avg}</td>
                  <td>{kPct}%</td>
                  <td>{bbPct}%</td>
                  <td>{s.hr}</td>
                  <td>{s.sb}</td>
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
              {([['name','선수'],['pos','Pos'],['wl','W-L'],['ip','IP'],['fip','FIP'],['xfip','xFIP'],['era','ERA'],['whip','WHIP'],['k9','K/9'],['bb9','BB/9'],['sv','SV'],['k','K']] as const).map(([key, label]) => <SortableHeader key={key} column={key} sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>{label}</SortableHeader>)}
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
                  <td><PlayerNameButton playerId={p.id} name={p.name} /></td>
                  <td>{POSITION_LABEL[p.role]}</td>
                  <td>{s.wins}-{s.losses}</td>
                  <td>{ip}</td>
                  <td className="text-[var(--accent)]">{fip.toFixed(2)}</td>
                  <td>{xfip.toFixed(2)}</td>
                  <td>{era}</td>
                  <td>{whip}</td>
                  <td>{k9}</td>
                  <td>{bb9}</td>
                  <td>{s.saves}</td>
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
