import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DataPoint {
    date: Date
    value: number
}

const LineChart: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!svgRef.current) return

        // 더미 시계열 데이터 생성
        const data: DataPoint[] = Array.from({ length: 30 }, (_, i) => ({
            date: new Date(2024, 0, i + 1),
            value: Math.floor(Math.random() * 50) + 20 + Math.sin(i / 2) * 10,
        }))

        const width = 800
        const height = 400
        const margin = { top: 40, right: 30, bottom: 40, left: 50 }

        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('overflow', 'visible')

        svg.selectAll('*').remove() // 재렌더링 시 기존 요소 제거

        // 1. 시계열 스케일 설정 (scaleTime)
        const x = d3
            .scaleTime()
            .domain(d3.extent(data, (d) => d.date) as [Date, Date])
            .range([margin.left, width - margin.right])

        const y = d3
            .scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top])

        // 2. 라인 생성기 (Line Generator)
        // 데이터 포인트를 이어주는 SVG Path 문자열(d 속성)을 생성
        const line = d3
            .line<DataPoint>()
            .x((d) => x(d.date))
            .y((d) => y(d.value))
            .curve(d3.curveMonotoneX) // 곡선을 부드럽게 처리

        // 3. 축(Axes) 추가
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(
                d3
                    .axisBottom(x)
                    .ticks(width / 80)
                    .tickSizeOuter(0)
            )

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(height / 40))

        // 4. 경로(Path) 렌더링
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#10b981')
            .attr('stroke-width', 2.5)
            .attr('d', line)

        // 5. 인터랙션 요소 (포커스 포인트 및 가이드라인)
        const focus = svg
            .append('g')
            .attr('class', 'focus')
            .style('display', 'none')

        // 수직 가이드라인
        focus
            .append('line')
            .attr('class', 'x-hover-line hover-line')
            .attr('y1', margin.top)
            .attr('y2', height - margin.bottom)
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3')

        // 데이터 포인트 표시 원
        focus
            .append('circle')
            .attr('r', 5)
            .attr('fill', '#10b981')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)

        // 툴팁용 HTML 요소 선택 (CSS 클래스로 스타일링)
        const tooltip = d3
            .select(containerRef.current)
            .append('div')
            .attr(
                'class',
                'absolute bg-white p-2 rounded border border-gray-200 shadow-lg pointer-events-none text-xs'
            )
            .style('opacity', 0)

        // 6. 마우스 위치 추적 로직
        // bisector: 정렬된 배열에서 특정 값의 삽입 위치를 찾아줌 (가장 가까운 데이터 검색용)
        const bisectDate = d3.bisector((d: DataPoint) => d.date).left

        // 인터랙션을 감지할 투명한 사각형 레이어
        svg.append('rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'transparent')
            .on('mouseover', () => {
                focus.style('display', null)
                tooltip.style('opacity', 1)
            })
            .on('mouseout', () => {
                focus.style('display', 'none')
                tooltip.style('opacity', 0)
            })
            .on('mousemove', (event) => {
                // 현재 마우스 좌표를 데이터의 날짜 값으로 역변환(invert)
                const x0 = x.invert(d3.pointer(event)[0])
                // 해당 날짜 근처의 데이터 인덱스 찾기
                const i = bisectDate(data, x0, 1)
                const d0 = data[i - 1]
                const d1 = data[i]
                if (!d0 || !d1) return
                // 마우스와 더 가까운 쪽의 데이터 선택
                const d =
                    x0.getTime() - d0.date.getTime() >
                    d1.date.getTime() - x0.getTime()
                        ? d1
                        : d0

                // 포커스 요소 이동
                focus.attr('transform', `translate(${x(d.date)},0)`)
                focus.select('circle').attr('cy', y(d.value))

                // 툴팁 위치 계산 및 내용 업데이트
                const containerRect =
                    containerRef.current?.getBoundingClientRect()
                if (containerRect) {
                    const tooltipX = (x(d.date) / width) * containerRect.width
                    const tooltipY =
                        (y(d.value) / height) * containerRect.height

                    tooltip
                        .html(
                            `
              <div class="font-bold">${d3.timeFormat('%Y-%m-%d')(d.date)}</div>
              <div class="text-green-600 font-medium">Value: ${d.value.toFixed(1)}</div>
            `
                        )
                        .style('left', `${tooltipX + 15}px`)
                        .style('top', `${tooltipY - 15}px`)
                }
            })

        // 컴포넌트 언마운트 시 툴팁 제거 (Side Effect 방지)
        return () => {
            tooltip.remove()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="p-4 bg-white rounded-xl shadow-md relative"
        >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
                인터랙티브 라인 차트 (Interactive Line Chart)
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                마우스 오버 시 가장 가까운 데이터 포인트를 찾아 툴팁과
                가이드라인을 표시합니다. D3의 `bisector`를 활용한 정밀한
                인터랙션 구현이 가능하여 시계열 데이터 분석에 최적입니다.
            </p>
            <div className="w-full h-[400px]">
                <svg ref={svgRef} className="w-full h-full"></svg>
            </div>
        </div>
    )
}

export default LineChart
