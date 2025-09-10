import React, { useMemo } from 'react';
import { PlotlyWrapper } from './PlotlyWrapper';
import { generatePoints } from '../../utils/mathUtils';

interface FunctionPlotProps {
  function: string;
  xRange: [number, number];
  yRange: [number, number];
  title?: string;
  className?: string;
}

export function FunctionPlot({
  function: expr,
  xRange,
  yRange,
  title = 'Function Plot',
  className = ''
}: FunctionPlotProps) {
  const data = useMemo(() => {
    const points = generatePoints(expr, xRange[0], xRange[1]);
    return [{
      x: points.map(p => p.x),
      y: points.map(p => p.y),
      type: 'scatter',
      mode: 'lines',
      name: expr,
      line: { color: '#3b82f6', width: 2 }
    }];
  }, [expr, xRange]);

  const layout: Partial<Plotly.Layout> = {
    title: {
      text: title,
      font: { size: 16 }
    },
    xaxis: { range: xRange },
    yaxis: { range: yRange }
  };

  return <PlotlyWrapper data={data} layout={layout} className={className} />;
}