import React from 'react';
import { BlockMath } from 'react-katex';
import { cleanMathExpression } from '../../utils/mathUtils';

interface QuadraticEquationProps {
  a: number;
  b: number;
  c: number;
  highlight?: boolean;
}

export function QuadraticEquation({ a, b, c, highlight = false }: QuadraticEquationProps) {
  const equation = React.useMemo(() => {
    const bTerm = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
    const cTerm = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    return cleanMathExpression(`${a}x^2 ${bTerm} ${cTerm} = 0`);
  }, [a, b, c]);

  return (
    <div className={`equation-block ${highlight ? 'bg-blue-50' : 'bg-gray-50'} 
      rounded-lg p-4 my-4 shadow-sm`}>
      <BlockMath math={equation} />
    </div>
  );
}