export function createPlotlyLayout(
  title: string,
  xRange?: [number, number],
  yRange?: [number, number]
): Partial<Plotly.Layout> {
  return {
    title: {
      text: title,
      font: { size: 16 }
    },
    autosize: true,
    height: 400,
    margin: { l: 50, r: 50, t: 50, b: 50 },
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff',
    xaxis: {
      range: xRange,
      showgrid: true,
      zeroline: true,
      showline: true,
      gridcolor: '#e2e8f0',
      zerolinecolor: '#cbd5e1',
      linecolor: '#94a3b8'
    },
    yaxis: {
      range: yRange,
      showgrid: true,
      zeroline: true,
      showline: true,
      gridcolor: '#e2e8f0',
      zerolinecolor: '#cbd5e1',
      linecolor: '#94a3b8'
    }
  };
}