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
import {
  defaultLineup,
  defaultRotation,
  generateLeague,
} from '../engine/generator'
import { generateSchedule, nextUserGame } from '../engine/schedule'
import { applyResult, simulateCpuGames, simulateGame } from '../engine/simulation'
import { migratePlayerStats } from '../engine/statsAccumulator'

const STORAGE_KEY = 'baseball-manager:v2'
const LEGACY_KEY = 'baseball-manager:v1'

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
  focusedPlayerId: string | null
  openPlayer: (playerId: string) => void
  closePlayer: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

function createInitialState(teamIndex: number, managerName: string): GameState {
  const teams = generateLeague(teamIndex)
  const userTeam = teams[teamIndex]!
  const totalWeeks = 18

  return {
    version: 2,
    userTeamId: userTeam.id,
    teams,
    schedule: generateSchedule(teams, totalWeeks),
    currentWeek: 1,
    totalWeeks,
    lineup: defaultLineup(userTeam),
    rotation: defaultRotation(userTeam),
    rotationIndex: 0,
    results: [],
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

function migrateState(raw: unknown): GameState | null {
  if (!raw || typeof raw !== 'object') return null
  const s = raw as GameState & { version?: number }

  const teams = (s.teams ?? []).map((t) => ({
    ...t,
    players: t.players.map(migratePlayerStats),
  }))

  const results = (s.results ?? []).map(migrateResult)

  return {
    ...s,
    version: 2,
    teams,
    results,
  } as GameState
}

function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const migrated = migrateState(JSON.parse(raw))
    if (migrated && !localStorage.getItem(STORAGE_KEY)) {
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
    localStorage.removeItem(LEGACY_KEY)
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
    if (!state) return null
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
      if (!s || s.currentWeek >= s.totalWeeks) return s

      const { teams, schedule, results } = simulateCpuGames(
        s.schedule,
        s.teams,
        s.currentWeek,
        s.userTeamId,
      )

      const recovered = teams.map((t) => ({
        ...t,
        players: t.players.map((p) => ({
          ...p,
          fatigue: Math.max(0, p.fatigue - (t.id === s.userTeamId ? 12 : 8)),
        })),
      }))

      return {
        ...s,
        teams: recovered,
        schedule,
        results: [...s.results, ...results],
        currentWeek: s.currentWeek + 1,
      }
    })
  }, [])

  const buyPlayer = useCallback((player: Player, fromTeamId: string): boolean => {
    if (!state || !userTeam) return false
    if (userTeam.budget < player.salary) return false
    if (userTeam.players.length >= 28) return false

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
          players: [...t.players, { ...player, morale: Math.min(99, player.morale + 5) }],
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
