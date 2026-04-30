import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MIN_VISIBLE, MAX_VISIBLE } from './types';
import type { OHLCData } from './types';

interface RendererProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  fullData: OHLCData[];
  viewOffset: number;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  setViewOffset: React.Dispatch<React.SetStateAction<number>>;
  loadMoreData: () => void;
  setHoverData: (data: OHLCData | null) => void;
  isLoading: React.RefObject<boolean>;
}

const CHART_CONFIG = {
  width: 900,
  height: 500,
  margin: { top: 30, right: 60, bottom: 80, left: 40 },
  volumeHeight: 80,
  pricePadding: 20,
};

interface RenderContext {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  data: OHLCData[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  yVolume: d3.ScaleLinear<number, number>;
}

/**
 * 차트의 X축과 Y축을 업데이트합니다.
 */
const renderAxes = (ctx: RenderContext, visibleCount: number) => {
  const { svg, x, y } = ctx;
  const { height, margin } = CHART_CONFIG;

  svg.select<SVGGElement>('.x-axis')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickFormat(d => d3.timeFormat('%m/%d')(new Date(d)))
      .tickValues(x.domain().filter((_, i) => i % Math.max(1, Math.floor(visibleCount / 8)) === 0)))
    .attr('color', '#94a3b8');

  svg.select<SVGGElement>('.y-axis')
    .attr('transform', `translate(${CHART_CONFIG.width - margin.right},0)`)
    .call(d3.axisRight(y))
    .attr('color', '#94a3b8');
};

/**
 * 캔들스틱을 업데이트합니다.
 */
const renderCandlesticks = (ctx: RenderContext) => {
  const { svg, data, x, y } = ctx;

  const layer = svg.select('.chart-content')
    .selectAll<SVGGElement, string>('g.candles-group')
    .data(['candles'])
    .join('g')
    .attr('class', 'candles-group');

  const candles = layer.selectAll<SVGGElement, OHLCData>('g.candle')
    .data(data, (d) => d.date.toISOString())
    .join(
      enter => {
        const g = enter.append('g').attr('class', 'candle');
        g.append('line').attr('class', 'wick');
        g.append('rect').attr('class', 'body');
        return g;
      }
    );

  candles.select('line.wick')
    .attr('x1', d => (x(d.date.toISOString()) || 0) + x.bandwidth() / 2)
    .attr('x2', d => (x(d.date.toISOString()) || 0) + x.bandwidth() / 2)
    .attr('y1', d => y(d.high))
    .attr('y2', d => y(d.low))
    .attr('stroke', d => d.close > d.open ? '#ef4444' : '#3b82f6');

  candles.select('rect.body')
    .attr('x', d => x(d.date.toISOString()) || 0)
    .attr('y', d => y(Math.max(d.open, d.close)))
    .attr('width', x.bandwidth())
    .attr('height', d => Math.abs(y(d.open) - y(d.close)) || 1)
    .attr('fill', d => d.close > d.open ? '#ef4444' : '#3b82f6');
};

/**
 * 거래량 막대를 업데이트합니다.
 */
const renderVolume = (ctx: RenderContext) => {
  const { svg, data, x, yVolume } = ctx;
  const { height, margin } = CHART_CONFIG;

  const layer = svg.select('.chart-content')
    .selectAll<SVGGElement, string>('g.volume-group')
    .data(['volume'])
    .join('g')
    .attr('class', 'volume-group');

  layer.selectAll<SVGRectElement, OHLCData>('rect.vol-bar')
    .data(data, (d) => d.date.toISOString())
    .join('rect')
    .attr('class', 'vol-bar')
    .attr('x', d => x(d.date.toISOString()) || 0)
    .attr('y', d => yVolume(d.volume))
    .attr('width', x.bandwidth())
    .attr('height', d => height - margin.bottom - yVolume(d.volume))
    .attr('fill', d => d.close > d.open ? '#ef4444' : '#3b82f6')
    .attr('opacity', 0.5);
};

/**
 * 크로스헤어를 업데이트합니다.
 */
const updateCrosshair = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
  const { width, height, margin } = CHART_CONFIG;
  const crosshair = svg.select<SVGGElement>('.crosshair-layer');
  
  if (crosshair.select('line.h-line').empty()) {
    crosshair.append('line')
      .attr('class', 'h-line')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');
      
    crosshair.append('line')
      .attr('class', 'v-line')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');
  }

  crosshair.select('line.h-line')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right);
    
  crosshair.select('line.v-line')
    .attr('y1', margin.top)
    .attr('y2', height - margin.bottom);
    
  return crosshair;
};

