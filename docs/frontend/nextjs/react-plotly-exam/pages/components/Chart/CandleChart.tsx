import Plot from 'react-plotly.js';
import { CandleChartProps } from '.';

const CandleChart = (props: CandleChartProps) => {
  return <Plot data={props.data} layout={props.layout} />;
};

export default CandleChart;
