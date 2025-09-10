// @ts-ignore
import Plot from 'react-plotly.js';

interface Plot3DProps {
  data: Plotly.Data[];
  title?: string;
}

export function Plot3D({ data, title = '3D Plot' }: Plot3DProps) {
  const layout: Partial<Plotly.Layout> = {
    title: {
      text: title,
      font: { size: 16 }
    },
    autosize: true,
    margin: { l: 0, r: 0, b: 0, t: 40 },
    scene: {
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }
      },
      xaxis: {
        gridcolor: '#e2e8f0',
        zerolinecolor: '#cbd5e1'
      },
      yaxis: {
        gridcolor: '#e2e8f0',
        zerolinecolor: '#cbd5e1'
      },
      zaxis: {
        gridcolor: '#e2e8f0',
        zerolinecolor: '#cbd5e1'
      }
    }
  };

  return (
    <div className="w-full h-[500px] bg-white rounded-lg shadow-sm p-4">
      <Plot
        data={data}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true }}
      />
    </div>
  );
}