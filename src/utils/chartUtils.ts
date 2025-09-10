import * as math from 'mathjs';

export function generateChartData(
  func: string,
  xRange: [number, number],
  points: number = 200
): { x: number[]; y: number[] } {
  const step = (xRange[1] - xRange[0]) / (points - 1);
  const x: number[] = [];
  const y: number[] = [];

  try {
    // Clean up the function string
    const cleanFunc = func
      .replace(/\^/g, '**')
      .replace(/(\d)x/g, '$1*x')
      .replace(/\)\(/g, ')*(')
      .replace(/x\(/g, 'x*(')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log/g, 'Math.log')
      .replace(/sqrt/g, 'Math.sqrt')
      .trim();

    // Create a scope with Math functions
    const scope = {
      x: 0,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      log: Math.log,
      sqrt: Math.sqrt,
      pi: Math.PI,
      e: Math.E
    };

    const node = math.parse(cleanFunc);
    const compiled = node.compile();

    for (let i = 0; i < points; i++) {
      const xVal = xRange[0] + step * i;
      try {
        scope.x = xVal;
        const yVal = compiled.evaluate(scope);
        
        // Only add points if they're valid and within a reasonable range
        if (!isNaN(yVal) && Math.abs(yVal) !== Infinity && Math.abs(yVal) <= 1000) {
          x.push(xVal);
          y.push(yVal);
        }
      } catch (error) {
        console.warn('Error evaluating point:', error);
      }
    }
  } catch (error) {
    console.error('Error parsing function:', error);
  }

  return { x, y };
}

export function createPlotlyLayout(title: string): Partial<Plotly.Layout> {
  return {
    title: {
      text: title,
      font: { size: 16 }
    },
    showlegend: true,
    autosize: true,
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
}