import { useEffect, useMemo, useRef, useState } from 'react'
import { computeScoreThroughLogs, currentInningLabel } from '../engine/liveScore'
import { findPlayerInLeague } from '../engine/playerLookup'
import { ipFromOuts } from '../engine/sabermetrics'
import { DAY_LABELS } from '../types/game'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { GameSituationPanel } from '../components/GameSituationPanel'
import { GameManagementPanel } from '../components/GameManagementPanel'
import { ManagerTacticsPanel } from '../components/ManagerTacticsPanel'
import { useGame } from '../store/gameStore'

export function MatchPage() {
  const {
    state,
    userTeam,
    upcomingGame,
    lastResult,
    activeGameSession,
    advanceActiveGame,
    pauseActiveGame,
    resumeActiveGame,
    playUserGame,
    clearLastResult,
    advanceWeek,
    setView,
  } = useGame()
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const timerRef = useRef<number | null>(null)
  const result = lastResult
  const playing = activeGameSession?.status === 'playing'
  const sessionInProgress = Boolean(activeGameSession && activeGameSession.status !== 'complete')
  const gameFinished = !playing && !sessionInProgress
  const replayCursor = sessionInProgress ? activeGameSession!.cursor : result?.logs.length ?? 0

  const opponent = result
    ? state?.teams.find((t) => t.id === (result.homeId === userTeam?.id ? result.awayId : result.homeId))
    : upcomingGame
      ? state?.teams.find((t) => t.id === (upcomingGame.homeId === userTeam?.id ? upcomingGame.awayId : upcomingGame.homeId))
      : null

  const liveScore = useMemo(() => {
    if (!result) return null
    if (!playing && !sessionInProgress) {
      return {
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        innings: result.innings,
      }
    }
    return computeScoreThroughLogs(result.logs, replayCursor)
  }, [result, playing, replayCursor, sessionInProgress])

  useEffect(() => {
    if (!result || !playing || !sessionInProgress) return
    timerRef.current = window.setTimeout(() => {
      advanceActiveGame()
    }, 1500 / playbackSpeed)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [result, playing, sessionInProgress, activeGameSession?.cursor, advanceActiveGame, playbackSpeed])

  if (!state || !userTeam) return null

  const handlePlay = () => {
    const r = playUserGame()
    if (!r) return
  }

  const togglePlaying = () => {
    if (playing) {
      pauseActiveGame()
    } else {
      resumeActiveGame()
    }
  }

  const advanceOnce = () => {
    advanceActiveGame(true)
  }

  const isHome = result ? result.homeId === userTeam.id : upcomingGame?.homeId === userTeam.id

  const homeScore = liveScore?.homeScore ?? 0
  const awayScore = liveScore?.awayScore ?? 0
  const userScore = isHome ? homeScore : awayScore
  const oppScore = isHome ? awayScore : homeScore

  const userWon = result && gameFinished
    ? userScore > oppScore
    : false

  const homeTeam = upcomingGame
    ? state.teams.find((t) => t.id === upcomingGame.homeId)
    : result
      ? state.teams.find((t) => t.id === result.homeId)
      : null

  const awayTeam = result
    ? state.teams.find((t) => t.id === result.awayId)
    : upcomingGame
      ? state.teams.find((t) => t.id === upcomingGame.awayId)
      : null

  const displayInnings = liveScore?.innings ?? []
  const maxInningCols = result
    ? Math.max(result.innings.length, displayInnings.length, 9)
    : 9

  const hasMoreGamesThisWeek = Boolean(upcomingGame && result && gameFinished)
  const currentSituation = result
    ? (sessionInProgress ? result.logs[replayCursor]?.situationBefore : undefined)
      ?? result.logs[Math.max(0, (sessionInProgress || playing ? replayCursor : result.logs.length) - 1)]?.situationAfter
      ?? result.logs[0]?.situationBefore
    : undefined
  const shownLogCount = sessionInProgress || playing ? replayCursor : result?.logs.length ?? 0
  const currentLog = shownLogCount > 0 ? result?.logs[shownLogCount - 1] : undefined

  return (
    <div className="bm-animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-h)]">경기</h1>
        <p className="text-sm text-[var(--text-muted)]">
          {state.currentWeek}주차
          {upcomingGame?.day ? ` · ${DAY_LABELS[upcomingGame.day]}요일` : null}
          {result?.day && !upcomingGame ? ` · ${DAY_LABELS[result.day]}요일` : null}
        </p>
      </div>

      {!result && upcomingGame && opponent && (
        <><ManagerTacticsPanel /><div className="bm-card p-6 text-center">
          <div className="mb-4 text-sm text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--accent)]">{DAY_LABELS[upcomingGame.day]}요일</span>
            {' · '}
            {upcomingGame.homeId === userTeam.id ? '홈 경기' : '원정 경기'}
            {homeTeam ? ` · ${homeTeam.stadium}` : null}
          </div>
          <div className="flex items-center justify-center gap-6">
            <div>
              <div className="text-xl font-bold" style={{ color: userTeam.color }}>
                {userTeam.name}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{userTeam.city}</div>
            </div>
            <div className="text-2xl font-black text-[var(--text-muted)]">VS</div>
            <div>
              <div className="text-xl font-bold" style={{ color: opponent.color }}>
                {opponent.name}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{opponent.city}</div>
            </div>
          </div>
          <button type="button" className="bm-btn bm-btn-primary mt-6 px-8" onClick={handlePlay}>
            경기 시작
          </button>
        </div></>
      )}

      {!result && !upcomingGame && (
        <div className="bm-card p-6 text-center">
          <p className="text-[var(--text-muted)]">이번 주 경기를 모두 치렀습니다.</p>
          <button type="button" className="bm-btn bm-btn-primary mt-4" onClick={advanceWeek}>
            다음 주 진행
          </button>
        </div>
      )}

      {result && opponent && liveScore && (
        <>
          <div className={`bm-card p-6 text-center ${gameFinished && userWon ? 'border-emerald-500/50' : gameFinished ? 'border-red-500/30' : ''}`}>
            <div className="mb-2 text-sm font-semibold tracking-wider text-[var(--text-muted)]">
              {playing || sessionInProgress
                ? currentInningLabel(result.logs, replayCursor)
                : userWon
                  ? '승리!'
                  : '패배'}
            </div>
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className="text-4xl font-black text-[var(--text-h)] tabular-nums">{userScore}</div>
                <div className="text-sm font-medium" style={{ color: userTeam.color }}>{userTeam.name}</div>
              </div>
              <div className="text-[var(--text-muted)]">:</div>
              <div>
                <div className="text-4xl font-black text-[var(--text-h)] tabular-nums">{oppScore}</div>
                <div className="text-sm font-medium" style={{ color: opponent.color }}>{opponent.name}</div>
              </div>
            </div>

            {gameFinished && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {hasMoreGamesThisWeek ? (
                  <button
                    type="button"
                    className="bm-btn bm-btn-primary"
                    onClick={() => clearLastResult()}
                  >
                    다음 경기
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bm-btn bm-btn-primary"
                    onClick={() => { clearLastResult(); advanceWeek() }}
                  >
                    다음 주 진행
                  </button>
                )}
                <button type="button" className="bm-btn bm-btn-ghost" onClick={() => setView('schedule')}>
                  일정 · 기록
                </button>
                <button type="button" className="bm-btn bm-btn-ghost" onClick={() => { clearLastResult(); setView('dashboard') }}>
                  대시보드
                </button>
              </div>
            )}
          </div>

          <GameSituationPanel situation={currentSituation} currentLog={currentLog} teams={state.teams} />

          {sessionInProgress ? <ManagerTacticsPanel /> : null}

          <div className="flex flex-wrap items-center justify-center gap-2" aria-label="경기 재생 설정">
            <span className="text-xs text-[var(--text-muted)]">재생 속도</span>
            {[0.5, 1, 2].map((speed) => <button key={speed} type="button" className={`bm-btn py-1 text-xs ${playbackSpeed === speed ? 'bm-btn-primary' : 'bm-btn-ghost'}`} onClick={() => setPlaybackSpeed(speed)}>{speed}×</button>)}
            {sessionInProgress ? <button type="button" className="bm-btn bm-btn-ghost py-1 text-xs" onClick={advanceOnce}>다음 타석</button> : null}
          </div>

          <GameManagementPanel />

          {activeGameSession && activeGameSession.status !== 'complete' ? (
            <div className="flex justify-center">
              <button type="button" className="bm-btn bm-btn-ghost" onClick={togglePlaying}>
                {playing ? '일시정지' : '계속 진행'}
              </button>
            </div>
          ) : null}

          {gameFinished && result.boxScore ? (
            <div className="bm-card p-4">
              <h2 className="mb-3 font-semibold text-[var(--text-h)]">박스스코어</h2>
              <div className="mb-4 flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                {result.boxScore.winningPitcherId ? (
                  <span>
                    승:{' '}
                    <PlayerNameButton
                      playerId={result.boxScore.winningPitcherId}
                      name={findPlayerInLeague(state.teams, result.boxScore.winningPitcherId)?.player.name ?? '-'}
                    />
                  </span>
                ) : null}
                {result.boxScore.savePitcherId ? (
                  <span>
                    세이브:{' '}
                    <PlayerNameButton
                      playerId={result.boxScore.savePitcherId}
                      name={findPlayerInLeague(state.teams, result.boxScore.savePitcherId)?.player.name ?? '-'}
                    />
                  </span>
                ) : null}
                {result.parkStadium ? (
                  <span>구장: {result.parkStadium}</span>
                ) : null}
              </div>

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
                          const name = findPlayerInLeague(state.teams, id)?.player.name ?? id
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
                          const name = findPlayerInLeague(state.teams, id)?.player.name ?? id
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
                  {Array.from({ length: maxInningCols }, (_, i) => (
                    <th key={i} className="px-2">{i + 1}</th>
                  ))}
                  <th className="px-2 font-bold">득</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-h)]">
                <tr>
                  <td className="px-2 text-left">{awayTeam?.name}</td>
                  {Array.from({ length: maxInningCols }, (_, i) => (
                    <td key={i} className="px-2 tabular-nums">
                      {displayInnings[i]?.top !== undefined
                        ? displayInnings[i]!.top
                        : playing
                          ? ''
                          : '-'}
                    </td>
                  ))}
                  <td className="px-2 font-bold tabular-nums">{awayScore}</td>
                </tr>
                <tr>
                  <td className="px-2 text-left">{homeTeam?.name}</td>
                  {Array.from({ length: maxInningCols }, (_, i) => (
                    <td key={i} className="px-2 tabular-nums">
                      {displayInnings[i]?.bottom !== undefined
                        ? displayInnings[i]!.bottom
                        : playing
                          ? ''
                          : '-'}
                    </td>
                  ))}
                  <td className="px-2 font-bold tabular-nums">{homeScore}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bm-card max-h-96 overflow-y-auto p-4">
            <h2 className="mb-3 font-semibold text-[var(--text-h)]">플레이-by-플레이</h2>
            <ul className="space-y-1 font-mono text-sm">
              {result.logs.slice(0, sessionInProgress || playing ? replayCursor : result.logs.length).map((log, i) => {
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
        </>
      )}
    </div>
  )
}
