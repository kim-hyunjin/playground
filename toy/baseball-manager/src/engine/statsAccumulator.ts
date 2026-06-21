import type {
  AtBatOutcome,
  BatterGameLine,
  BatterStats,
  GameBoxScore,
  PitcherGameLine,
  PitcherStats,
  Player,
} from '../types/game'
import { emptyBatterGameLine, emptyBatterStats, emptyPitcherGameLine, emptyPitcherStats } from '../types/game'
import { awardXpFromGameLine, defaultPotentialForPlayer } from './playerDevelopment'

function getBatterLine(box: GameBoxScore, id: string): BatterGameLine {
  if (!box.batters[id]) box.batters[id] = emptyBatterGameLine()
  return box.batters[id]!
}

function getPitcherLine(box: GameBoxScore, id: string, gs = false): PitcherGameLine {
  if (!box.pitchers[id]) box.pitchers[id] = emptyPitcherGameLine(gs)
  return box.pitchers[id]!
}

export function recordPlateAppearance(
  box: GameBoxScore,
  batterId: string,
  pitcherId: string,
  outcome: AtBatOutcome,
  rbi: number,
  pitcherGs: boolean,
) {
  const b = getBatterLine(box, batterId)
  const p = getPitcherLine(box, pitcherId, pitcherGs)

  b.pa++
  p.bf++

  if (outcome === 'walk') {
    b.bb++
  } else if (outcome === 'strikeout') {
    b.ab++
    b.k++
    p.outs++
  } else if (outcome === 'out' || outcome === 'sacrifice') {
    b.ab++
    p.outs++
  } else if (outcome === 'error') {
    b.ab++
  } else {
    b.ab++
    b.hits++
    p.h++

    if (outcome === 'single') b.singles++
    else if (outcome === 'double') b.doubles++
    else if (outcome === 'triple') b.triples++
    else if (outcome === 'homerun') {
      b.hr++
      p.hr++
    }
  }

  b.rbi += rbi
  if (outcome === 'homerun') b.runs++
}

export function recordRunsScored(box: GameBoxScore, batterId: string, runs: number, outcome: AtBatOutcome) {
  if (runs <= 0 || outcome === 'homerun') return
  const b = getBatterLine(box, batterId)
  b.runs += runs
}

export function recordPitcherRuns(box: GameBoxScore, pitcherId: string, runs: number) {
  const p = getPitcherLine(box, pitcherId)
  p.r += runs
  p.er += runs
}

export function mergeBatterLine(season: BatterStats, game: BatterGameLine, played: boolean) {
  return {
    ...season,
    games: season.games + (played ? 1 : 0),
    pa: season.pa + game.pa,
    ab: season.ab + game.ab,
    hits: season.hits + game.hits,
    singles: season.singles + game.singles,
    doubles: season.doubles + game.doubles,
    triples: season.triples + game.triples,
    hr: season.hr + game.hr,
    bb: season.bb + game.bb,
    hbp: season.hbp + game.hbp,
    k: season.k + game.k,
    rbi: season.rbi + game.rbi,
    runs: season.runs + game.runs,
    sb: season.sb + game.sb,
  }
}

export function mergePitcherLine(season: PitcherStats, game: PitcherGameLine, played: boolean) {
  return {
    ...season,
    games: season.games + (played ? 1 : 0),
    gs: season.gs + (game.gs && played ? 1 : 0),
    outs: season.outs + game.outs,
    h: season.h + game.h,
    r: season.r + game.r,
    er: season.er + game.er,
    bb: season.bb + game.bb,
    hbp: season.hbp + game.hbp,
    k: season.k + game.k,
    hr: season.hr + game.hr,
    bf: season.bf + game.bf,
    saves: season.saves + (game.saves ?? 0),
  }
}

export function applyBoxScoreToPlayers(
  players: Player[],
  box: GameBoxScore,
  teamWon: boolean,
  teamLost: boolean,
  starterId: string,
): Player[] {
  return applyBoxScoreToPlayersInternal(players, box, teamWon, teamLost, starterId, 'first')
}

