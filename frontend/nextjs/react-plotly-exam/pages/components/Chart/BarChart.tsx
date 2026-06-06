import Plot from 'react-plotly.js';
import { BarChartProps } from '.';

const BarChart = (props: BarChartProps) => {
  return <Plot data={props.data} layout={props.layout} />;
};

export default BarChart;
