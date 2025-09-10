import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { GraphDisplay } from './GraphDisplay';
import { processMathContent } from '../../utils/mathProcessor.js';

interface MathContentProps {
  content: string;
  className?: string;
}

export function MathContent({ content, className = '' }: MathContentProps) {
  const segments = processMathContent(content);

  return (
    <div className={`math-content space-y-4 ${className}`}>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case 'text':
            return (
              <p key={index} className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {segment.content}
              </p>
            );
          case 'inline-math':
            return (
              <span key={index} className="inline-math px-1">
                <InlineMath math={segment.content} />
              </span>
            );
          case 'display-math':
            return (
              <div key={index} className="my-4 px-4 py-2 bg-gray-50 rounded-lg overflow-x-auto">
                <BlockMath math={segment.content} />
              </div>
            );
          case 'plot':
            return (
              <GraphDisplay
                key={index}
                data={segment.data}
                className="my-4"
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}