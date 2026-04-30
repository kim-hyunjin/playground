import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface OHLCData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const MIN_VISIBLE = 10;  // 최대 확대
const MAX_VISIBLE = 200; // 최대 축소
const INITIAL_VISIBLE = 40;

// 데이터 생성 함수를 컴포넌트 외부로 이동 (re-render 방지 및 초기화 사용 가능)
const generateMoreData = (baseDate: Date, count: number, startPrice: number) => {
  let currentPrice = startPrice;
  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);

  return Array.from({ length: count }, (_, i) => {
    const open = currentPrice + (Math.random() - 0.5) * 10;
    const close = open + (Math.random() - 0.5) * 15;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    const volume = Math.floor(Math.random() * 1000) + 500;
    currentPrice = close;
    
    const date = new Date(start);
    date.setDate(date.getDate() - (i + 1));
    return { date, open, high, low, close, volume };
  }).reverse();
};

const TradingChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // 1. 상태 관리
  const [fullData, setFullData] = useState<OHLCData[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return generateMoreData(today, 100, 150);
  });
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE); // 줌 레벨 (보이는 봉 개수)
  const [viewOffset, setViewOffset] = useState(() => fullData.length - INITIAL_VISIBLE); 
  const [hoverData, setHoverData] = useState<OHLCData | null>(null);
  const isLoading = useRef(false);

  useEffect(() => {
    if (!svgRef.current || fullData.length === 0) return;

    // 현재 화면에 보여줄 데이터 슬라이스
    const startIndex = Math.max(0, Math.min(viewOffset, fullData.length - visibleCount));
    const data = fullData.slice(startIndex, startIndex + visibleCount);

    const width = 900;
    const height = 500;
    const margin = { top: 30, right: 60, bottom: 80, left: 40 };
    const volumeHeight = 80;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');

    svg.selectAll('*').remove();

    // 스케일 설정
    const x = d3.scaleBand()
      .domain(data.map(d => d.date.toISOString()))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.low)! * 0.98, d3.max(data, d => d.high)! * 1.02])
      .range([height - margin.bottom - volumeHeight - 20, margin.top]);

    const yVolume = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.volume)!])
      .range([height - margin.bottom, height - margin.bottom - volumeHeight]);

    // 축 렌더링
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)
        .tickFormat(d => d3.timeFormat('%m/%d')(new Date(d)))
        .tickValues(x.domain().filter((_, i) => i % Math.max(1, Math.floor(visibleCount / 8)) === 0)))
      .attr('color', '#94a3b8');

    svg.append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(d3.axisRight(y))
      .attr('color', '#94a3b8');

    // 캔들스틱 렌더링
    const candles = svg.append('g')
      .selectAll<SVGGElement, OHLCData>('g')
      .data(data, (d) => d.date.toISOString())
      .join('g');

    candles.append('line')
      .attr('x1', d => (x(d.date.toISOString()) || 0) + x.bandwidth() / 2)
      .attr('x2', d => (x(d.date.toISOString()) || 0) + x.bandwidth() / 2)
      .attr('y1', d => y(d.high))
      .attr('y2', d => y(d.low))
      .attr('stroke', d => d.close > d.open ? '#ef4444' : '#3b82f6');

    candles.append('rect')
      .attr('x', d => x(d.date.toISOString()) || 0)
      .attr('y', d => y(Math.max(d.open, d.close)))
      .attr('width', x.bandwidth())
      .attr('height', d => Math.abs(y(d.open) - y(d.close)) || 1)
      .attr('fill', d => d.close > d.open ? '#ef4444' : '#3b82f6');

    // 거래량 렌더링
    svg.append('g')
      .selectAll<SVGRectElement, OHLCData>('rect')
      .data(data, (d) => d.date.toISOString())
      .join('rect')
      .attr('x', d => x(d.date.toISOString()) || 0)
      .attr('y', d => yVolume(d.volume))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.bottom - yVolume(d.volume))
      .attr('fill', '#e2e8f0');

    // 인터랙션: 크로스헤어
    const crosshair = svg.append('g').style('display', 'none');
    crosshair.append('line').attr('class', 'h-line').attr('stroke', '#64748b').attr('stroke-width', 1).attr('stroke-dasharray', '3,3').attr('x1', margin.left).attr('x2', width - margin.right);
    crosshair.append('line').attr('class', 'v-line').attr('stroke', '#64748b').attr('stroke-width', 1).attr('stroke-dasharray', '3,3').attr('y1', margin.top).attr('y2', height - margin.bottom);

    // 드래그 기능 구현
    let dragStartPos: number | null = null;
    let initialOffset = viewOffset;

    const dragBehavior = d3.drag<SVGRectElement, unknown>()
      .on('start', (event) => {
        dragStartPos = event.x;
        initialOffset = viewOffset;
        svg.style('cursor', 'grabbing');
      })
      .on('drag', (event) => {
        if (dragStartPos === null) return;
        
        const dx = event.x - dragStartPos;
        const bandWidth = x.step();
        const moveIndex = Math.round(dx / bandWidth);
        const newOffset = initialOffset - moveIndex;
        
        // 1. 오프셋 범위 제한 (0 미만으로 내려가지 않도록 일단 제한)
        const clampedOffset = Math.max(-10, Math.min(fullData.length - visibleCount, newOffset));

        if (clampedOffset !== viewOffset) {
          // 2. 왼쪽 끝 도달 시 과거 데이터 로드
          if (clampedOffset <= 0 && !isLoading.current) {
            isLoading.current = true;
            
            const oldestDate = fullData[0].date;
            const newData = generateMoreData(oldestDate, 30, fullData[0].open);
            
            setFullData(prev => {
              const oldestTs = prev[0].date.getTime();
              // 타임스탬프 기준 중복 제거 (필수)
              const uniqueNew = newData.filter(d => d.date.getTime() < oldestTs);
              
              if (uniqueNew.length > 0) {
                const addedCount = uniqueNew.length;
                // 드래그 중인 기준점들도 함께 이동시켜서 튀는 현상 방지
                initialOffset += addedCount;
                setViewOffset(v => v + addedCount);
                return [...uniqueNew, ...prev];
              }
              return prev;
            });
            
            setTimeout(() => { isLoading.current = false; }, 200);
          } else if (clampedOffset > 0) {
            setViewOffset(clampedOffset);
          }
        }
      })
      .on('end', () => {
        dragStartPos = null;
        svg.style('cursor', 'crosshair');
        // 드래그 종료 시 오프셋 최종 보정
        setViewOffset(prev => Math.max(0, Math.min(fullData.length - visibleCount, prev)));
      });

    // 휠 줌 기능 구현 (오프셋 보정 강화)
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY;
      const zoomSpeed = Math.max(1, Math.floor(visibleCount / 15));
      
      setVisibleCount(prev => {
        const next = delta > 0 ? prev + zoomSpeed : prev - zoomSpeed;
        const clamped = Math.max(MIN_VISIBLE, Math.min(MAX_VISIBLE, next));
        
        if (clamped !== prev) {
          // 확대/축소 시 보고 있는 위치가 튀지 않도록 오프셋을 절반만큼 조절
          const diff = clamped - prev;
          setViewOffset(off => {
            const newOff = off - Math.floor(diff / 2);
            return Math.max(0, Math.min(fullData.length - clamped, newOff));
          });
        }
        return clamped;
      });
    };

    const overlay = svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .call(dragBehavior);

    const svgElement = svgRef.current;
    if (svgElement) {
      svgElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    overlay
      .on('mouseover', () => crosshair.style('display', null))
      .on('mouseout', () => {
        crosshair.style('display', 'none');
        setHoverData(null);
      })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const eachBand = x.step();
        const index = Math.floor((mx - margin.left) / eachBand);
        const d = data[index];

        if (d && mx >= margin.left && mx <= width - margin.right) {
          const cx = (x(d.date.toISOString()) || 0) + x.bandwidth() / 2;
          const cy = y(d.close);
          crosshair.select('.h-line').attr('y1', cy).attr('y2', cy);
          crosshair.select('.v-line').attr('x1', cx).attr('x2', cx);
          setHoverData(d);
        }
      });

    return () => {
      if (svgElement) {
        svgElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [fullData, viewOffset, visibleCount]);

  return (
    <div ref={containerRef} className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 select-none">
      {/* 헤더 영역의 높이를 h-20으로 고정하여 데이터 표시 여부에 관계없이 레이아웃 유지 */}
      <div className="flex justify-between items-start mb-6 h-20">
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">거래소 차트 (드래그 & 줌)</h2>
          <p className="text-sm text-gray-500 mt-1">드래그로 이동, 휠로 확대/축소가 가능합니다.</p>
        </div>
        
        {/* 호버 데이터 박스: 레이아웃 변화를 막기 위해 내부에서만 조건부 렌더링 */}
        <div className="flex-grow flex justify-end">
          {hoverData ? (
            <div className="flex gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs animate-in fade-in duration-200">
              <div><span className="text-gray-400 block uppercase">Date</span><span className="font-bold text-slate-700">{d3.timeFormat('%Y-%m-%d')(hoverData.date)}</span></div>
              <div><span className="text-gray-400 block uppercase">Open</span><span className="font-bold text-slate-700">{hoverData.open.toFixed(2)}</span></div>
              <div><span className="text-gray-400 block uppercase">High</span><span className="font-bold text-red-500">{hoverData.high.toFixed(2)}</span></div>
              <div><span className="text-gray-400 block uppercase">Low</span><span className="font-bold text-blue-500">{hoverData.low.toFixed(2)}</span></div>
              <div><span className="text-gray-400 block uppercase">Close</span><span className="font-bold text-slate-700">{hoverData.close.toFixed(2)}</span></div>
            </div>
          ) : (
            /* 데이터가 없을 때도 공간을 유지하고 싶다면 투명한 박스나 안내 문구 배치 가능 */
            <div className="text-xs text-gray-300 self-center">차트에 마우스를 올려 상세 시세를 확인하세요</div>
          )}
        </div>
      </div>

      <div className="w-full h-[500px] relative">
        <svg ref={svgRef} className="w-full h-full font-sans"></svg>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 p-4 rounded-xl text-slate-600 leading-relaxed">
          <strong>🖱️ 조작 방법:</strong><br/>
          • 좌우 드래그: 과거 데이터 탐색<br/>
          • 마우스 휠: 차트 확대/축소 (줌)<br/>
          • 마우스 오버: 상세 시세 확인
        </div>
        <div className="bg-blue-50 p-4 rounded-xl text-blue-800 leading-relaxed">
          <strong>💡 D3.js 핵심:</strong><br/>
          • <code>wheel</code> 이벤트를 통해 <code>visibleCount</code> 조절<br/>
          • 줌 레벨에 따른 X축 틱 간격 자동 최적화<br/>
          • 확대 시에도 현재 위치를 유지하는 오프셋 보정
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
