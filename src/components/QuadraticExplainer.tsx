import React from 'react';
import { MathEquation } from './MathEquation';
import { MathChart } from './MathChart';
import { generateQuadraticExplanation } from '../utils/mathUtils';
import { processMessageContent } from '../utils/messageProcessor';

interface QuadraticExplainerProps {
  a: number;
  b: number;
  c: number;
}

export function QuadraticExplainer({ a, b, c }: QuadraticExplainerProps) {
  const explanation = generateQuadraticExplanation(a, b, c);
  const { text, equations, charts } = processMessageContent(explanation);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Understanding the Quadratic Function
      </h2>
      
      <div className="space-y-6">
        {text.map((segment, index) => (
          <p key={index} className="text-gray-700 leading-relaxed">
            {segment}
          </p>
        ))}
        
        {equations.map((eq, index) => (
          <div key={`eq-${index}`} className="my-4 px-4 py-2 bg-gray-50 rounded-lg">
            <MathEquation 
              equation={eq} 
              block={true}
              renderEngine="katex"
            />
          </div>
        ))}
        
        {charts.map((chart, index) => (
          <div key={`chart-${index}`} className="my-4">
            <MathChart {...chart} />
          </div>
        ))}
      </div>
    </div>
  );
}