interface InteractionProps {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  data: OHLCData[];
  fullData: OHLCData[];
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  setViewOffset: React.Dispatch<React.SetStateAction<number>>;
  loadMoreData: () => void;
  setHoverData: (data: OHLCData | null) => void;
  crosshair: d3.Selection<SVGGElement, unknown, null, undefined>;
  isLoading: React.RefObject<boolean>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  dragAccumulatorRef: React.RefObject<number>;
}

/**
 * 인터랙션을 바인딩합니다. Delta(dx) 기반 드래그를 사용하여 점프 현상을 방지합니다.
 */
const bindInteractions = ({
  svg, x, y, data, fullData, visibleCount, 
  setVisibleCount, setViewOffset, loadMoreData, setHoverData, 
  crosshair, isLoading, svgRef, dragAccumulatorRef
}: InteractionProps) => {
  const { width, height, margin } = CHART_CONFIG;

  // 1. Delta(dx) 기반 드래그 핸들러
  const dragBehavior = d3.drag<SVGRectElement, unknown>()
    .on('start', () => {
      svg.style('cursor', 'grabbing');
      if (dragAccumulatorRef.current !== null) dragAccumulatorRef.current = 0;
    })
    .on('drag', (event) => {
      if (dragAccumulatorRef.current === null) return;
      
      dragAccumulatorRef.current += event.dx;
      
      const bandWidth = x.step();
      const moveCount = Math.round(dragAccumulatorRef.current / bandWidth);

      if (moveCount !== 0) {
        setViewOffset((prev: number) => {
          const next = prev - moveCount;
          const clamped = Math.max(-1, Math.min(fullData.length - visibleCount, next));
          
          if (clamped <= 0 && !isLoading.current) {
            loadMoreData();
          }
          return clamped;
        });
        
        dragAccumulatorRef.current -= moveCount * bandWidth;
      }
    })
    .on('end', () => {
      svg.style('cursor', 'crosshair');
      setViewOffset((prev: number) => Math.max(0, Math.min(fullData.length - visibleCount, prev)));
    });

  // 2. 마우스 휠 줌
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY;
    const zoomSpeed = Math.max(1, Math.floor(visibleCount / 15));

    setVisibleCount((prev: number) => {
      const next = delta > 0 ? prev + zoomSpeed : prev - zoomSpeed;
      const clamped = Math.max(MIN_VISIBLE, Math.min(MAX_VISIBLE, next));

      if (clamped !== prev) {
        const diff = clamped - prev;
        setViewOffset((off: number) => {
          const newOff = off - Math.floor(diff / 2);
          return Math.max(0, Math.min(fullData.length - clamped, newOff));
        });
      }
      return clamped;
    });
  };

  // 3. 오버레이 설정
  const overlay = svg.select<SVGRectElement>('rect.interaction-overlay')
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
    .on('mousemove', (event: MouseEvent) => {
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
};

export const useTradingChartRenderer = ({
  svgRef, fullData, viewOffset, visibleCount, 
  setVisibleCount, setViewOffset, loadMoreData, setHoverData, isLoading
}: RendererProps) => {
  const dragAccumulatorRef = useRef(0);

  useEffect(() => {
    if (!svgRef.current || fullData.length === 0) return;

    const { width, height, margin, volumeHeight, pricePadding } = CHART_CONFIG;
    
    const startIndex = Math.max(0, Math.min(viewOffset, fullData.length - visibleCount));
    const data = fullData.slice(startIndex, startIndex + visibleCount);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');
    
    let chartArea = svg.select<SVGGElement>('g.chart-content');
    if (chartArea.empty()) {
      svg.append('g').attr('class', 'chart-content');
      svg.append('g').attr('class', 'x-axis');
      svg.append('g').attr('class', 'y-axis');
      svg.append('g').attr('class', 'crosshair-layer');
      svg.append('rect').attr('class', 'interaction-overlay');
    }

    const x = d3.scaleBand()
      .domain(data.map(d => d.date.toISOString()))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.low)! * 0.98, d3.max(data, d => d.high)! * 1.02])
      .range([height - margin.bottom - volumeHeight - pricePadding, margin.top]);

    const yVolume = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.volume)!])
      .range([height - margin.bottom, height - margin.bottom - volumeHeight]);

    const ctx: RenderContext = { svg, data, x, y, yVolume };

    renderAxes(ctx, visibleCount);
    renderCandlesticks(ctx);
    renderVolume(ctx);
    const crosshair = updateCrosshair(svg);
// 5. Setup Interactions
const cleanup = bindInteractions({
  svg, x, y, data, fullData, visibleCount, 
  setVisibleCount, setViewOffset, loadMoreData, setHoverData, 
  crosshair, isLoading, svgRef,
  dragAccumulatorRef
});

    return cleanup;
  }, [fullData, viewOffset, visibleCount, loadMoreData, setVisibleCount, setViewOffset, setHoverData, svgRef, isLoading]);
};
