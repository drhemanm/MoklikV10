import { FunctionPlot } from './graphs/FunctionPlot.js';
import { DataChart } from './graphs/DataChart.js';

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
  type?: 'line' | 'bar';
  className?: string;
}

export function MathChart({
  data,
  function: expr,
  xRange = [-10, 10],
  yRange = [-10, 10],
  title,
  type = 'line',
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

  if (data) {
    return (
      <DataChart
        data={data}
        type={type}
        title={title}
        showGrid={true}
      />
    );
  }

  return null;
}