import React from 'react';
// @ts-ignore
import { BlockMath } from 'react-katex';
import { cleanMathExpression } from '../../utils/mathUtils.js';

interface DisplayMathBlockProps {
  content: string;
  className?: string;
}

export function DisplayMathBlock({ content, className = '' }: DisplayMathBlockProps) {
  const cleanedExpression = React.useMemo(() => 
    cleanMathExpression(content), [content]
  );

  return (
    <div className={`display-math math-scroll ${className}`}>
      <BlockMath math={cleanedExpression} errorColor="#cc0000" />
    </div>
  );
}