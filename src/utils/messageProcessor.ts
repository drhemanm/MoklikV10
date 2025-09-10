import { cleanMathExpression } from './mathUtils.js';

interface ProcessedContent {
  text: string[];
  equations: string[];
  plots: Array<{
    function: string;
    xRange: [number, number];
    yRange: [number, number];
    title: string;
  }>;
  charts: Array<{
    title: string;
    data: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
      }>;
    };
  }>;
}

export function processMessageContent(content: string): ProcessedContent {
  const result: ProcessedContent = {
    text: [],
    equations: [],
    plots: [],
    charts: []
  };

  const parts = content.split(/(```(?:plot|chart|math)[\s\S]*?```|\$\$[\s\S]*?\$\$|\$.*?\$)/);

  parts.forEach(part => {
    const trimmed = part.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('```plot')) {
      try {
        const plotData = JSON.parse(
          trimmed.replace(/```plot\n?|\n?```/g, '').trim()
        );
        result.plots.push(plotData);
      } catch (error) {
        console.warn('Error parsing plot data:', error);
        result.text.push(trimmed);
      }
    } else if (trimmed.startsWith('```chart')) {
      try {
        const chartData = JSON.parse(
          trimmed.replace(/```chart\n?|\n?```/g, '').trim()
        );
        result.charts.push(chartData);
      } catch (error) {
        console.warn('Error parsing chart data:', error);
        result.text.push(trimmed);
      }
    } else if (trimmed.startsWith('```math') || /^\$\$[\s\S]*\$\$$/.test(trimmed)) {
      const equation = trimmed
        .replace(/```math\n?|\n?```/g, '')
        .replace(/^\$\$|\$\$$/g, '')
        .trim();
      result.equations.push(cleanMathExpression(equation));
    } else if (/^\$.*\$$/.test(trimmed)) {
      const equation = trimmed.slice(1, -1).trim();
      result.equations.push(cleanMathExpression(equation));
    } else {
      result.text.push(trimmed);
    }
  });

  return result;
}