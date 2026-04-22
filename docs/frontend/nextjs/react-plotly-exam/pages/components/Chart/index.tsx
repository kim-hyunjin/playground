import dynamic from 'next/dynamic';
import { CandlestickData, PieData, PlotData } from 'plotly.js';

interface BarData extends PlotData {
  type: 'bar';
}
export interface BarChartProps {
  data: Partial<BarData>[];
  layout: Partial<Plotly.Layout>;
}

interface LineData extends PlotData {
  type: 'scatter';
}
export interface LineChartProps {
  data: Partial<LineData>[];
  layout: Partial<Plotly.Layout>;
}

export interface PieChartProps {
  data: Partial<PieData>[];
  layout: Partial<Plotly.Layout>;
}

export interface CandleChartProps {
  data: Partial<CandlestickData>[];
  layout: Partial<Plotly.Layout>;
}

export const BarChart = dynamic(() => import('./BarChart'), { ssr: false });
export const LineChart = dynamic(() => import('./LineChart'), { ssr: false });
export const PieChart = dynamic(() => import('./PieChart'), { ssr: false });
export const CandleChart = dynamic(() => import('./CandleChart'), { ssr: false });
