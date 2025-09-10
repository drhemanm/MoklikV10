import React from 'react';
import Plot from 'react-plotly.js';
import { generatePoints } from '../../utils/mathUtils';

interface PlotlyWrapperProps {
  data: Plotly.Data[];
  layout?: Partial<Plotly.Layout>;
  className?: string;
}

const defaultLayout: Partial<Plotly.Layout> = {
  autosize: true,
  height: 400,
  margin: { l: 50, r: 50, t: 50, b: 50 },
  plot_bgcolor: '#ffffff',
  paper_bgcolor: '#ffffff',
  xaxis: {
    showgrid: true,
    zeroline: true,
    showline: true,
    gridcolor: '#e2e8f0',
    zerolinecolor: '#cbd5e1',
    linecolor: '#94a3b8'
  },
  yaxis: {
    showgrid: true,
    zeroline: true,
    showline: true,
    gridcolor: '#e2e8f0',
    zerolinecolor: '#cbd5e1',
    linecolor: '#94a3b8'
  }
};

export function PlotlyWrapper({ data, layout = {}, className = '' }: PlotlyWrapperProps) {
  return (
    <div className={`w-full h-[400px] bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <Plot
        data={data}
        layout={{ ...defaultLayout, ...layout }}
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