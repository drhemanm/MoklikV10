import React from 'react';
import { InlineMath } from 'react-katex';
import { cleanMathExpression } from '../../utils/mathUtils';

interface InlineMathDisplayProps {
  content: string;
  className?: string;
}

export function InlineMathDisplay({ content, className = '' }: InlineMathDisplayProps) {
  const cleanedExpression = React.useMemo(() => 
    cleanMathExpression(content), [content]
  );

  return (
    <span className={`inline-math ${className}`}>
      <InlineMath math={cleanedExpression} errorColor="#cc0000" />
    </span>
  );
}