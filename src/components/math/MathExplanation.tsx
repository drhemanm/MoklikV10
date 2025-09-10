import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { cleanMathExpression } from '../../utils/mathUtils.js';

interface MathExplanationProps {
  children: React.ReactNode;
  className?: string;
}

export function MathExplanation({ children, className = '' }: MathExplanationProps) {
  return (
    <div className={`math-explanation space-y-4 ${className}`}>
      {children}
    </div>
  );
}

interface TermProps {
  variable: string;
  description: string;
  equation?: string;
}

export function Term({ variable, description, equation }: TermProps) {
  return (
    <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
        <InlineMath math={cleanMathExpression(variable)} />
      </div>
      <div className="flex-1">
        <p className="text-gray-700">{description}</p>
        {equation && (
          <div className="mt-1 text-gray-600">
            <InlineMath math={cleanMathExpression(equation)} />
          </div>
        )}
      </div>
    </div>
  );
}

interface ExampleProps {
  equation: string;
  explanation?: string;
  values?: Record<string, string | number>;
}

export function Example({ equation, explanation, values }: ExampleProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 my-4">
      <BlockMath math={cleanMathExpression(equation)} />
      {values && (
        <div className="mt-2 space-y-1">
          {Object.entries(values).map(([variable, value]) => (
            <p key={variable} className="text-sm text-gray-600">
              Where <InlineMath math={variable} /> = {value}
            </p>
          ))}
        </div>
      )}
      {explanation && (
        <p className="mt-2 text-gray-700">{explanation}</p>
      )}
    </div>
  );
}