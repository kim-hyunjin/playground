import Plot from 'react-plotly.js';
import { LineChartProps } from '.';

const LineChart = (props: LineChartProps) => {
  return <Plot data={props.data} layout={props.layout} />;
};

export default LineChart;
