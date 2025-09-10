import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface EquationDisplayProps {
  equation: string;
  block?: boolean;
  className?: string;
}

export function EquationDisplay({ equation, block = false, className = '' }: EquationDisplayProps) {
  const cleanEquation = React.useMemo(() => {
    return equation
      .replace(/```math\n?|\n?```/g, '')
      .replace(/^\$\$|\$\$$/g, '')
      .replace(/^\$|\$$/g, '')
      .replace(/^\\\[|\\\]$/g, '')
      .replace(/^\\\(|\\\)$/g, '')
      .trim();
  }, [equation]);

  return (
    <div className={`equation-wrapper ${className}`}>
      {block ? (
        <BlockMath math={cleanEquation} errorColor="#cc0000" />
      ) : (
        <InlineMath math={cleanEquation} errorColor="#cc0000" />
      )}
    </div>
  );
}