import React, { useRef, useState } from 'react';
import ChartHeader from './trading/ChartHeader';
import ChartFooter from './trading/ChartFooter';
import { useTradingData } from './trading/useTradingData';
import { useTradingChartRenderer } from './trading/useTradingChartRenderer';
import type { OHLCData } from './trading/types';

const TradingChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverData, setHoverData] = useState<OHLCData | null>(null);

  const {
    fullData,
    visibleCount,
    setVisibleCount,
    viewOffset,
    setViewOffset,
    loadMoreData,
    isLoading
  } = useTradingData();

  useTradingChartRenderer({
    svgRef,
    fullData,
    viewOffset,
    visibleCount,
    setVisibleCount,
    setViewOffset,
    loadMoreData,
    setHoverData,
    isLoading
  });

  return (
    <div ref={containerRef} className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 select-none">
      <ChartHeader hoverData={hoverData} />
      
      <div className="w-full h-[500px] relative">
        <svg ref={svgRef} className="w-full h-full font-sans"></svg>
      </div>

      <ChartFooter />
    </div>
  );
};

export default TradingChart;
