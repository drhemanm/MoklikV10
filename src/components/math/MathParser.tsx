import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import Plot from 'react-plotly.js';
import { cleanMathExpression, generatePoints } from '../../utils/mathUtils.js';

interface MathParserProps {
  content: string;
}

export function MathParser({ content }: MathParserProps) {
  const processedContent = React.useMemo(() => {
    // Split content into text, math, and plot segments
    const segments = content.split(/(```(?:plot|math)[\s\S]*?```|\$\$[\s\S]*?\$\$|\$[^\$]+\$)/);
    
    return segments.map((segment, index) => {
      const trimmed = segment.trim();
      if (!trimmed) return null;

      // Handle plot blocks
      if (trimmed.startsWith('```plot')) {
        try {
          const plotData = JSON.parse(
            trimmed.replace(/```plot\n?|\n?```/g, '').trim()
          );
          
          const points = generatePoints(
            plotData.function,
            plotData.xRange[0],
            plotData.xRange[1]
          );

          const data = [{
            x: points.map(p => p.x),
            y: points.map(p => p.y),
            type: 'scatter',
            mode: 'lines',
            name: plotData.function,
            line: { color: '#3b82f6', width: 2 }
          }];

          const layout: Partial<Plotly.Layout> = {
            title: plotData.title ? { text: plotData.title, font: { size: 16 } } : undefined,
            autosize: true,
            height: 400,
            margin: { l: 50, r: 50, t: plotData.title ? 50 : 20, b: 50 },
            plot_bgcolor: '#ffffff',
            paper_bgcolor: '#ffffff',
            xaxis: {
              range: plotData.xRange,
              showgrid: true,
              zeroline: true,
              showline: true,
              gridcolor: '#e2e8f0',
              zerolinecolor: '#cbd5e1',
              linecolor: '#94a3b8'
            },
            yaxis: {
              range: plotData.yRange,
              showgrid: true,
              zeroline: true,
              showline: true,
              gridcolor: '#e2e8f0',
              zerolinecolor: '#cbd5e1',
              linecolor: '#94a3b8'
            }
          };

          return (
            <div key={index} className="my-4 w-full h-[400px] bg-white rounded-lg shadow-sm p-4">
              <Plot
                data={data}
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
        } catch (error) {
          console.warn('Error parsing plot data:', error);
          return <p key={index}>{trimmed}</p>;
        }
      }
      
      // Handle display math (block)
      if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
        const math = cleanMathExpression(trimmed.slice(2, -2).trim());
        return (
          <div key={index} className="my-4 px-4 py-2 bg-gray-50 rounded-lg overflow-x-auto">
            <BlockMath math={math} />
          </div>
        );
      }
      
      // Handle inline math
      if (trimmed.startsWith('$') && trimmed.endsWith('$')) {
        const math = cleanMathExpression(trimmed.slice(1, -1).trim());
        return (
          <span key={index} className="inline-math px-1">
            <InlineMath math={math} />
          </span>
        );
      }
      
      // Regular text - process for any remaining inline math
      return (
        <span key={index}>
          {trimmed.split(/(\$[^\$]+\$)/).map((part, i) => {
            if (part.startsWith('$') && part.endsWith('$')) {
              const math = cleanMathExpression(part.slice(1, -1).trim());
              return (
                <span key={i} className="inline-math px-1">
                  <InlineMath math={math} />
                </span>
              );
            }
            return part;
          })}
        </span>
      );
    });
  }, [content]);

  return (
    <div className="math-content leading-relaxed">
      {processedContent}
    </div>
  );
}