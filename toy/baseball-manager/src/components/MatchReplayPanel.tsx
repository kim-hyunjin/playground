import { findPlayerInLeague } from '../engine/playerLookup'
import { ipFromOuts } from '../engine/sabermetrics'
import { DAY_LABELS } from '../types/game'
import type { GameResult, Team } from '../types/game'
import { PlayerNameButton } from './PlayerNameButton'
import { GameSituationPanel } from './GameSituationPanel'

interface MatchReplayPanelProps {
  result: GameResult
  teams: Team[]
  userTeamId?: string
}

export function MatchReplayPanel({ result, teams, userTeamId }: MatchReplayPanelProps) {
  const home = teams.find((t) => t.id === result.homeId)
  const away = teams.find((t) => t.id === result.awayId)
  const userWon = userTeamId
    ? (result.homeId === userTeamId ? result.homeScore : result.awayScore) >
      (result.homeId === userTeamId ? result.awayScore : result.homeScore)
    : result.homeScore !== result.awayScore && result.homeScore > result.awayScore

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
            <div className="text-sm font-medium" style={{ color: away?.color }}>
              {away?.name}
            </div>
          </div>
          <div className="text-[var(--text-muted)]">:</div>
          <div>
            <div className="text-3xl font-black text-[var(--text-h)]">{result.homeScore}</div>
            <div className="text-sm font-medium" style={{ color: home?.color }}>
              {home?.name}
            </div>
          </div>
        </div>
        {userTeamId ? (
          <div className={`mt-3 text-sm font-semibold ${userWon ? 'text-emerald-400' : 'text-red-400'}`}>
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
                    <th>선수</th>
                    <th>타수</th>
                    <th>안타</th>
                    <th>타점</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.boxScore.batters)
                    .filter(([, line]) => line.ab > 0 || line.pa > 0)
                    .sort((a, b) => b[1].pa - a[1].pa)
                    .slice(0, 9)
                    .map(([id, line]) => {
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
                    <th>선수</th>
                    <th>이닝</th>
                    <th>피안타</th>
                    <th>삼진</th>
                    <th>자책</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.boxScore.pitchers)
                    .filter(([, line]) => line.bf > 0)
                    .sort((a, b) => b[1].outs - a[1].outs)
                    .map(([id, line]) => {
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
              <th className="px-2">팀</th>
              {result.innings.map((_, i) => (
                <th key={i} className="px-2">{i + 1}</th>
              ))}
              <th className="px-2 font-bold">득</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-h)]">
            <tr>
              <td className="px-2 text-left">{away?.name}</td>
              {result.innings.map((inn, i) => (
                <td key={i} className="px-2">{inn.top ?? '-'}</td>
              ))}
              <td className="px-2 font-bold">{result.awayScore}</td>
            </tr>
            <tr>
              <td className="px-2 text-left">{home?.name}</td>
              {result.innings.map((inn, i) => (
                <td key={i} className="px-2">{inn.bottom ?? '-'}</td>
              ))}
              <td className="px-2 font-bold">{result.homeScore}</td>
            </tr>
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
