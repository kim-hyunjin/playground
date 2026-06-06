import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export interface ForceNode extends d3.SimulationNodeDatum {
    id: string
    group: number
}

export interface ForceLink extends d3.SimulationLinkDatum<ForceNode> {
    value: number
}

interface ForceGraphProps {
    nodes?: ForceNode[]
    links?: ForceLink[]
    width?: number
    height?: number
}

const DEFAULT_NODES: ForceNode[] = [
    { id: 'Server 1', group: 1 },
    { id: 'Server 2', group: 1 },
    { id: 'DB 1', group: 2 },
    { id: 'DB 2', group: 2 },
    { id: 'Client A', group: 3 },
    { id: 'Client B', group: 3 },
    { id: 'Gateway', group: 4 },
]

const DEFAULT_LINKS: ForceLink[] = [
    { source: 'Gateway', target: 'Server 1', value: 1 },
    { source: 'Gateway', target: 'Server 2', value: 1 },
    { source: 'Server 1', target: 'DB 1', value: 2 },
    { source: 'Server 2', target: 'DB 2', value: 2 },
    { source: 'Client A', target: 'Gateway', value: 1 },
    { source: 'Client B', target: 'Gateway', value: 1 },
    { source: 'Server 1', target: 'Server 2', value: 3 },
]

/**
 * 시뮬레이션 설정 (Force Simulation)
 * d3-force를 사용하여 노드에 물리 엔진을 적용합니다.
 */
const initSimulation = (
    nodes: ForceNode[],
    links: ForceLink[],
    width: number,
    height: number
) => {
    // 1. 시뮬레이션 설정 (Force Simulation)
    // d3-force를 사용하여 노드에 물리 엔진을 적용
    return (
        d3
            .forceSimulation<ForceNode>(nodes)
            // 연결선 힘: 노드 간 거리를 유지
            .force(
                'link',
                d3
                    .forceLink<ForceNode, ForceLink>(links)
                    .id((d) => d.id)
                    .distance(100)
            )
            // 만유인력(전하): 노드 간에 서로 밀어내는 힘 (마이너스 값은 척력)
            .force('charge', d3.forceManyBody().strength(-300))
            // 중앙 집중 힘: 시뮬레이션의 중심을 화면 중앙으로 설정
            .force('center', d3.forceCenter(width / 2, height / 2))
    )
}

/**
 * 연결선(Links) 그리기
 * 노드 사이의 관계를 선으로 시각화합니다.
 */
const drawLinks = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    links: ForceLink[]
) => {
    // 2. 연결선(Links) 그리기
    return svg
        .append('g')
        .attr('class', 'links-group')
        .attr('stroke', '#94a3b8')
        .attr('stroke-opacity', 0.6)
        .selectAll<SVGLineElement, ForceLink>('line')
        .data(links)
        .join('line')
        .attr('stroke-width', (d) => Math.sqrt(d.value) * 2)
}

/**
 * 드래그 이벤트 핸들러 구현
 * 사용자의 마우스/터치 입력에 따라 노드의 위치를 고정하거나 해제합니다.
 */
const createDragBehavior = (
    simulation: d3.Simulation<ForceNode, ForceLink>
) => {
    // 5. 드래그 이벤트 핸들러 구현
    function dragstarted(
        event: d3.D3DragEvent<SVGGElement, ForceNode, ForceNode>
    ) {
        // 드래그 시작 시 시뮬레이션 재가동 (alphaTarget을 높여 에너지를 주입)
        if (!event.active) simulation.alphaTarget(0.3).restart()
        // fx, fy는 고정 좌표(fixed x, y)를 의미
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, ForceNode, ForceNode>) {
        // 마우스 위치에 따라 고정 좌표 업데이트
        event.subject.fx = event.x
        event.subject.fy = event.y
    }

    function dragended(
        event: d3.D3DragEvent<SVGGElement, ForceNode, ForceNode>
    ) {
        // 드래그 종료 시 고정 해제 (null로 설정하면 다시 물리 법칙에 따라 움직임)
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
    }

    return d3
        .drag<SVGGElement, ForceNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
}