export function applyFarmBoxScoreToPlayers(
  players: Player[],
  box: GameBoxScore,
  teamWon: boolean,
  teamLost: boolean,
  starterId: string,
): Player[] {
  return applyBoxScoreToPlayersInternal(players, box, teamWon, teamLost, starterId, 'farm')
}

function applyBoxScoreToPlayersInternal(
  players: Player[],
  box: GameBoxScore,
  teamWon: boolean,
  teamLost: boolean,
  starterId: string,
  target: 'first' | 'farm',
): Player[] {
  const starterW = teamWon
  const starterL = teamLost
  const statsKey = target === 'farm' ? 'farmSeasonStats' : 'seasonStats'

  return players.map((p) => {
    const bat = box.batters[p.id]
    const pit = box.pitchers[p.id]
    const seasonStats = p[statsKey]

    if (bat && seasonStats.type === 'batter') {
      const withStats = {
        ...p,
        [statsKey]: mergeBatterLine(seasonStats, bat, bat.pa > 0),
      }
      return awardXpFromGameLine(withStats, bat, undefined, target)
    }

    if (pit && seasonStats.type === 'pitcher') {
      let stats = mergePitcherLine(seasonStats, pit, pit.bf > 0)
      if (p.id === starterId && starterW) stats = { ...stats, wins: stats.wins + 1 }
      if (p.id === starterId && starterL) stats = { ...stats, losses: stats.losses + 1 }
      const withStats = { ...p, [statsKey]: stats }
      return awardXpFromGameLine(withStats, undefined, pit, target)
    }

    return p
  })
}

export function migratePlayerStats(player: Player): Player {
  const s = player.seasonStats as BatterStats | PitcherStats & Record<string, unknown>

  if (s.type === 'batter') {
    const legacy = s as BatterStats & { avg?: number }
    if ('singles' in legacy && legacy.singles !== undefined) return player

    const hits = legacy.hits ?? 0
    const hr = legacy.hr ?? 0
    const ab = legacy.ab ?? 0
    const singles = Math.max(0, hits - hr)

    return {
      ...player,
      seasonStats: {
        ...emptyBatterStats(),
        games: legacy.games ?? 0,
        pa: ab + ((legacy as { bb?: number }).bb ?? 0),
        ab,
        hits,
        singles,
        doubles: 0,
        triples: 0,
        hr,
        bb: 0,
        hbp: 0,
        k: 0,
        rbi: legacy.rbi ?? 0,
        runs: 0,
        sb: 0,
      },
    }
  }

  if (s.type === 'pitcher') {
    const legacy = s as PitcherStats & { ip?: number; strikeouts?: number; era?: number }
    if ('outs' in legacy && legacy.outs !== undefined) return player

    const ip = legacy.ip ?? 0
    return {
      ...player,
      seasonStats: {
        ...emptyPitcherStats(),
        games: legacy.games ?? 0,
        gs: legacy.games ?? 0,
        outs: Math.round(ip * 3),
        wins: legacy.wins ?? 0,
        losses: legacy.losses ?? 0,
        saves: 0,
        h: 0,
        r: 0,
        er: 0,
        bb: 0,
        hbp: 0,
        k: legacy.strikeouts ?? 0,
        hr: 0,
        bf: 0,
      },
    }
  }

  return player
}

export function ensurePlayerRosterFields(player: Player): Player {
  const migrated = migratePlayerStats(player)
  const isPitcherRole = migrated.role === 'SP' || migrated.role === 'RP'
  return {
    ...migrated,
    rosterLevel: migrated.rosterLevel ?? 'first',
    potential: migrated.potential ?? defaultPotentialForPlayer(migrated),
    developmentXp: migrated.developmentXp ?? 0,
    farmSeasonStats:
      migrated.farmSeasonStats ??
      (isPitcherRole ? emptyPitcherStats() : emptyBatterStats()),
  }
}
