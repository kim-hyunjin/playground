import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface DataNode {
    name: string
    value?: number
    children?: DataNode[]
}

const Treemap: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    useEffect(() => {
        if (!svgRef.current) return

        const data: DataNode = {
            name: 'root',
            children: [
                {
                    name: '개발본부',
                    children: [
                        { name: 'Frontend', value: 450 },
                        { name: 'Backend', value: 380 },
                        { name: 'DevOps', value: 120 },
                    ],
                },
                {
                    name: '영업본부',
                    children: [
                        { name: '수도권', value: 300 },
                        { name: '영남', value: 150 },
                        { name: '호남', value: 100 },
                    ],
                },
                {
                    name: '디자인팀',
                    children: [
                        { name: 'UI', value: 200 },
                        { name: 'UX', value: 150 },
                    ],
                },
                {
                    name: '기획팀',
                    value: 200,
                },
            ],
        }

        const width = 800
        const height = 500

        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('overflow', 'visible')

        svg.selectAll('*').remove()

        // 1. 계층 구조 생성 (Hierarchy)
        // d3.hierarchy는 중첩된 JSON 데이터를 D3가 다루기 쉬운 계층 구조 객체로 변환
        const root = d3
            .hierarchy(data)
            .sum((d) => d.value || 0) // 각 노드의 값을 계산 (자식 노드들의 합)
            .sort((a, b) => (b.value || 0) - (a.value || 0)) // 크기순으로 정렬

        // 2. 트리맵 레이아웃 설정
        const treemapLayout = d3
            .treemap<DataNode>()
            .size([width, height]) // 레이아웃이 차지할 전체 크기
            .paddingOuter(4) // 부모 노드 테두리 패딩
            .paddingInner(2) // 자식 노드 간의 간격
            .round(true) // 픽셀 값을 반올림하여 선명하게 렌더링

        // 레이아웃 엔진 실행: root 객체의 각 노드에 x0, y0, x1, y1 좌표가 추가됨
        treemapLayout(root)

        const color = d3.scaleOrdinal(d3.schemeTableau10)

        // 3. 노드 렌더링
        const nodes = svg
            .selectAll('g')
            // root.leaves()는 자식이 없는 최하단 노드들(실제 데이터가 있는 곳)만 반환
            .data(root.leaves() as d3.HierarchyRectangularNode<DataNode>[])
            .join('g')
            .attr('transform', (d) => `translate(${d.x0},${d.y0})`)

        nodes
            .append('rect')
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('fill', (d) => color(d.parent?.data.name || 'root')) // 부모 카테고리별로 색상 지정
            .attr('opacity', 0.8)
            .attr('rx', 2)

        // 4. 텍스트 라벨 추가
        nodes
            .append('text')
            .selectAll('tspan')
            // 이름과 값을 줄바꿈해서 보여주기 위해 tspan 사용
            .data((d) => [d.data.name, d.value?.toString() || ''])
            .join('tspan')
            .attr('x', 5)
            .attr('y', (_, i) => 15 + i * 15)
            .text((d) => d)
            .attr('fill', 'white')
            .style('font-size', '12px')
            .style('font-weight', (_, i) => (i === 0 ? '600' : '400'))
    }, [])

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
                트리맵 (Treemap)
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                계층 구조의 데이터를 면적을 통해 표현합니다. 한정된 공간 안에
                많은 정보를 밀도 있게 보여주며, 전체 대비 각 항목의 비중을
                한눈에 파악하기 좋습니다. 파일 시스템 사용량, 예산 배분 시각화
                등에 자주 활용됩니다.
            </p>
            <div className="w-full h-[500px] border border-gray-100 rounded-lg overflow-hidden">
                <svg ref={svgRef} className="w-full h-full"></svg>
            </div>
        </div>
    )
}

export default Treemap
