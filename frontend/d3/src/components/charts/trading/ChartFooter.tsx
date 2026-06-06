import React from 'react'

const ChartFooter: React.FC = () => {
    return (
        <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl text-slate-600 leading-relaxed">
                <strong>🖱️ 조작 방법:</strong>
                <br />
                • 좌우 드래그: 과거 데이터 탐색
                <br />
                • 마우스 휠: 차트 확대/축소 (줌)
                <br />• 마우스 오버: 상세 시세 확인
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 leading-relaxed">
                <strong>💡 D3.js 핵심:</strong>
                <br />• <code>wheel</code> 이벤트를 통해{' '}
                <code>visibleCount</code> 조절
                <br />
                • 줌 레벨에 따른 X축 틱 간격 자동 최적화
                <br />• 확대 시에도 현재 위치를 유지하는 오프셋 보정
            </div>
        </div>
    )
}

export default ChartFooter
