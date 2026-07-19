import { findPlayerInLeague } from '../engine/playerLookup'
import { ipFromOuts } from '../engine/sabermetrics'
import { DAY_LABELS } from '../types/game'
import type { GameResult, Team } from '../types/game'
import { PlayerNameButton } from './PlayerNameButton'
import { GameSituationPanel } from './GameSituationPanel'
import { SortableHeader, sortRows, useTableSort } from './SortableTable'

interface MatchReplayPanelProps {
  result: GameResult
  teams: Team[]
  userTeamId?: string
}

export function MatchReplayPanel({ result, teams, userTeamId }: MatchReplayPanelProps) {
  const batterSort = useTableSort<'name' | 'ab' | 'hits' | 'rbi'>({ key: 'ab', direction: 'desc' })
  const pitcherSort = useTableSort<'name' | 'outs' | 'hits' | 'k' | 'er'>({ key: 'outs', direction: 'desc' })
  const lineSort = useTableSort<string>({ key: 'team', direction: 'asc' })
  const home = teams.find((t) => t.id === result.homeId)
  const away = teams.find((t) => t.id === result.awayId)
  const userWon = userTeamId
    ? (result.homeId === userTeamId ? result.homeScore : result.awayScore) >
      (result.homeId === userTeamId ? result.awayScore : result.homeScore)
    : result.homeScore !== result.awayScore && result.homeScore > result.awayScore
  const batterRows = sortRows(Object.entries(result.boxScore?.batters ?? {}).filter(([, line]) => line.ab > 0 || line.pa > 0), {
    name: ([id]) => findPlayerInLeague(teams, id)?.player.name ?? id,
    ab: ([, line]) => line.ab, hits: ([, line]) => line.hits, rbi: ([, line]) => line.rbi,
  }, batterSort.sort).slice(0, 9)
  const pitcherRows = sortRows(Object.entries(result.boxScore?.pitchers ?? {}).filter(([, line]) => line.bf > 0), {
    name: ([id]) => findPlayerInLeague(teams, id)?.player.name ?? id,
    outs: ([, line]) => line.outs, hits: ([, line]) => line.h, k: ([, line]) => line.k, er: ([, line]) => line.er,
  }, pitcherSort.sort)
  const lineRows = sortRows([
    { team: away?.name ?? '', innings: result.innings.map((i) => i.top), runs: result.awayScore },
    { team: home?.name ?? '', innings: result.innings.map((i) => i.bottom), runs: result.homeScore },
  ], Object.fromEntries([
    ['team', (row: { team: string; innings: (number | null)[]; runs: number }) => row.team],
    ...result.innings.map((_, i) => [String(i), (row: { innings: (number | null)[] }) => row.innings[i]] as const),
    ['runs', (row: { runs: number }) => row.runs],
  ]), lineSort.sort)

  return (
    <div className="space-y-6">
      <div className="bm-card p-6 text-center">
        <div className="mb-2 text-sm text-[var(--text-muted)]">
          {result.week}주차
          {result.day ? ` · ${DAY_LABELS[result.day]}요일` : null}
          {result.parkStadium ? ` · ${result.parkStadium}` : null}
        </div>
        <div className="flex items-center justify-center gap-8">
          <div>
            <div className="text-3xl font-black text-[var(--text-h)]">{result.awayScore}</div>
            <div className="text-sm font-medium text-[var(--text-h)]">
              {away?.name}
            </div>
          </div>
          <div className="text-[var(--text-muted)]">:</div>
          <div>
            <div className="text-3xl font-black text-[var(--text-h)]">{result.homeScore}</div>
            <div className="text-sm font-medium text-[var(--text-h)]">
              {home?.name}
            </div>
          </div>
        </div>
        {userTeamId ? (
          <div className={`mt-3 text-sm font-semibold ${userWon ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
            {userWon ? '승리' : '패배'}
          </div>
        ) : null}
      </div>

      <GameSituationPanel
        situation={result.logs[result.logs.length - 1]?.situationAfter ?? result.logs[0]?.situationBefore}
        currentLog={result.logs[result.logs.length - 1]}
        teams={teams}
      />

      {result.boxScore ? (
        <div className="bm-card p-4">
          <h2 className="mb-3 font-semibold text-[var(--text-h)]">박스스코어</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-[var(--accent)]">타자</h3>
              <table className="bm-table text-sm">
                <thead>
                  <tr>
                    <SortableHeader column="name" sort={batterSort.sort} onSort={batterSort.requestSort}>선수</SortableHeader>
                    <SortableHeader column="ab" sort={batterSort.sort} onSort={batterSort.requestSort}>타수</SortableHeader>
                    <SortableHeader column="hits" sort={batterSort.sort} onSort={batterSort.requestSort}>안타</SortableHeader>
                    <SortableHeader column="rbi" sort={batterSort.sort} onSort={batterSort.requestSort}>타점</SortableHeader>
                  </tr>
                </thead>
                <tbody>
                  {batterRows.map(([id, line]) => {
                      const name = findPlayerInLeague(teams, id)?.player.name ?? id
                      return (
                        <tr key={id}>
                          <td><PlayerNameButton playerId={id} name={name} className="text-sm" /></td>
                          <td>{line.ab}</td>
                          <td>{line.hits}</td>
                          <td>{line.rbi}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-[var(--accent)]">투수</h3>
              <table className="bm-table text-sm">
                <thead>
                  <tr>
                    <SortableHeader column="name" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>선수</SortableHeader>
                    <SortableHeader column="outs" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>이닝</SortableHeader>
                    <SortableHeader column="hits" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>피안타</SortableHeader>
                    <SortableHeader column="k" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>삼진</SortableHeader>
                    <SortableHeader column="er" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>자책</SortableHeader>
                  </tr>
                </thead>
                <tbody>
                  {pitcherRows.map(([id, line]) => {
                      const name = findPlayerInLeague(teams, id)?.player.name ?? id
                      return (
                        <tr key={id}>
                          <td><PlayerNameButton playerId={id} name={name} className="text-sm" /></td>
                          <td>{ipFromOuts(line.outs)}</td>
                          <td>{line.h}</td>
                          <td>{line.k}</td>
                          <td>{line.er}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bm-card overflow-x-auto p-4">
        <h2 className="mb-3 font-semibold text-[var(--text-h)]">이닝별 스코어</h2>
        <table className="text-center text-sm">
          <thead>
            <tr className="text-[var(--text-muted)]">
              <SortableHeader className="px-2" column="team" sort={lineSort.sort} onSort={lineSort.requestSort}>팀</SortableHeader>
              {result.innings.map((_, i) => (
                <SortableHeader key={i} className="px-2" column={String(i)} sort={lineSort.sort} onSort={lineSort.requestSort}>{i + 1}</SortableHeader>
              ))}
              <SortableHeader className="px-2 font-bold" column="runs" sort={lineSort.sort} onSort={lineSort.requestSort}>득</SortableHeader>
            </tr>
          </thead>
          <tbody className="text-[var(--text-h)]">
            {lineRows.map((row) => <tr key={row.team}>
              <td className="px-2 text-left">{row.team}</td>
              {row.innings.map((score, i) => <td key={i} className="px-2">{score ?? '-'}</td>)}
              <td className="px-2 font-bold">{row.runs}</td>
            </tr>)}
          </tbody>
        </table>
      </div>

      {result.logs.length > 0 ? (
        <div className="bm-card max-h-96 overflow-y-auto p-4">
          <h2 className="mb-3 font-semibold text-[var(--text-h)]">플레이-by-플레이</h2>
          <ul className="space-y-1 font-mono text-sm">
            {result.logs.map((log, i) => {
              const batter = log.batterId
                ? findPlayerInLeague(teams, log.batterId)?.player
                : null
              return (
                <li
                  key={i}
                  className={log.runsScored > 0 ? 'text-[var(--accent)]' : 'text-[var(--text)]'}
                >
                  <span className="text-[var(--text-muted)]">
                    {log.inning}회 {log.half === 'top' ? '초' : '말'}
                  </span>
                  {' · '}
                  {log.batterId && batter ? (
                    <>
                      <PlayerNameButton playerId={log.batterId} name={batter.name} className="font-mono" />
                      {log.text.replace(batter.name, '').trim()}
                    </>
                  ) : (
                    log.text
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
