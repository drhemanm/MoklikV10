import React from 'react';
import { BlockMath } from 'react-katex';
import { MathExplanation, Term, Example } from './MathExplanation.js';

export function StandardForm() {
  return (
    <MathExplanation>
      <h2 className="text-xl font-semibold mb-4">
        The Standard Form of a Quadratic Equation
      </h2>

      <div className="equation-block">
        <BlockMath math="ax^2 + bx + c = 0" />
      </div>

      <div className="space-y-3">
        <Term
          variable="a,b,c"
          description="are known values. a can't be 0"
        />
        <Term
          variable="x"
          description="is the variable or unknown (we don't know it yet)"
        />
      </div>

      <h3 className="text-lg font-medium mt-6 mb-3">Examples:</h3>

      <Example
        equation="2x^2 + 5x + 3 = 0"
        values={{
          'a': '2',
          'b': '5',
          'c': '3'
        }}
      />

      <Example
        equation="x^2 - 3x = 0"
        explanation="This one is a little more tricky:"
        values={{
          'a': '1',
          'b': '-3',
          'c': '0'
        }}
      />

      <div className="bg-yellow-50 p-4 rounded-lg mt-4">
        <p className="font-medium text-yellow-800">Oops!</p>
        <Example
          equation="5x - 3 = 0"
          explanation="This one is not a quadratic equation: it is missing x²"
          values={{
            'a': '0'
          }}
        />
      </div>
    </MathExplanation>
  );
}