/**
 * 노드(Nodes) 그룹 그리기 (원 + 텍스트)
 * 각 데이터를 원과 레이블로 렌더링하고 드래그 동작을 할당합니다.
 */
const drawNodes = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    nodes: ForceNode[],
    simulation: d3.Simulation<ForceNode, ForceLink>
) => {
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    // 3. 노드(Nodes) 그룹 그리기 (원 + 텍스트)
    const nodeGroup = svg
        .append('g')
        .attr('class', 'nodes-group')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll<SVGGElement, ForceNode>('g')
        .data(nodes)
        .join('g')
        .attr('class', 'node-item')
        .call(createDragBehavior(simulation)) // 5. 드래그 이벤트 등록

    nodeGroup
        .append('circle')
        .attr('r', 12)
        .attr('fill', (d) => color(d.group.toString()))

    nodeGroup
        .append('text')
        .text((d) => d.id)
        .attr('x', 15)
        .attr('y', 5)
        .attr('stroke', 'none')
        .attr('fill', '#475569')
        .style('font-size', '12px')
        .style('font-weight', '500')
        .style('pointer-events', 'none')

    return nodeGroup
}

/**
 * 시뮬레이션 틱(Tick) 설정
 * 매 프레임마다 물리 연산 결과를 기반으로 요소들의 좌표를 업데이트합니다.
 */
const setupSimulationTick = (
    simulation: d3.Simulation<ForceNode, ForceLink>,
    link: d3.Selection<SVGLineElement, ForceLink, SVGGElement, unknown>,
    node: d3.Selection<SVGGElement, ForceNode, SVGGElement, unknown>
) => {
    // 4. 시뮬레이션 틱(Tick) 설정
    // 시뮬레이션의 매 프레임마다 노드와 링크의 좌표를 업데이트
    simulation.on('tick', () => {
        link.attr('x1', (d) => (d.source as ForceNode).x ?? 0)
            .attr('y1', (d) => (d.source as ForceNode).y ?? 0)
            .attr('x2', (d) => (d.target as ForceNode).x ?? 0)
            .attr('y2', (d) => (d.target as ForceNode).y ?? 0)

        node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })
}

const ForceGraph: React.FC<ForceGraphProps> = ({
    nodes = DEFAULT_NODES,
    links = DEFAULT_LINKS,
    width = 800,
    height = 500,
}) => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    useEffect(() => {
        if (!svgRef.current) return

        /**
         * 1. 데이터 준비
         * D3 시뮬레이션은 객체를 직접 수정하므로 원본 Props 보호를 위해 딥 카피를 수행합니다.
         */
        const nodesData: ForceNode[] = nodes.map((d) => ({ ...d }))
        const linksData: ForceLink[] = links.map((d) => ({ ...d }))

        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('cursor', 'grab')

        svg.selectAll('*').remove()

        /**
         * 2. 시뮬레이션 초기화
         */
        const simulation = initSimulation(nodesData, linksData, width, height)

        /**
         * 3. 요소 렌더링
         */
        const link = drawLinks(svg, linksData)
        const node = drawNodes(svg, nodesData, simulation)

        /**
         * 4. 인터랙션 및 애니메이션 설정
         */
        setupSimulationTick(simulation, link, node)

        return () => {
            simulation.stop()
        }
    }, [nodes, links, width, height])

    return (
        <div
            className="p-4 bg-white rounded-xl shadow-md"
            data-testid="force-graph-container"
        >
            <h2 className="text-xl font-bold text-gray-800 mb-2">
                포스 디렉티드 그래프 (Force-Directed Graph)
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                물리 시뮬레이션을 통해 노드 간의 관계를 시각화합니다. 네트워크
                토폴로지, 조직도, 인물 관계도 등 복잡하게 얽힌 데이터를
                구조적으로 파악할 때 강력합니다. 노드를 드래그하여 상호작용할 수
                있습니다.
            </p>
            <div className="w-full h-[500px] border border-gray-100 rounded-lg bg-gray-50">
                <svg
                    ref={svgRef}
                    className="w-full h-full"
                    data-testid="force-graph-svg"
                ></svg>
            </div>
        </div>
    )
}

export default ForceGraph
