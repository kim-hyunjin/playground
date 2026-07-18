import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_BULLPEN_STRATEGY, DEFAULT_MANAGER_COMMAND, type BullpenStrategy, type ManagerCommand, type FieldPosition, type GameResult, type GameState, type Player, type ScheduledGame, type Team, type View } from '../types/game'
import { loadLeague2026 } from '../data/rosterLoader'
import { defaultLineup, defaultRotation } from '../engine/generator'
import { generateSchedule, generateFarmSchedule, nextUserGame, normalizeSchedule, hasUnplayedUserGamesInWeek } from '../engine/schedule'
import { applyResult, simulateCpuGames, simulateGame } from '../engine/simulation'
import { simulateFarmWeek } from '../engine/farmSimulation'
import {
  countByLevel,
  demoteWithLineup,
  autoAdjustLeagueRosters,
  FIRST_TEAM_MAX,
  FARM_TEAM_MAX,
  promoteInLeague,
} from '../engine/roster'
import { generateCoachMarket, refreshCoachMarket } from '../engine/coachGenerator'
import { developTeam } from '../engine/development'
import { generateCallUpSuggestions, mergeCallUpSuggestions } from '../engine/callUpSuggestions'
import {
  advanceStoveWeekState,
  buildStoveLeagueState,
  initialSeasonMeta,
  isStoveLeague,
  signFreeAgentForTeam,
  startNextSeasonState,
} from '../engine/stoveLeague'
import {
  draftProspect,
  simulateDraftUntilUser,
  simulateRemainingDraft,
} from '../engine/draft'

import { recoverTeamInjuries, rollWeeklyInjuries } from '../engine/injury'
import { sanitizeLineup, sanitizeRotation } from '../engine/rosterAvailability'
import { cpuAcceptsTrade, executeTrade, validateTrade, type TradeProposal } from '../engine/trades'
import {
  advancePlateAppearance,
  createGameSession,
  pauseGameSession,
  restoreGameSession,
  resumeGameSession,
  type GameSession,
  substituteSessionBatter,
  substituteSessionPitcher,
  substituteSessionRunner,
} from '../engine/gameSession'
import { createSeededRandom } from '../engine/sim/random'
import { createGameRoster } from '../engine/substitutions'
import { submitContractOffer } from '../engine/negotiations'

const STORAGE_KEY = 'baseball-manager'
const ACTIVE_GAME_KEY = 'baseball-manager-active-game'

