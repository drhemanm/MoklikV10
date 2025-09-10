import { FunctionPlot } from './graphs/FunctionPlot.js';
import { DataChart } from './graphs/DataChart.js';
import { Plot3D } from './graphs/Plot3D.js';

interface MathChartProps {
  data?: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }>;
  };
  function?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  title?: string;
  type?: 'line' | 'bar' | 'scatter' | '3d';
  plotlyData?: Plotly.Data[];
  className?: string;
}

export function MathChart({
  data,
  function: expr,
  xRange = [-10, 10],
  yRange = [-10, 10],
  title,
  type = 'line' as 'line' | 'bar' | 'scatter',
  plotlyData,
  className = ''
}: MathChartProps) {
  if (expr) {
    return (
      <FunctionPlot
        function={expr}
        xRange={xRange}
        yRange={yRange}
        title={title}
        className={className}
      />
    );
  }

  if (type === '3d' && plotlyData) {
    return <Plot3D data={plotlyData} title={title} />;
  }

  if (data) {
    return (
      <DataChart
        data={data}
        type={type === 'scatter' ? 'line' : type}
        title={title}
        className={className}
      />
    );
  }

  return null;
}