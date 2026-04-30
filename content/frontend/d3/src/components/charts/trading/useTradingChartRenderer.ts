import { useEffect } from 'react';
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
 * 차트의 X축과 Y축을 렌더링합니다.
 * X축은 날짜를 표시하며, Y축은 가격을 우측에 표시합니다.
 * @param ctx 렌더링 컨텍스트 (svg, scales 등)
 * @param visibleCount 현재 화면에 보이는 데이터 개수 (축 틱 간격 조절용)
 */
const renderAxes = (ctx: RenderContext, visibleCount: number) => {
  const { svg, x, y } = ctx;
  const { height, margin } = CHART_CONFIG;

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickFormat(d => d3.timeFormat('%m/%d')(new Date(d)))
      .tickValues(x.domain().filter((_, i) => i % Math.max(1, Math.floor(visibleCount / 8)) === 0)))
    .attr('color', '#94a3b8');

  svg.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${CHART_CONFIG.width - margin.right},0)`)
    .call(d3.axisRight(y))
    .attr('color', '#94a3b8');
};

/**
 * 캔들스틱(봉 차트)을 렌더링합니다.
 * 시가(Open), 고가(High), 저가(Low), 종가(Close) 데이터를 바탕으로
 * 양봉(Red)과 음봉(Blue)을 구분하여 선(꼬리)과 사각형(몸통)을 그립니다.
 * @param ctx 렌더링 컨텍스트
 */
const renderCandlesticks = (ctx: RenderContext) => {
  const { svg, data, x, y } = ctx;

  const candles = svg.append('g')
    .attr('class', 'candles-layer')
    .selectAll<SVGGElement, OHLCData>('g')
    .data(data, (d) => d.date.toISOString())
    .join('g');

  // 고가-저가 연결선 (꼬리)
  candles.append('line')
    .attr('x1', d => (x(d.date.toISOString()) || 0) + x.bandwidth() / 2)
    .attr('x2', d => (x(d.date.toISOString()) || 0) + x.bandwidth() / 2)
    .attr('y1', d => y(d.high))
    .attr('y2', d => y(d.low))
    .attr('stroke', d => d.close > d.open ? '#ef4444' : '#3b82f6');

  // 시가-종가 몸통 (직사각형)
  candles.append('rect')
    .attr('x', d => x(d.date.toISOString()) || 0)
    .attr('y', d => y(Math.max(d.open, d.close)))
    .attr('width', x.bandwidth())
    .attr('height', d => Math.abs(y(d.open) - y(d.close)) || 1)
    .attr('fill', d => d.close > d.open ? '#ef4444' : '#3b82f6');
};

/**
 * 하단 거래량 막대를 렌더링합니다.
 * 가격 상승/하락 여부에 따라 캔들과 동일한 색상을 적용하되 투명도를 낮춥니다.
 * @param ctx 렌더링 컨텍스트
 */
const renderVolume = (ctx: RenderContext) => {
  const { svg, data, x, yVolume } = ctx;
  const { height, margin } = CHART_CONFIG;

  svg.append('g')
    .attr('class', 'volume-layer')
    .selectAll<SVGRectElement, OHLCData>('rect')
    .data(data, (d) => d.date.toISOString())
    .join('rect')
    .attr('x', d => x(d.date.toISOString()) || 0)
    .attr('y', d => yVolume(d.volume))
    .attr('width', x.bandwidth())
    .attr('height', d => height - margin.bottom - yVolume(d.volume))
    .attr('fill', d => d.close > d.open ? '#ef4444' : '#3b82f6')
    .attr('opacity', 0.5);
};

/**
 * 차트 위의 크로스헤어(십자선) 가이드를 생성합니다.
 * 초기 상태는 숨겨져 있으며, 마우스 오버 시 상호작용 레이어에서 위치를 업데이트합니다.
 * @param svg SVG 메인 컨테이너
 * @returns 크로스헤어 레이어 Selection 객체
 */
const createCrosshair = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
  const { width, height, margin } = CHART_CONFIG;
  const crosshair = svg.append('g')
    .attr('class', 'crosshair-layer')
    .style('display', 'none');

  crosshair.append('line')
    .attr('class', 'h-line')
    .attr('stroke', '#64748b')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right);

  crosshair.append('line')
    .attr('class', 'v-line')
    .attr('stroke', '#64748b')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,3')
    .attr('y1', margin.top)
    .attr('y2', height - margin.bottom);

  return crosshair;
};

/**
 * 인터랙션 프로퍼티 타입 정의
 */
interface InteractionProps {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  data: OHLCData[];
  fullData: OHLCData[];
  viewOffset: number;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  setViewOffset: React.Dispatch<React.SetStateAction<number>>;
  loadMoreData: () => void;
  setHoverData: (data: OHLCData | null) => void;
  crosshair: d3.Selection<SVGGElement, unknown, null, undefined>;
  isLoading: React.RefObject<boolean>;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

/**
 * 차트의 모든 사용자 상호작용(드래그, 줌, 마우스 오버 등)을 바인딩합니다.
 * 이벤트 감지를 위한 투명 오버레이를 생성하고 관련 리스너를 등록합니다.
 * @param props 상호작용에 필요한 상태와 함수들
 * @returns 정리를 위한 클린업 함수
 */
const bindInteractions = ({
  svg, x, y, data, fullData, viewOffset, visibleCount,
  setVisibleCount, setViewOffset, loadMoreData, setHoverData,
  crosshair, isLoading, svgRef
}: InteractionProps) => {
  const { width, height, margin } = CHART_CONFIG;

  // 1. 드래그를 통한 차트 좌우 이동 로직
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
      const clampedOffset = Math.max(-10, Math.min(fullData.length - visibleCount, newOffset));

      if (clampedOffset !== viewOffset) {
        if (clampedOffset <= 0 && !isLoading.current) {
          loadMoreData(); // 왼쪽 끝 도달 시 과거 데이터 추가 로드
        } else if (clampedOffset > 0) {
          setViewOffset(clampedOffset);
        }
      }
    })
    .on('end', () => {
      dragStartPos = null;
      svg.style('cursor', 'crosshair');
      setViewOffset((prev: number) => Math.max(0, Math.min(fullData.length - visibleCount, prev)));
    });

  // 2. 마우스 휠을 통한 확대/축소 로직
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

  // 3. 이벤트 감지용 투명 오버레이 생성 및 이벤트 등록
  const overlay = svg.append('rect')
    .attr('class', 'interaction-overlay')
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

      // 현재 마우스 위치에 해당하는 데이터의 크로스헤어와 툴팁 업데이트
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

/**
 * 거래소 차트의 D3 렌더링 생명주기를 React와 연결하는 메인 커스텀 훅입니다.
 * 데이터나 뷰 설정이 변경될 때마다 차트를 다시 그립니다.
 */
export const useTradingChartRenderer = ({
  svgRef, fullData, viewOffset, visibleCount,
  setVisibleCount, setViewOffset, loadMoreData, setHoverData, isLoading
}: RendererProps) => {
  useEffect(() => {
    if (!svgRef.current || fullData.length === 0) return;

    const { width, height, margin, volumeHeight, pricePadding } = CHART_CONFIG;

    // 1. Prepare Data
    const startIndex = Math.max(0, Math.min(viewOffset, fullData.length - visibleCount));
    const data = fullData.slice(startIndex, startIndex + visibleCount);

    // 2. Initialize SVG
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');
    svg.selectAll('*').remove();

    // 3. Create Scales
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

    // 4. Run Rendering
    renderAxes(ctx, visibleCount);
    renderCandlesticks(ctx);
    renderVolume(ctx);
    const crosshair = createCrosshair(svg);

    // 5. Setup Interactions
    const cleanup = bindInteractions({
      svg, x, y, data, fullData, viewOffset, visibleCount,
      setVisibleCount, setViewOffset, loadMoreData, setHoverData,
      crosshair, isLoading, svgRef
    });

    return cleanup;
  }, [fullData, viewOffset, visibleCount, loadMoreData, setVisibleCount, setViewOffset, setHoverData, svgRef, isLoading]);
};
