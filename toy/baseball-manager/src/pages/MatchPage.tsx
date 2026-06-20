import { useEffect, useRef, useState } from 'react'
import { findPlayerInLeague } from '../engine/playerLookup'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { useGame } from '../store/gameStore'

export function MatchPage() {
  const { state, userTeam, upcomingGame, lastResult, playUserGame, clearLastResult, advanceWeek, setView } = useGame()
  const [visibleLogs, setVisibleLogs] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<number | null>(null)

  const result = lastResult
  const opponent = result
    ? state?.teams.find((t) => t.id === (result.homeId === userTeam?.id ? result.awayId : result.homeId))
    : upcomingGame
      ? state?.teams.find((t) => t.id === (upcomingGame.homeId === userTeam?.id ? upcomingGame.awayId : upcomingGame.homeId))
      : null

  useEffect(() => {
    if (!result || !playing) return
    setVisibleLogs(0)
    let i = 0
    timerRef.current = window.setInterval(() => {
      i++
      setVisibleLogs(i)
      if (i >= result.logs.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        setPlaying(false)
      }
    }, 120)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [result, playing])

  if (!state || !userTeam) return null

  const handlePlay = () => {
    const r = playUserGame()
    if (r) {
      setPlaying(true)
      setVisibleLogs(0)
    }
  }

  const userWon = result
    ? (result.homeId === userTeam.id ? result.homeScore : result.awayScore) >
      (result.homeId === userTeam.id ? result.awayScore : result.homeScore)
    : false

  const userScore = result
    ? result.homeId === userTeam.id ? result.homeScore : result.awayScore
    : 0
  const oppScore = result
    ? result.homeId === userTeam.id ? result.awayScore : result.homeScore
    : 0

  const homeTeam = upcomingGame
    ? state.teams.find((t) => t.id === upcomingGame.homeId)
    : null

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">경기</h1>
        <p className="text-sm text-[var(--text-muted)]">{state.currentWeek}주차</p>
      </div>

      {!result && upcomingGame && opponent && (
        <div className="bm-card p-6 text-center">
          <div className="mb-4 text-sm text-[var(--text-muted)]">
            {upcomingGame.homeId === userTeam.id ? '홈 경기' : '원정 경기'}
            {homeTeam ? ` · ${homeTeam.stadium}` : null}
          </div>
          <div className="flex items-center justify-center gap-6">
            <div>
              <div className="text-xl font-bold" style={{ color: userTeam.color }}>
                {userTeam.city}
              </div>
              <div className="text-[var(--text-h)]">{userTeam.name}</div>
            </div>
            <div className="text-2xl font-black text-[var(--text-muted)]">VS</div>
            <div>
              <div className="text-xl font-bold" style={{ color: opponent.color }}>
                {opponent.city}
              </div>
              <div className="text-[var(--text-h)]">{opponent.name}</div>
            </div>
          </div>
          <button type="button" className="bm-btn bm-btn-primary mt-6 px-8" onClick={handlePlay}>
            경기 시뮬레이션 시작
          </button>
        </div>
      )}

      {!result && !upcomingGame && (
        <div className="bm-card p-6 text-center">
          <p className="text-[var(--text-muted)]">이번 주 예정된 경기가 없습니다.</p>
          <button type="button" className="bm-btn bm-btn-primary mt-4" onClick={advanceWeek}>
            다음 주 진행
          </button>
        </div>
      )}

      {result && opponent && (
        <>
          <div className={`bm-card p-6 text-center ${userWon ? 'border-emerald-500/50' : 'border-red-500/30'}`}>
            <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {playing ? '경기 진행 중...' : userWon ? '승리!' : '패배'}
            </div>
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className="text-4xl font-black text-[var(--text-h)]">{userScore}</div>
                <div className="text-sm" style={{ color: userTeam.color }}>{userTeam.abbr}</div>
              </div>
              <div className="text-[var(--text-muted)]">:</div>
              <div>
                <div className="text-4xl font-black text-[var(--text-h)]">{oppScore}</div>
                <div className="text-sm" style={{ color: opponent.color }}>{opponent.abbr}</div>
              </div>
            </div>

            {!playing && (
              <div className="mt-4 flex justify-center gap-2">
                <button type="button" className="bm-btn bm-btn-ghost" onClick={() => { clearLastResult(); setView('dashboard') }}>
                  대시보드
                </button>
                <button type="button" className="bm-btn bm-btn-primary" onClick={() => { clearLastResult(); advanceWeek() }}>
                  다음 주
                </button>
              </div>
            )}
          </div>

          <div className="bm-card max-h-96 overflow-y-auto p-4">
            <h2 className="mb-3 font-semibold text-[var(--text-h)]">플레이-by-플레이</h2>
            <ul className="space-y-1 font-mono text-sm">
              {result.logs.slice(0, visibleLogs || result.logs.length).map((log, i) => {
                const batter = log.batterId
                  ? findPlayerInLeague(state.teams, log.batterId)?.player
                  : null
                const runsSuffix = log.runsScored > 0 ? ` (${log.runsScored}득점)` : ''

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
                        {runsSuffix}
                      </>
                    ) : (
                      log.text
                    )}
                    {log.pitcherId ? (
                      <span className="ml-2 text-xs text-[var(--text-muted)]">
                        (투: <PlayerNameButton playerId={log.pitcherId} className="text-xs font-normal" />)
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="bm-card overflow-x-auto p-4">
            <h2 className="mb-3 font-semibold text-[var(--text-h)]">이닝별 스코어</h2>
            <table className="text-center text-sm">
              <thead>
                <tr className="text-[var(--text-muted)]">
                  <th className="px-2">팀</th>
                  {result.innings.map((_, i) => (
                    <th key={i} className="px-2">{i + 1}</th>
                  ))}
                  <th className="px-2 font-bold">R</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-h)]">
                <tr>
                  <td className="px-2 text-left">{state.teams.find((t) => t.id === result.awayId)?.abbr}</td>
                  {result.innings.map((inn, i) => (
                    <td key={i} className="px-2">{inn.top ?? '-'}</td>
                  ))}
                  <td className="px-2 font-bold">{result.awayScore}</td>
                </tr>
                <tr>
                  <td className="px-2 text-left">{state.teams.find((t) => t.id === result.homeId)?.abbr}</td>
                  {result.innings.map((inn, i) => (
                    <td key={i} className="px-2">{inn.bottom ?? '-'}</td>
                  ))}
                  <td className="px-2 font-bold">{result.homeScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
