import { useEffect, useMemo, useRef, useState } from 'react'
import { computeScoreThroughLogs, currentInningLabel } from '../engine/liveScore'
import { findPlayerInLeague } from '../engine/playerLookup'
import { ipFromOuts } from '../engine/sabermetrics'
import { DAY_LABELS } from '../types/game'
import { PlayerNameButton } from '../components/PlayerNameButton'
import { GameSituationPanel } from '../components/GameSituationPanel'
import { GameManagementPanel } from '../components/GameManagementPanel'
import { ManagerTacticsPanel } from '../components/ManagerTacticsPanel'
import { PitchLocationPanel } from '../components/PitchLocationPanel'
import { LiveGameStatsPanel } from '../components/LiveGameStatsPanel'
import { useGame } from '../store/gameStore'
import { createLivePitch, type LivePitch, type PitchCall } from '../engine/livePitch'
import { SortableHeader, sortRows, useTableSort } from '../components/SortableTable'

interface PitchCount {
  balls: number
  strikes: number
}

const PITCH_INTERVAL_MS = 5000

function nextPitchCount(count: PitchCount, outcome?: string): PitchCount | null {
  if (outcome === 'walk') {
    if (count.balls === 1 && count.strikes === 0) return { ...count, strikes: 1 }
    if (count.balls === 3 && count.strikes === 1) return { ...count, strikes: 2 }
    if (count.balls >= 3) return null
    return { ...count, balls: count.balls + 1 }
  }

  if (outcome === 'strikeout') {
    if (count.strikes >= 2) return null
    if (count.strikes === 1 && count.balls === 0) return { ...count, balls: 1 }
    return { ...count, strikes: count.strikes + 1 }
  }

  // 인플레이 타석도 최소한의 투구 과정을 거친 뒤 결과를 공개한다.
  if (count.balls === 0 && count.strikes === 0) return { balls: 0, strikes: 1 }
  if (count.balls === 0) return { balls: 1, strikes: count.strikes }
  return null
}

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
  const [pitchCount, setPitchCount] = useState<PitchCount>({ balls: 0, strikes: 0 })
  const [pitchNumber, setPitchNumber] = useState(0)
  const [lastPitch, setLastPitch] = useState<LivePitch>()
  const [pendingResolution, setPendingResolution] = useState(false)
  const [showPlayLog, setShowPlayLog] = useState(false)
  const batterSort = useTableSort<'name' | 'ab' | 'hits' | 'rbi'>({ key: 'ab', direction: 'desc' })
  const pitcherSort = useTableSort<'name' | 'outs' | 'hits' | 'k' | 'er'>({ key: 'outs', direction: 'desc' })
  const lineSort = useTableSort<string>({ key: 'team', direction: 'asc' })
  const timerRef = useRef<number | null>(null)
  const result = lastResult
  const playing = activeGameSession?.status === 'playing'
  const sessionInProgress = Boolean(activeGameSession && activeGameSession.status !== 'complete')
  const sessionCursor = activeGameSession?.cursor ?? 0
  const activeGameId = activeGameSession?.gameId
  const gameFinished = !playing && !sessionInProgress
  const replayCursor = sessionInProgress ? sessionCursor : result?.logs.length ?? 0

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
      if (pendingResolution) {
        setPitchCount({ balls: 0, strikes: 0 })
        setPitchNumber(0)
        setPendingResolution(false)
        advanceActiveGame()
        return
      }
      const nextLog = result.logs.slice(sessionCursor)
        .find((log) => (log.eventType ?? 'plateAppearance') === 'plateAppearance')
      const nextCount = nextPitchCount(pitchCount, nextLog?.outcome)
      const call: PitchCall = nextCount
        ? nextCount.balls > pitchCount.balls ? 'ball' : 'strike'
        : nextLog?.outcome === 'walk' ? 'ball' : nextLog?.outcome === 'strikeout' ? 'strike' : 'inPlay'
      const pitcher = nextLog?.pitcherId ? findPlayerInLeague(state?.teams ?? [], nextLog.pitcherId)?.player : undefined
      setLastPitch(createLivePitch({
        seed: activeGameSession?.seed ?? 1,
        cursor: sessionCursor,
        pitchNumber,
        pitcher,
        call,
        outcome: nextLog?.outcome,
      }))
      setPitchNumber((value) => value + 1)
      if (nextCount) {
        setPitchCount(nextCount)
      } else {
        setPendingResolution(true)
      }
    }, PITCH_INTERVAL_MS / playbackSpeed)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [result, playing, sessionInProgress, sessionCursor, advanceActiveGame, pitchCount, playbackSpeed, pendingResolution, pitchNumber, state?.teams, activeGameSession?.seed])

  useEffect(() => {
    setPitchCount({ balls: 0, strikes: 0 })
    setPitchNumber(0)
    setLastPitch(undefined)
    setPendingResolution(false)
  }, [activeGameId])

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
  const batterRows = sortRows(Object.entries(result?.boxScore?.batters ?? {}).filter(([, line]) => line.ab > 0 || line.pa > 0), {
    name: ([id]) => findPlayerInLeague(state?.teams ?? [], id)?.player.name ?? id,
    ab: ([, line]) => line.ab, hits: ([, line]) => line.hits, rbi: ([, line]) => line.rbi,
  }, batterSort.sort).slice(0, 9)
  const pitcherRows = sortRows(Object.entries(result?.boxScore?.pitchers ?? {}).filter(([, line]) => line.bf > 0), {
    name: ([id]) => findPlayerInLeague(state?.teams ?? [], id)?.player.name ?? id,
    outs: ([, line]) => line.outs, hits: ([, line]) => line.h, k: ([, line]) => line.k, er: ([, line]) => line.er,
  }, pitcherSort.sort)
  const scoreRows = sortRows([
    { team: awayTeam?.name ?? '', innings: displayInnings.map((i) => i.top), runs: awayScore },
    { team: homeTeam?.name ?? '', innings: displayInnings.map((i) => i.bottom), runs: homeScore },
  ], Object.fromEntries([
    ['team', (row: { team: string; innings: (number | undefined)[]; runs: number }) => row.team],
    ...Array.from({ length: maxInningCols }, (_, i) => [String(i), (row: { innings: (number | undefined)[] }) => row.innings[i]] as const),
    ['runs', (row: { runs: number }) => row.runs],
  ]), lineSort.sort)

  const hasMoreGamesThisWeek = Boolean(upcomingGame && result && gameFinished)
  const currentSituation = result
    ? (sessionInProgress ? result.logs[replayCursor]?.situationBefore : undefined)
      ?? result.logs[Math.max(0, (sessionInProgress || playing ? replayCursor : result.logs.length) - 1)]?.situationAfter
      ?? result.logs[0]?.situationBefore
    : undefined
  const shownLogCount = sessionInProgress || playing ? replayCursor : result?.logs.length ?? 0
  const currentLog = shownLogCount > 0 ? result?.logs[shownLogCount - 1] : undefined
  const visibleLogs = result?.logs.slice(0, shownLogCount) ?? []
  const userSide = currentSituation
    ? ((currentSituation.half === 'bottom') === Boolean(isHome) ? 'offense' : 'defense')
    : undefined

  return (
    <div className="bm-animate-in space-y-3">
      <div className="flex min-h-8 items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-bold text-[var(--text-h)]">경기</h1>
          <p className="text-xs text-[var(--text-muted)]">
            {state.currentWeek}주차
            {upcomingGame?.day ? ` · ${DAY_LABELS[upcomingGame.day]}요일` : null}
            {result?.day && !upcomingGame ? ` · ${DAY_LABELS[result.day]}요일` : null}
          </p>
        </div>
        {result && opponent && liveScore ? (
          <div className={`bm-card flex shrink-0 items-center gap-2 px-3 py-1 text-xs ${gameFinished && userWon ? 'border-emerald-500/50' : gameFinished ? 'border-red-500/30' : ''}`} aria-label={`${userTeam.name} ${userScore} 대 ${opponent.name} ${oppScore}`}>
            <span className="text-[var(--text-muted)]">{playing || sessionInProgress ? currentInningLabel(result.logs, replayCursor) : userWon ? '승리' : '패배'}</span>
            <b className="text-[var(--text-h)]">{userTeam.abbr}</b>
            <strong className="text-base text-[var(--text-h)] tabular-nums">{userScore}</strong>
            <span className="text-[var(--text-muted)]">:</span>
            <strong className="text-base text-[var(--text-h)] tabular-nums">{oppScore}</strong>
            <b className="text-[var(--text-h)]">{opponent.abbr}</b>
          </div>
        ) : null}
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
              <div className="text-xl font-bold text-[var(--text-h)]">
                {userTeam.name}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{userTeam.city}</div>
            </div>
            <div className="text-2xl font-black text-[var(--text-muted)]">VS</div>
            <div>
              <div className="text-xl font-bold text-[var(--text-h)]">
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
          {gameFinished && (
              <div className="flex flex-wrap justify-end gap-2">
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

          <div className="grid items-start gap-3 md:grid-cols-[minmax(0,1fr)_200px_240px] 2xl:grid-cols-[minmax(0,1.2fr)_minmax(220px,.7fr)_minmax(280px,.9fr)]">
            <GameSituationPanel
              situation={currentSituation}
              currentLog={currentLog}
              teams={state.teams}
              balls={sessionInProgress ? pitchCount.balls : 0}
              strikes={sessionInProgress ? pitchCount.strikes : 0}
              userSide={userSide}
            />

            <PitchLocationPanel pitch={lastPitch} />

            <div className="space-y-3">
              {sessionInProgress ? <ManagerTacticsPanel /> : null}
              <div className="bm-card p-3" aria-label="경기 재생 설정">
                <span className="mb-1.5 block text-xs text-[var(--text-muted)]">재생 속도</span>
                <div className="grid grid-cols-4 gap-2">
                  {[0.5, 1, 2].map((speed) => <button key={speed} type="button" className={`bm-btn w-full justify-center px-1 py-1.5 text-xs ${playbackSpeed === speed ? 'bm-btn-primary' : 'bm-btn-ghost'}`} onClick={() => setPlaybackSpeed(speed)}>{speed}×</button>)}
                  {sessionInProgress ? (
                    <button
                      type="button"
                      className="bm-btn bm-btn-ghost w-full justify-center px-1 py-1.5"
                      onClick={togglePlaying}
                      aria-label={playing ? '경기 일시정지' : '경기 계속 진행'}
                      title={playing ? '일시정지' : '계속 진행'}
                    >
                      <PlayPauseIcon playing={playing} />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <LiveGameStatsPanel
            logs={visibleLogs}
            teams={state.teams}
            currentPitcherId={sessionInProgress ? currentSituation?.pitcherId : undefined}
            currentPitchCount={sessionInProgress ? pitchNumber : 0}
          />

          <GameManagementPanel />

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
                        <SortableHeader column="name" sort={batterSort.sort} onSort={batterSort.requestSort}>선수</SortableHeader>
                        <SortableHeader column="ab" sort={batterSort.sort} onSort={batterSort.requestSort}>타수</SortableHeader>
                        <SortableHeader column="hits" sort={batterSort.sort} onSort={batterSort.requestSort}>안타</SortableHeader>
                        <SortableHeader column="rbi" sort={batterSort.sort} onSort={batterSort.requestSort}>타점</SortableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {batterRows.map(([id, line]) => {
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
                        <SortableHeader column="name" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>선수</SortableHeader>
                        <SortableHeader column="outs" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>이닝</SortableHeader>
                        <SortableHeader column="hits" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>피안타</SortableHeader>
                        <SortableHeader column="k" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>삼진</SortableHeader>
                        <SortableHeader column="er" sort={pitcherSort.sort} onSort={pitcherSort.requestSort}>자책</SortableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {pitcherRows.map(([id, line]) => {
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
                  <SortableHeader className="px-2" column="team" sort={lineSort.sort} onSort={lineSort.requestSort}>팀</SortableHeader>
                  {Array.from({ length: maxInningCols }, (_, i) => (
                    <SortableHeader key={i} className="px-2" column={String(i)} sort={lineSort.sort} onSort={lineSort.requestSort}>{i + 1}</SortableHeader>
                  ))}
                  <SortableHeader className="px-2 font-bold" column="runs" sort={lineSort.sort} onSort={lineSort.requestSort}>득</SortableHeader>
                </tr>
              </thead>
              <tbody className="text-[var(--text-h)]">
                {scoreRows.map((row) => <tr key={row.team}>
                  <td className="px-2 text-left">{row.team}</td>
                  {Array.from({ length: maxInningCols }, (_, i) => <td key={i} className="px-2 tabular-nums">{row.innings[i] ?? (playing ? '' : '-')}</td>)}
                  <td className="px-2 font-bold tabular-nums">{row.runs}</td>
                </tr>)}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            className="bm-card flex w-full items-center gap-3 px-4 py-2 text-left text-sm"
            onClick={() => setShowPlayLog(true)}
            aria-haspopup="dialog"
          >
            <span className="shrink-0 font-semibold text-[var(--accent)]">플레이-by-플레이</span>
            <span className="min-w-0 flex-1 truncate text-[var(--text-h)]">
              {currentLog ? `${currentLog.inning}회 ${currentLog.half === 'top' ? '초' : '말'} · ${currentLog.text}` : '아직 기록된 플레이가 없습니다.'}
            </span>
            <span className="shrink-0 text-xs text-[var(--text-muted)]">전체 보기</span>
          </button>

          {showPlayLog ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation" onMouseDown={() => setShowPlayLog(false)}>
              <section
                className="bm-card flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="play-log-title"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                  <h2 id="play-log-title" className="font-semibold text-[var(--text-h)]">플레이-by-플레이</h2>
                  <button type="button" className="bm-btn bm-btn-ghost py-1 text-xs" onClick={() => setShowPlayLog(false)}>닫기</button>
                </div>
                <ul className="space-y-1 overflow-y-auto p-5 font-mono text-sm">
              {visibleLogs.map((log, i) => {
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
              </section>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <rect x="4" y="3" width="4" height="14" rx="1" />
      <rect x="12" y="3" width="4" height="14" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M5 3.8a1 1 0 0 1 1.53-.85l10 6.2a1 1 0 0 1 0 1.7l-10 6.2A1 1 0 0 1 5 16.2V3.8Z" />
    </svg>
  )
}
