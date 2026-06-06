import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

interface DataItem {
    name: string
    value: number
}

const BarChart: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [data, setData] = useState<DataItem[]>([
        { name: 'A', value: 30 },
        { name: 'B', value: 80 },
        { name: 'C', value: 45 },
        { name: 'D', value: 60 },
        { name: 'E', value: 20 },
        { name: 'F', value: 90 },
        { name: 'G', value: 55 },
    ])

    const randomizeData = () => {
        const newData = data.map((d) => ({
            ...d,
            value: Math.floor(Math.random() * 90) + 10,
        }))
        setData(newData)
    }

    useEffect(() => {
        if (!svgRef.current) return

        const width = 600
        const height = 400
        const margin = { top: 20, right: 30, bottom: 40, left: 40 }

        // 1. SVG 컨테이너 설정: ViewBox를 사용하여 반응형 대응 가능하게 설정
        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('overflow', 'visible')

        // 2. 스케일(Scales) 설정: 데이터를 화면상의 좌표(픽셀)로 변환
        // scaleBand: 막대 차트와 같은 이산형 데이터를 일정한 너비로 배치할 때 사용
        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.2)

        // scaleLinear: 연속적인 숫자 데이터를 변환 (값 0~100을 y축 높이로 변환)
        const y = d3
            .scaleLinear()
            .domain([0, 100])
            .nice() // 축의 시작과 끝을 깔끔한 숫자(예: 0, 100)로 올림/내림 처리
            .range([height - margin.bottom, margin.top])

        // 3. 축(Axes) 생성 함수
        const xAxis = (
            g: d3.Selection<SVGGElement, unknown, null, undefined>
        ) =>
            g
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickSizeOuter(0))

        const yAxis = (
            g: d3.Selection<SVGGElement, unknown, null, undefined>
        ) =>
            g
                .attr('transform', `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))

        // 기존 축을 제거하고 새로 생성 (업데이트 로직 단순화)
        svg.select('.x-axis').remove()
        svg.select('.y-axis').remove()
        svg.append('g').attr('class', 'x-axis').call(xAxis)
        svg.append('g').attr('class', 'y-axis').call(yAxis)

        // 4. 데이터 바인딩 (Data Join)
        // .selectAll() -> .data() -> .join()의 흐름이 D3의 핵심
        const bars = svg
            .selectAll<SVGRectElement, DataItem>('.bar')
            .data(data, (d) => d.name) // 두 번째 인자는 Key 함수로, 데이터 갱신 시 항목 식별을 도움

        // 5. Exit: 데이터에서 사라진 항목 처리 (이 예제에서는 데이터 개수가 고정이라 생략 가능하지만 패턴상 유지)
        bars.exit().remove()

        // 6. Enter + Update: 새로 생성된 항목과 기존 항목의 상태를 업데이트
        bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', '#3b82f6')
            .attr('x', (d: DataItem) => x(d.name) || 0)
            .attr('y', y(0)) // 애니메이션 시작점: 바닥에서 시작
            .attr('width', x.bandwidth())
            .attr('height', 0)
            .merge(bars) // Enter와 Update 선택물을 합침
            .transition() // 애니메이션 시작
            .duration(750) // 0.75초 동안 진행
            .ease(d3.easeCubicInOut) // 부드러운 가감속 효과
            .attr('x', (d: DataItem) => x(d.name) || 0)
            .attr('y', (d: DataItem) => y(d.value)) // 목표 y 좌표
            .attr('width', x.bandwidth())
            .attr('height', (d: DataItem) => y(0) - y(d.value)) // 목표 높이
    }, [data])

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    동적 막대 차트 (Dynamic Bar Chart)
                </h2>
                <button
                    onClick={randomizeData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    데이터 변경
                </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
                D3의 Transition 기능을 사용하여 데이터 변경 시 부드러운
                애니메이션을 보여줍니다. 프로젝트의 실시간 모니터링 대시보드에서
                데이터 변화를 직관적으로 전달할 때 유용합니다.
            </p>
            <div className="w-full h-[400px]">
                <svg ref={svgRef} className="w-full h-full"></svg>
            </div>
        </div>
    )
}

export default BarChart
