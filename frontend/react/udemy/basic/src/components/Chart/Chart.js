import React from 'react';
import './Chart.css';
import ChartBar from './ChartBar';

export default function Chart({ dataPoints }) {
  const dataPointValues = dataPoints.map((d) => d.value);
  const totalMaximum = Math.max(...dataPointValues);

  return (
    <div className="chart">
      {dataPoints.map((dataPoint) => (
        <ChartBar
          key={dataPoint.label}
          value={dataPoint.value}
          max={totalMaximum}
          label={dataPoint.label}
        />
      ))}
    </div>
  );
}
