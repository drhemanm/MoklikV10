import { cleanMathExpression } from './mathUtils';

interface MathSegment {
  type: 'text' | 'inline-math' | 'display-math' | 'plot';
  content: string;
  data?: any;
}

export function processMathContent(content: string): MathSegment[] {
  const segments: MathSegment[] = [];
  const parts = content.split(/(```(?:plot|math)[\s\S]*?```|\$\$[\s\S]*?\$\$|\$[^\$]+\$)/);

  parts.forEach(part => {
    const trimmed = part.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('```plot')) {
      try {
        const plotData = JSON.parse(
          trimmed.replace(/```plot\n?|\n?```/g, '').trim()
        );
        segments.push({
          type: 'plot',
          content: trimmed,
          data: plotData
        });
      } catch (error) {
        console.warn('Error parsing plot data:', error);
        segments.push({ type: 'text', content: trimmed });
      }
      return;
    }

    if (trimmed.startsWith('```math') || /^\$\$[\s\S]*\$\$$/.test(trimmed)) {
      segments.push({
        type: 'display-math',
        content: cleanMathExpression(
          trimmed
            .replace(/```math\n?|\n?```/g, '')
            .replace(/^\$\$|\$\$$/g, '')
            .trim()
        )
      });
      return;
    }

    if (/^\$[^\$]+\$$/.test(trimmed)) {
      segments.push({
        type: 'inline-math',
        content: cleanMathExpression(trimmed.slice(1, -1).trim())
      });
      return;
    }

    segments.push({
      type: 'text',
      content: trimmed
    });
  });

  return segments;
}