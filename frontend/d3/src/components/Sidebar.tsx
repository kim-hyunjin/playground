import React from 'react'
import { NavLink } from 'react-router-dom'
import {
    BarChart3,
    LineChart,
    Network,
    LayoutGrid,
    Home,
    CandlestickChart,
} from 'lucide-react'

const Sidebar: React.FC = () => {
    const menuItems = [
        { name: '대시보드 홈', path: '/', icon: <Home size={20} /> },
        {
            name: '거래소 차트',
            path: '/trading',
            icon: <CandlestickChart size={20} />,
        },
        { name: '동적 막대 차트', path: '/bar', icon: <BarChart3 size={20} /> },
        {
            name: '인터랙티브 라인',
            path: '/line',
            icon: <LineChart size={20} />,
        },
        { name: '포스 그래프', path: '/force', icon: <Network size={20} /> },
        { name: '트리맵', path: '/treemap', icon: <LayoutGrid size={20} /> },
    ]

    return (
        <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-400">
                    D3 Showcase
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-800 text-xs text-slate-500">
                © 2026 Gemini CLI D3 Lab
            </div>
        </div>
    )
}

export default Sidebar
