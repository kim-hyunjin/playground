import React from 'react'
import { Layout, Palette, Zap, MousePointer2 } from 'lucide-react'

const DashboardHome: React.FC = () => {
    const features = [
        {
            title: '강력한 데이터 바인딩',
            desc: '데이터와 DOM 요소를 직접 연결하여 선언적으로 시각화를 구현합니다.',
            icon: <Zap className="text-yellow-500" />,
        },
        {
            title: '정교한 애니메이션',
            desc: 'D3 Transitions를 사용해 복잡한 상태 변화를 부드럽게 표현합니다.',
            icon: <Palette className="text-pink-500" />,
        },
        {
            title: '자유로운 커스텀',
            desc: '정해진 틀 없이 SVG와 HTML 요소를 자유자재로 다룰 수 있습니다.',
            icon: <Layout className="text-blue-500" />,
        },
        {
            title: '인터랙션 구현',
            desc: '줌, 드래그, 브러싱 등 고차원적인 사용자 경험을 제공합니다.',
            icon: <MousePointer2 className="text-green-500" />,
        },
    ]

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    D3.js & React 시각화 쇼케이스
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                    프로젝트에서 단순한 차트 라이브러리(Chart.js 등)만으로는
                    해결하기 어려운
                    <strong>"커스텀 요구사항"</strong>과{' '}
                    <strong>"복잡한 데이터 관계"</strong>를 해결하기 위한 D3.js
                    활용 예제입니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="mb-4">{f.icon}</div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            {f.title}
                        </h3>
                        <p className="text-sm text-gray-600">{f.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl">
                <h2 className="text-xl font-bold text-blue-900 mb-4">
                    왜 D3.js인가?
                </h2>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                    <li>
                        표준 SVG/Canvas 기반으로 모바일/웹 어디서나 선명합니다.
                    </li>
                    <li>
                        수천 개의 데이터 포인트도 효율적으로 렌더링할 수 있는
                        수학적 도구를 제공합니다.
                    </li>
                    <li>
                        특정 벤더에 종속되지 않는 영속적인 시각화 솔루션입니다.
                    </li>
                    <li>
                        프로젝트의 핵심인 '차별화된 UI/UX'를 가능하게 합니다.
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default DashboardHome
