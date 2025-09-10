import React from 'react';
import React from 'react';
// @ts-ignore
const Plot = require('react-plotly.js').default;
import { generatePoints } from '../../utils/mathUtils.js';
import { createPlotlyLayout } from '../../utils/plotUtils.js';

interface GraphDisplayProps {
  data: {
    function: string;
    xRange: [number, number];
    yRange: [number, number];
    title?: string;
  };
  className?: string;
}

export function GraphDisplay({ data, className = '' }: GraphDisplayProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const plotData = React.useMemo(() => {
    const points = generatePoints(data.function, data.xRange[0], data.xRange[1]);
    return [{
      x: points.map((p: any) => p.x),
      y: points.map((p: any) => p.y),
      type: 'scatter',
      mode: 'lines',
      name: data.function,
      line: { color: '#3b82f6', width: 2 }
    }];
  }, [data.function, data.xRange]);

  const layout = React.useMemo(() => 
    createPlotlyLayout(data.title || 'Function Plot', data.xRange, data.yRange),
    [data.title, data.xRange, data.yRange]
  );

  return (
    <div ref={containerRef} className={`w-full h-[400px] bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <Plot
        data={plotData}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d']
        }}
      />
    </div>
  );
}