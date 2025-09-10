import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { cleanMathExpression } from '../../utils/mathUtils';

interface MathDisplayProps {
  content: string;
  block?: boolean;
  className?: string;
}

export function MathDisplay({ content, block = false, className = '' }: MathDisplayProps) {
  const cleanedExpression = React.useMemo(() => {
    return cleanMathExpression(content);
  }, [content]);

  return (
    <div className={`math-display ${className}`}>
      {block ? (
        <div className="equation-block">
          <BlockMath math={cleanedExpression} errorColor="#cc0000" />
        </div>
      ) : (
        <span className="inline-math">
          <InlineMath math={cleanedExpression} errorColor="#cc0000" />
        </span>
      )}
    </div>
  );
}