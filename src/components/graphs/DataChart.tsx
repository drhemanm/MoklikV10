import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DataChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }>;
  };
  type?: 'line' | 'bar';
  title?: string;
  showGrid?: boolean;
}

export function DataChart({ data, type = 'line', title, showGrid = true }: DataChartProps) {
  const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false as const,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: !!title,
      text: title
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1f2937',
      bodyColor: '#4b5563',
      borderColor: '#e5e7eb',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)', 
        drawBorder: false,
        display: showGrid
      },
      ticks: {
        color: '#6b7280'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6b7280'
      }
    }
  }
  };

  return type === 'bar' ? (
    <Bar options={options} data={data} />
  ) : (
    <Line options={options} data={data} />
  );
}