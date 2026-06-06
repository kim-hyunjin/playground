import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DashboardHome from './components/DashboardHome'
import BarChart from './components/charts/BarChart'
import LineChart from './components/charts/LineChart'
import ForceGraph from './components/charts/ForceGraph'
import Treemap from './components/charts/Treemap'
import TradingChart from './components/charts/TradingChart'

function App() {
    return (
        <Router>
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <main className="flex-1 ml-64 p-8">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/trading" element={<TradingChart />} />
                        <Route path="/bar" element={<BarChart />} />
                        <Route path="/line" element={<LineChart />} />
                        <Route path="/force" element={<ForceGraph />} />
                        <Route path="/treemap" element={<Treemap />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
