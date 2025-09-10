import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathEquationProps {
  equation: string;
  block?: boolean;
}

export function MathEquation({ equation, block = false }: MathEquationProps) {
  const cleanEquation = React.useMemo(() => {
    return equation
      .replace(/```math\n?|\n?```/g, '')
      .replace(/^\$\$|\$\$$/g, '')
      .replace(/^\$|\$$/g, '')
      .replace(/^\\\[|\\\]$/g, '')
      .replace(/^\\\(|\\\)$/g, '')
      .trim();
  }, [equation]);

  try {
    return block ? (
      <BlockMath math={cleanEquation} errorColor="#cc0000" />
    ) : (
      <InlineMath math={cleanEquation} errorColor="#cc0000" />
    );
  } catch (error) {
    console.error('Math rendering error:', error);
    return (
      <div className="text-red-500 bg-red-50 p-2 rounded">
        Error rendering equation. Please check the syntax.
      </div>
    );
  }
}