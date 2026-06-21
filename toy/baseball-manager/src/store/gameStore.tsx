import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { FieldPosition, GameResult, GameState, Player, ScheduledGame, Team, View } from '../types/game'
import { loadLeague2026, DATA_SEASON } from '../data/rosterLoader'
import { defaultLineup, defaultRotation, generateFarmRosterPlayers } from '../engine/generator'
import { generateSchedule, generateFarmSchedule, nextUserGame } from '../engine/schedule'
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
import { ensurePlayerRosterFields } from '../engine/statsAccumulator'
import { generateCoachMarket, generateDefaultStaff, refreshCoachMarket } from '../engine/coachGenerator'
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
  initializeDraft,
  simulateDraftUntilUser,
  simulateRemainingDraft,
} from '../engine/draft'

import { recoverTeamInjuries, rollWeeklyInjuries } from '../engine/injury'

const STORAGE_KEY = 'baseball-manager:v7'
const LEGACY_KEYS = [
  'baseball-manager:v6',
  'baseball-manager:v5',
  'baseball-manager:v3',
  'baseball-manager:v2',
  'baseball-manager:v1',
]

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
  playUserGame: () => GameResult | null
  advanceWeek: () => void
  lastResult: GameResult | null
  clearLastResult: () => void
  upcomingGame: ScheduledGame | null
  buyPlayer: (player: Player, fromTeamId: string) => boolean
  releasePlayer: (playerId: string) => void
  promotePlayer: (playerId: string) => boolean
  demotePlayer: (playerId: string) => boolean
  hireCoach: (coachId: string) => boolean
  fireCoach: (coachId: string) => boolean
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
    version: 7,
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

function migrateResult(r: GameResult & { boxScore?: GameResult['boxScore'] }): GameResult {
  if (r.boxScore) return r
  return {
    ...r,
    boxScore: {
      batters: {},
      pitchers: {},
      awayStarterId: '',
      homeStarterId: '',
    },
  }
}

function migratePlayerMetadata(player: Player): Player {
  const isGenerated =
    player.isGenerated ??
    (player.name.startsWith('(퓨처스)') || player.id.includes('-gen-'))

  return {
    ...player,
    isGenerated,
    realPlayerId: player.realPlayerId ?? (isGenerated ? undefined : player.id),
    dataSeason:
      player.dataSeason ??
      (isGenerated ? undefined : player.rosterLevel === 'first' ? DATA_SEASON : undefined),
  }
}

function migrateTeam(team: Team): Team {
  const players = team.players.map(ensurePlayerRosterFields).map(migratePlayerMetadata)
  const hasFarm = players.some((p) => p.rosterLevel === 'farm')

  return {
    ...team,
    stadium: team.stadium ?? '',
    coaches: team.coaches?.length ? team.coaches : generateDefaultStaff(false),
    players: hasFarm ? players : [...players, ...generateFarmRosterPlayers()],
    farmWins: team.farmWins ?? 0,
    farmLosses: team.farmLosses ?? 0,
    farmRunsScored: team.farmRunsScored ?? 0,
    farmRunsAllowed: team.farmRunsAllowed ?? 0,
  }
}

function migrateState(raw: unknown): GameState | null {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as GameState & { version?: number }

  const teams = (s.teams ?? []).map(migrateTeam)
  const results = (s.results ?? []).map(migrateResult)
  const totalWeeks = s.totalWeeks ?? 18
  const draft =
    s.draft ?? (s.phase === 'stove' ? initializeDraft(teams) : undefined)

  return {
    ...s,
    version: 7,
    teams,
    results,
    seasonYear: s.seasonYear ?? 2026,
    phase: s.phase ?? 'regular',
    freeAgents: s.freeAgents ?? [],
    draft,
    stoveWeek: s.stoveWeek,
    stoveTotalWeeks: s.stoveTotalWeeks,
    farmSchedule: s.farmSchedule ?? generateFarmSchedule(teams, totalWeeks),
    farmResults: s.farmResults ?? [],
    coachMarket: s.coachMarket?.length ? s.coachMarket : generateCoachMarket(),
    callUpSuggestions: s.callUpSuggestions ?? [],
  } as GameState
}

function loadState(): GameState | null {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      LEGACY_KEYS.map((k) => localStorage.getItem(k)).find(Boolean)
    if (!raw) return null
    const migrated = migrateState(JSON.parse(raw))
    if (migrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    }
    return migrated
  } catch {
    return null
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null)
  const [view, setView] = useState<View>('dashboard')
  const [lastResult, setLastResult] = useState<GameResult | null>(null)
  const [focusedPlayerId, setFocusedPlayerId] = useState<string | null>(null)

  useEffect(() => {
    const loaded = loadState()
    if (loaded) setState(loaded)
  }, [])

  useEffect(() => {
    if (state) saveState(state)
  }, [state])

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
    for (const key of LEGACY_KEYS) localStorage.removeItem(key)
    setState(null)
    setView('dashboard')
    setLastResult(null)
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

  const playUserGame = useCallback((): GameResult | null => {
    if (!state || state.phase !== 'regular') return null
    const game = nextUserGame(state.schedule, state.userTeamId, state.currentWeek)
    if (!game) return null

    const home = state.teams.find((t) => t.id === game.homeId)!
    const away = state.teams.find((t) => t.id === game.awayId)!
    const isHome = game.homeId === state.userTeamId

    const result = simulateGame(game, home, away, {
      homeLineup: isHome ? state.lineup : undefined,
      awayLineup: !isHome ? state.lineup : undefined,
      homeRotationIndex: isHome ? state.rotationIndex : undefined,
      awayRotationIndex: !isHome ? state.rotationIndex : undefined,
    })

    const applied = applyResult(state.teams, state.schedule, result)
    const fatigueTeams = applied.teams.map((t) => {
      if (t.id !== state.userTeamId) return t
      return {
        ...t,
        players: t.players.map((p) => ({
          ...p,
          fatigue: Math.min(100, p.fatigue + (p.role === 'SP' ? 18 : 6)),
        })),
      }
    })

    setState({
      ...state,
      teams: fatigueTeams,
      schedule: applied.schedule,
      results: [...state.results, result],
      rotationIndex: state.rotationIndex + 1,
    })
    setLastResult(result)
    return result
  }, [state])

  const advanceWeek = useCallback(() => {
    setState((s) => {
      if (!s || s.phase !== 'regular' || s.currentWeek >= s.totalWeeks) return s

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

      return {
        ...interim,
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
            ? { ...t, coaches: t.coaches.filter((c) => c.id !== coachId) }
            : t,
        ),
      }
    })
    return ok
  }, [])

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

  const clearLastResult = useCallback(() => setLastResult(null), [])

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
    playUserGame,
    advanceWeek,
    lastResult,
    clearLastResult,
    upcomingGame,
    buyPlayer,
    releasePlayer,
    promotePlayer,
    demotePlayer,
    hireCoach,
    fireCoach,
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
