import Plot from 'react-plotly.js';
import { PieChartProps } from '.';

const PieChart = (props: PieChartProps) => {
  return <Plot data={props.data} layout={props.layout} />;
};

export default PieChart;