interface GameContextValue {
  state: GameState | null
  view: View
  setView: (v: View) => void
  userTeam: Team | null
  startNewGame: (teamIndex: number, managerName: string) => void
  loadGame: () => boolean
  resetGame: () => void
  setLineup: (lineup: Record<FieldPosition, string>) => void
  setRotation: (rotation: string[]) => void
  swapRotation: (from: number, to: number) => void
  setBullpenStrategy: (strategy: BullpenStrategy) => void
  setManagerCommand: (command: ManagerCommand) => void
  playUserGame: () => GameResult | null
  advanceWeek: () => void
  lastResult: GameResult | null
  activeGameSession: GameSession | null
  advanceActiveGame: () => void
  pauseActiveGame: () => void
  resumeActiveGame: () => void
  substitutePitcher: (playerId: string) => string
  substituteBatter: (battingOrder: number, playerId: string) => string
  substituteRunner: (outgoingId: string, playerId: string) => string
  clearLastResult: () => void
  upcomingGame: ScheduledGame | null
  buyPlayer: (player: Player, fromTeamId: string) => boolean
  tradePlayers: (proposal: Omit<TradeProposal, 'fromTeamId'>) => { ok: boolean; message: string }
  releasePlayer: (playerId: string) => void
  promotePlayer: (playerId: string) => boolean
  demotePlayer: (playerId: string) => boolean
  sendToRehab: (playerId: string) => boolean
  hireCoach: (coachId: string) => boolean
  fireCoach: (coachId: string) => boolean
  negotiateContract: (negotiationId: string, salary: number, years: number) => string
  acceptCallUp: (suggestionId: string) => boolean
  dismissCallUp: (suggestionId: string) => void
  enterStoveLeague: () => void
  signFreeAgent: (playerId: string) => boolean
  advanceStoveWeek: () => void
  startNextSeason: () => void
  draftPlayer: (playerId: string) => boolean
  simulateDraftToUser: () => void
  simulateRemainingDraft: () => void
  focusedPlayerId: string | null
  openPlayer: (playerId: string) => void
  closePlayer: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

function createInitialState(teamIndex: number, managerName: string): GameState {
  const teams = loadLeague2026(teamIndex)
  const userTeam = teams[teamIndex]!
  const totalWeeks = 18

  return {
    userTeamId: userTeam.id,
    teams,
    schedule: generateSchedule(teams, totalWeeks),
    farmSchedule: generateFarmSchedule(teams, totalWeeks),
    coachMarket: generateCoachMarket(),
    callUpSuggestions: [],
    ...initialSeasonMeta(),
    currentWeek: 1,
    totalWeeks,
    lineup: defaultLineup(userTeam),
    rotation: defaultRotation(userTeam),
    rotationIndex: 0,
    bullpenStrategy: DEFAULT_BULLPEN_STRATEGY,
    managerCommand: DEFAULT_MANAGER_COMMAND,
    results: [],
    farmResults: [],
    managerName,
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // quota / private mode
  }
}

function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GameState
    if (!parsed?.teams?.length || !parsed.userTeamId) return null
    return {
      ...parsed,
      teams: parsed.teams.map((team) => ({
        ...team,
        players: team.players.map((player) => ({ ...player, contractYears: player.contractYears ?? 1 })),
        coaches: (team.coaches ?? []).map((coach) => ({ ...coach, contractYears: coach.contractYears ?? 1 })),
      })),
      schedule: normalizeSchedule(parsed.schedule ?? []),
      farmSchedule: normalizeSchedule(parsed.farmSchedule ?? []),
      bullpenStrategy: parsed.bullpenStrategy ?? DEFAULT_BULLPEN_STRATEGY,
      managerCommand: parsed.managerCommand ?? DEFAULT_MANAGER_COMMAND,
      contractNegotiations: parsed.contractNegotiations ?? [],
    }
  } catch {
    return null
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null)
  const [view, setView] = useState<View>('dashboard')
  const [lastResult, setLastResult] = useState<GameResult | null>(null)
  const [activeGameSession, setActiveGameSession] = useState<GameSession | null>(null)
  const [focusedPlayerId, setFocusedPlayerId] = useState<string | null>(null)

  useEffect(() => {
    const loaded = loadState()
    if (loaded) setState(loaded)
    let restored: GameSession | null = null
    try {
      restored = restoreGameSession(JSON.parse(localStorage.getItem(ACTIVE_GAME_KEY) ?? 'null'))
    } catch {
      localStorage.removeItem(ACTIVE_GAME_KEY)
    }
    if (restored) {
      setActiveGameSession(restored)
      setLastResult(restored.resolvedResult)
    }
  }, [])

  useEffect(() => {
    if (activeGameSession) localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(activeGameSession))
    else localStorage.removeItem(ACTIVE_GAME_KEY)
  }, [activeGameSession])

  useEffect(() => {
    if (state) saveState(state)
  }, [state])

  useEffect(() => {
    if (!activeGameSession || activeGameSession.status !== 'complete') return
    const result = activeGameSession.resolvedResult
    setState((current) => {
      if (!current || current.schedule.find((game) => game.id === result.gameId)?.played) return current
      const applied = applyResult(current.teams, current.schedule, result)
      const teams = applied.teams.map((team) => team.id !== current.userTeamId ? team : {
        ...team,
        players: team.players.map((player) => ({
          ...player,
          fatigue: Math.min(100, player.fatigue + (player.role === 'SP' ? 18 : 6)),
        })),
      })
      return {
        ...current,
        teams,
        schedule: applied.schedule,
        results: [...current.results, result],
        rotationIndex: current.rotationIndex + 1,
      }
    })
  }, [activeGameSession])

  const userTeam = useMemo(
    () => state?.teams.find((t) => t.id === state.userTeamId) ?? null,
    [state],
  )

  const upcomingGame = useMemo(() => {
    if (!state) return null
    return nextUserGame(state.schedule, state.userTeamId, state.currentWeek) ?? null
  }, [state])

  const startNewGame = useCallback((teamIndex: number, managerName: string) => {
    const initial = createInitialState(teamIndex, managerName)
    setState(initial)
    setView('dashboard')
    setLastResult(null)
    setFocusedPlayerId(null)
  }, [])

  const loadGame = useCallback(() => {
    const loaded = loadState()
    if (loaded) {
      setState(loaded)
      setView('dashboard')
      return true
    }
    return false
  }, [])

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(ACTIVE_GAME_KEY)
    setState(null)
    setView('dashboard')
    setLastResult(null)
    setActiveGameSession(null)
    setFocusedPlayerId(null)
  }, [])

  const openPlayer = useCallback((playerId: string) => {
    setFocusedPlayerId(playerId)
  }, [])

  const closePlayer = useCallback(() => {
    setFocusedPlayerId(null)
  }, [])

  const setLineup = useCallback((lineup: Record<FieldPosition, string>) => {
    setState((s) => (s ? { ...s, lineup } : s))
  }, [])

  const setRotation = useCallback((rotation: string[]) => {
    setState((s) => (s ? { ...s, rotation } : s))
  }, [])

  const swapRotation = useCallback((from: number, to: number) => {
    setState((s) => {
      if (!s) return s
      const rotation = [...s.rotation]
      ;[rotation[from], rotation[to]] = [rotation[to]!, rotation[from]!]
      return { ...s, rotation }
    })
  }, [])
  const setBullpenStrategy = useCallback((bullpenStrategy: BullpenStrategy) => {
    setState((s) => s ? { ...s, bullpenStrategy } : s)
  }, [])
  const setManagerCommand = useCallback((managerCommand: ManagerCommand) => {
    setState((s) => s ? { ...s, managerCommand } : s)
  }, [])

  const playUserGame = useCallback((): GameResult | null => {
    if (!state || state.phase !== 'regular') return null
    const game = nextUserGame(state.schedule, state.userTeamId, state.currentWeek)
    if (!game) return null

    const home = state.teams.find((t) => t.id === game.homeId)!
    const away = state.teams.find((t) => t.id === game.awayId)!
    const isHome = game.homeId === state.userTeamId

    const seed = (Date.now() ^ state.currentWeek ^ state.rotationIndex) >>> 0
    const result = simulateGame(game, home, away, {
      homeLineup: isHome ? state.lineup : undefined,
      awayLineup: !isHome ? state.lineup : undefined,
      homeRotationIndex: isHome ? state.rotationIndex : undefined,
      awayRotationIndex: !isHome ? state.rotationIndex : undefined,
      random: createSeededRandom({ seed }),
      homeBullpenStrategy: isHome ? state.bullpenStrategy : undefined,
      awayBullpenStrategy: !isHome ? state.bullpenStrategy : undefined,
      homeCommand: isHome ? state.managerCommand : undefined,
      awayCommand: !isHome ? state.managerCommand : undefined,
    })

    setLastResult(result)
    const starterId = isHome ? result.boxScore.homeStarterId : result.boxScore.awayStarterId
    setActiveGameSession(createGameSession(result, seed, createGameRoster(userTeam!, state.lineup, starterId)))
    return result
  }, [state, userTeam])

  const advanceActiveGame = useCallback(() => {
    setActiveGameSession((session) => session ? advancePlateAppearance(session) : null)
  }, [])
  const pauseActiveGame = useCallback(() => {
    setActiveGameSession((session) => session ? pauseGameSession(session) : null)
  }, [])
  const resumeActiveGame = useCallback(() => {
    setActiveGameSession((session) => session ? resumeGameSession(session) : null)
  }, [])
  const substitutePitcher = useCallback((playerId: string): string => {
    const player = userTeam?.players.find((p) => p.id === playerId)
    if (!player) return '선수를 찾을 수 없습니다.'
    if (!activeGameSession) return '진행 중인 경기가 없습니다.'
    const result = substituteSessionPitcher(activeGameSession, player)
    setActiveGameSession(result.session)
    if (result.ok) setLastResult(result.session.resolvedResult)
    return result.message
  }, [activeGameSession, userTeam])
  const substituteBatter = useCallback((battingOrder: number, playerId: string): string => {
    const player = userTeam?.players.find((p) => p.id === playerId)
    if (!player) return '선수를 찾을 수 없습니다.'
    if (!activeGameSession) return '진행 중인 경기가 없습니다.'
    const result = substituteSessionBatter(activeGameSession, battingOrder, player)
    setActiveGameSession(result.session)
    if (result.ok) setLastResult(result.session.resolvedResult)
    return result.message
  }, [activeGameSession, userTeam])
  const substituteRunner = useCallback((outgoingId: string, playerId: string): string => {
    const player = userTeam?.players.find((p) => p.id === playerId)
    if (!player) return '선수를 찾을 수 없습니다.'
    if (!activeGameSession) return '진행 중인 경기가 없습니다.'
    const result = substituteSessionRunner(activeGameSession, outgoingId, player)
    setActiveGameSession(result.session)
    if (result.ok) setLastResult(result.session.resolvedResult)
    return result.message
  }, [activeGameSession, userTeam])

  const advanceWeek = useCallback(() => {
    setState((s) => {
      if (!s || s.phase !== 'regular' || s.currentWeek >= s.totalWeeks) return s
      if (hasUnplayedUserGamesInWeek(s.schedule, s.userTeamId, s.currentWeek)) return s

      const cpu = simulateCpuGames(s.schedule, s.teams, s.currentWeek, s.userTeamId)
      const farm = simulateFarmWeek(s.farmSchedule, cpu.teams, s.currentWeek)

      const developed = farm.teams.map(developTeam)
      const adjusted = autoAdjustLeagueRosters(developed, s.userTeamId)

      const recovered = adjusted.map((t) => ({
        ...t,
        players: rollWeeklyInjuries(
          recoverTeamInjuries(
            t.players.map((p) => ({
              ...p,
              fatigue: Math.max(0, p.fatigue - (t.id === s.userTeamId ? 12 : 8)),
            })),
          ),
        ),
      }))

      const nextWeek = s.currentWeek + 1
      const interim: GameState = {
        ...s,
        teams: recovered,
        schedule: cpu.schedule,
        farmSchedule: farm.schedule,
        results: [...s.results, ...cpu.results],
        farmResults: [...s.farmResults, ...farm.results],
        currentWeek: nextWeek,
      }

      const suggestions = generateCallUpSuggestions(interim)
      const coachMarket = refreshCoachMarket(s.coachMarket ?? [])
      const userTeam = recovered.find((t) => t.id === s.userTeamId)!

      return {
        ...interim,
        lineup: sanitizeLineup(userTeam, interim.lineup),
        rotation: sanitizeRotation(userTeam, interim.rotation),
        callUpSuggestions: mergeCallUpSuggestions(s.callUpSuggestions ?? [], suggestions),
        coachMarket,
      }
    })
  }, [])

  const buyPlayer = useCallback((player: Player, fromTeamId: string): boolean => {
    if (!state || !userTeam || state.phase !== 'regular') return false
    if (userTeam.budget < player.salary) return false

    const firstFull = countByLevel(userTeam, 'first') >= FIRST_TEAM_MAX
    const farmFull = countByLevel(userTeam, 'farm') >= FARM_TEAM_MAX

    let rosterLevel: 'first' | 'farm' = 'first'
    if (firstFull) {
      if (farmFull) return false
      rosterLevel = 'farm'
    }

    const newTeams = state.teams.map((t) => {
      if (t.id === fromTeamId) {
        return {
          ...t,
          players: t.players.filter((p) => p.id !== player.id),
          budget: t.budget + player.salary,
        }
      }
      if (t.id === state.userTeamId) {
        return {
          ...t,
          players: [
            ...t.players,
            {
              ...player,
              rosterLevel,
              morale: Math.min(99, player.morale + 5),
            },
          ],
          budget: t.budget - player.salary,
        }
      }
      return t
    })

    setState({ ...state, teams: newTeams })
    return true
  }, [state, userTeam])

  const tradePlayers = useCallback(
    (proposal: Omit<TradeProposal, 'fromTeamId'>): { ok: boolean; message: string } => {
      if (!state || !userTeam || state.phase !== 'regular') {
        return { ok: false, message: '정규시즌 중에만 트레이드할 수 있습니다.' }
      }

      const full: TradeProposal = { ...proposal, fromTeamId: state.userTeamId }
      const validationErr = validateTrade(state.teams, full)
      if (validationErr) {
        return { ok: false, message: validationErr }
      }

      const cpuTeam = state.teams.find((t) => t.id === proposal.toTeamId)
      if (!cpuTeam) return { ok: false, message: '상대 팀을 찾을 수 없습니다.' }

      const accepted = cpuAcceptsTrade(
        userTeam,
        cpuTeam,
        proposal.outgoingIds,
        proposal.incomingIds,
      )
      if (!accepted) {
        return { ok: false, message: '상대 구단이 제안을 거절했습니다.' }
      }

      const updated = executeTrade(state.teams, full)
      if (!updated) return { ok: false, message: '트레이드 처리에 실패했습니다.' }

      setState({ ...state, teams: updated })
      return { ok: true, message: '트레이드가 성사되었습니다!' }
    },
    [state, userTeam],
  )

  const releasePlayer = useCallback((playerId: string) => {
    setState((s) => {
      if (!s) return s
      const team = s.teams.find((t) => t.id === s.userTeamId)
      const player = team?.players.find((p) => p.id === playerId)
      if (!player) return s

      const newTeams = s.teams.map((t) => {
        if (t.id !== s.userTeamId) return t
        return {
          ...t,
          players: t.players.filter((p) => p.id !== playerId),
          budget: t.budget + Math.round(player.salary * 0.3),
        }
      })
      return { ...s, teams: newTeams }
    })
    setFocusedPlayerId((id) => (id === playerId ? null : id))
  }, [])

  const promotePlayer = useCallback((playerId: string): boolean => {
    let ok = false
    setState((s) => {
      if (!s) return s
      const teams = promoteInLeague(s.teams, s.userTeamId, playerId)
      if (!teams) return s
      ok = true
      return { ...s, teams }
    })
    return ok
  }, [])

  const demotePlayer = useCallback((playerId: string): boolean => {
    let ok = false
    setState((s) => {
      if (!s) return s
      const updated = demoteWithLineup(s, playerId)
      if (!updated) return s
      ok = true
      return { ...s, ...updated }
    })
    return ok
  }, [])

  const sendToRehab = useCallback((playerId: string): boolean => {
    let ok = false
    setState((s) => {
      if (!s) return s
      const team = s.teams.find((t) => t.id === s.userTeamId)
      const player = team?.players.find((p) => p.id === playerId)
      if (!player || player.rosterLevel !== 'first' || !(player.injuryDays && player.injuryDays > 0)) {
        return s
      }
      const updated = demoteWithLineup(s, playerId)
      if (!updated) return s
      ok = true
      return { ...s, ...updated }
    })
    return ok
  }, [])

  const hireCoach = useCallback((coachId: string): boolean => {
    let ok = false
    setState((s) => {
      if (!s) return s
      const coach = s.coachMarket.find((c) => c.id === coachId)
      if (!coach) return s

      const team = s.teams.find((t) => t.id === s.userTeamId)
      if (!team || team.budget < coach.salary) return s
      if (team.coaches.some((c) => c.role === coach.role)) return s

      ok = true
      return {
        ...s,
        coachMarket: s.coachMarket.filter((c) => c.id !== coachId),
        teams: s.teams.map((t) =>
          t.id === s.userTeamId
            ? {
                ...t,
                budget: t.budget - coach.salary,
                coaches: [...t.coaches, coach],
              }
            : t,
        ),
      }
    })
    return ok
  }, [])

  const fireCoach = useCallback((coachId: string): boolean => {
    let ok = false
    setState((s) => {
      if (!s) return s
      const team = s.teams.find((t) => t.id === s.userTeamId)
      const coach = team?.coaches.find((c) => c.id === coachId)
      if (!coach) return s

      ok = true
      return {
        ...s,
        coachMarket: [...(s.coachMarket ?? []), coach],
        teams: s.teams.map((t) =>
          t.id === s.userTeamId
            ? { ...t, budget: Math.max(0, t.budget - Math.round(coach.salary * 0.5)), coaches: t.coaches.filter((c) => c.id !== coachId) }
            : t,
        ),
      }
    })
    return ok
  }, [])
  const negotiateContract = useCallback((negotiationId: string, salary: number, years: number): string => {
    if (!state || state.phase !== 'stove') return '스토브리그에서만 협상할 수 있습니다.'
    const result = submitContractOffer(state, negotiationId, salary, years)
    setState(result.state)
    return result.message
  }, [state])

  const acceptCallUp = useCallback((suggestionId: string): boolean => {
    let ok = false
    setState((s) => {
      if (!s) return s
      const suggestion = s.callUpSuggestions.find((x) => x.id === suggestionId)
      if (!suggestion) return s

      const teams = promoteInLeague(s.teams, s.userTeamId, suggestion.playerId)
      if (!teams) return s

      ok = true
      return {
        ...s,
        teams,
        callUpSuggestions: s.callUpSuggestions.filter((x) => x.id !== suggestionId),
      }
    })
    return ok
  }, [])

  const dismissCallUp = useCallback((suggestionId: string) => {
    setState((s) => {
      if (!s) return s
      return {
        ...s,
        callUpSuggestions: s.callUpSuggestions.filter((x) => x.id !== suggestionId),
      }
    })
  }, [])

  const enterStoveLeague = useCallback(() => {
    setState((s) => {
      if (!s || s.phase !== 'regular' || s.currentWeek < s.totalWeeks) return s
      return buildStoveLeagueState(s)
    })
    setView('draft')
  }, [])

  const draftPlayer = useCallback((playerId: string): boolean => {
    let ok = false
    setState((s) => {
      if (!s) return s
      const next = draftProspect(s, playerId)
      if (!next) return s
      ok = true
      return next
    })
    return ok
  }, [])

  const simulateDraftToUser = useCallback(() => {
    setState((s) => {
      if (!s || s.phase !== 'stove' || !s.draft) return s
      return simulateDraftUntilUser(s)
    })
  }, [])

  const simulateRemainingDraftFn = useCallback(() => {
    setState((s) => {
      if (!s || s.phase !== 'stove' || !s.draft) return s
      return simulateRemainingDraft(s)
    })
  }, [])

  const signFreeAgent = useCallback((playerId: string): boolean => {
    let ok = false
    setState((s) => {
      if (!s || s.phase !== 'stove') return s
      const listing = s.freeAgents.find((l) => l.player.id === playerId)
      if (!listing) return s

      const teamIdx = s.teams.findIndex((t) => t.id === s.userTeamId)
      if (teamIdx < 0) return s

      const signed = signFreeAgentForTeam(s.teams[teamIdx]!, listing)
      if (!signed) return s

      ok = true
      const teams = [...s.teams]
      teams[teamIdx] = signed.team
      return {
        ...s,
        teams,
        freeAgents: s.freeAgents.filter((l) => l.player.id !== playerId),
      }
    })
    return ok
  }, [])

  const advanceStoveWeek = useCallback(() => {
    setState((s) => {
      if (!s || !isStoveLeague(s)) return s
      const maxWeek = s.stoveTotalWeeks ?? 4
      if ((s.stoveWeek ?? 1) >= maxWeek) return s
      return advanceStoveWeekState(s)
    })
  }, [])

  const startNextSeason = useCallback(() => {
    setState((s) => {
      if (!s || s.phase !== 'stove') return s
      return startNextSeasonState(s)
    })
    setView('dashboard')
  }, [])

  const clearLastResult = useCallback(() => {
    setLastResult(null)
    setActiveGameSession(null)
  }, [])

  const value: GameContextValue = {
    state,
    view,
    setView,
    userTeam,
    startNewGame,
    loadGame,
    resetGame,
    setLineup,
    setRotation,
    swapRotation,
    setBullpenStrategy,
    setManagerCommand,
    playUserGame,
    advanceWeek,
    lastResult,
    activeGameSession,
    advanceActiveGame,
    pauseActiveGame,
    resumeActiveGame,
    substitutePitcher,
    substituteBatter,
    substituteRunner,
    clearLastResult,
    upcomingGame,
    buyPlayer,
    tradePlayers,
    releasePlayer,
    promotePlayer,
    demotePlayer,
    sendToRehab,
    hireCoach,
    fireCoach,
    negotiateContract,
    acceptCallUp,
    dismissCallUp,
    enterStoveLeague,
    signFreeAgent,
    advanceStoveWeek,
    startNextSeason,
    draftPlayer,
    simulateDraftToUser,
    simulateRemainingDraft: simulateRemainingDraftFn,
    focusedPlayerId,
    openPlayer,
    closePlayer,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
