import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

const ForceGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;

    const nodes: Node[] = [
      { id: 'Server 1', group: 1 },
      { id: 'Server 2', group: 1 },
      { id: 'DB 1', group: 2 },
      { id: 'DB 2', group: 2 },
      { id: 'Client A', group: 3 },
      { id: 'Client B', group: 3 },
      { id: 'Gateway', group: 4 },
    ];

    const links: Link[] = [
      { source: 'Gateway', target: 'Server 1', value: 1 },
      { source: 'Gateway', target: 'Server 2', value: 1 },
      { source: 'Server 1', target: 'DB 1', value: 2 },
      { source: 'Server 2', target: 'DB 2', value: 2 },
      { source: 'Client A', target: 'Gateway', value: 1 },
      { source: 'Client B', target: 'Gateway', value: 1 },
      { source: 'Server 1', target: 'Server 2', value: 3 },
    ];

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('cursor', 'grab');

    svg.selectAll('*').remove();

    // 1. 시뮬레이션 설정 (Force Simulation)
    // d3-force를 사용하여 노드에 물리 엔진을 적용
    const simulation = d3.forceSimulation<Node>(nodes)
      // 연결선 힘: 노드 간 거리를 유지
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      // 만유인력(전하): 노드 간에 서로 밀어내는 힘 (마이너스 값은 척력)
      .force('charge', d3.forceManyBody().strength(-300))
      // 중앙 집중 힘: 시뮬레이션의 중심을 화면 중앙으로 설정
      .force('center', d3.forceCenter(width / 2, height / 2));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 2. 연결선(Links) 그리기
    const link = svg.append('g')
      .attr('stroke', '#94a3b8')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', d => Math.sqrt(d.value) * 2);

    // 3. 노드(Nodes) 그룹 그리기 (원 + 텍스트)
    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll<SVGGElement, Node>('g')
      .data(nodes)
      .join('g')
      .call(drag(simulation)); // 드래그 이벤트 등록

    node.append('circle')
      .attr('r', 12)
      .attr('fill', d => color(d.group.toString()));

    node.append('text')
      .text(d => d.id)
      .attr('x', 15)
      .attr('y', 5)
      .attr('stroke', 'none')
      .attr('fill', '#475569')
      .style('font-size', '12px')
      .style('font-weight', '500');

    // 4. 시뮬레이션 틱(Tick) 설정
    // 시뮬레이션의 매 프레임마다 노드와 링크의 좌표를 업데이트
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x ?? 0)
        .attr('y1', d => (d.source as Node).y ?? 0)
        .attr('x2', d => (d.target as Node).x ?? 0)
        .attr('y2', d => (d.target as Node).y ?? 0);

      node
        .attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // 5. 드래그 이벤트 핸들러 구현
    function drag(simulation: d3.Simulation<Node, Link>) {
      function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
        // 드래그 시작 시 시뮬레이션 재가동 (alphaTarget을 높여 에너지를 주입)
        if (!event.active) simulation.alphaTarget(0.3).restart();
        // fx, fy는 고정 좌표(fixed x, y)를 의미
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
        // 마우스 위치에 따라 고정 좌표 업데이트
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
        // 드래그 종료 시 고정 해제 (null로 설정하면 다시 물리 법칙에 따라 움직임)
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-2">포스 디렉티드 그래프 (Force-Directed Graph)</h2>
      <p className="text-sm text-gray-600 mb-6">
        물리 시뮬레이션을 통해 노드 간의 관계를 시각화합니다. 
        네트워크 토폴로지, 조직도, 인물 관계도 등 복잡하게 얽힌 데이터를 구조적으로 파악할 때 강력합니다.
        노드를 드래그하여 상호작용할 수 있습니다.
      </p>
      <div className="w-full h-[500px] border border-gray-100 rounded-lg bg-gray-50">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default ForceGraph;
