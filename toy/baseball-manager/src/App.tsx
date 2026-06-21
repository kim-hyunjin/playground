import { GameProvider, useGame } from './store/gameStore'
import { Layout } from './components/Layout'
import { StartScreen } from './pages/StartScreen'
import { DashboardPage } from './pages/DashboardPage'
import { SquadPage } from './pages/SquadPage'
import { FarmSquadPage } from './pages/FarmSquadPage'
import { LineupPage } from './pages/LineupPage'
import { RotationPage } from './pages/RotationPage'
import { MatchPage } from './pages/MatchPage'
import { StandingsPage } from './pages/StandingsPage'
import { TransfersPage } from './pages/TransfersPage'
import { StatsPage } from './pages/StatsPage'

function GameShell() {
  const { state, view } = useGame()

  if (!state) return <StartScreen />

  const pages = {
    dashboard: <DashboardPage />,
    squad: <SquadPage />,
    farm: <FarmSquadPage />,
    lineup: <LineupPage />,
    rotation: <RotationPage />,
    match: <MatchPage />,
    standings: <StandingsPage />,
    transfers: <TransfersPage />,
    stats: <StatsPage />,
  }

  return (
    <Layout>
      {pages[view]}
    </Layout>
  )
}

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  )
}
