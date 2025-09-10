import * as math from 'mathjs';

export function cleanMathExpression(expr: string): string {
  return expr
    .trim()
    // Handle multiplication dots
    .replace(/(\d+)([a-zA-Z])/g, '$1\\cdot $2')
    .replace(/([a-zA-Z])(\d+)/g, '$1\\cdot $2')
    // Handle fractions
    .replace(/(\d+)\/(\d+)/g, (_, num, den) => `\\frac{${num}}{${den}}`)
    // Handle powers
    .replace(/\^(\d+)/g, (_, exp) => `^{${exp}}`)
    // Handle square roots
    .replace(/sqrt\((.*?)\)/g, (_, content) => `\\sqrt{${content}}`)
    // Handle parentheses multiplication
    .replace(/(\d+)\(/g, '$1\\cdot(')
    .replace(/\)(\d+)/g, ')\\cdot $1')
    // Clean up spaces around operators
    .replace(/\s*([+\-=])\s*/g, ' $1 ')
    // Remove unnecessary spaces
    .trim();
}

export function generatePoints(
  expr: string,
  xMin: number,
  xMax: number,
  points: number = 200
): { x: number; y: number }[] {
  const step = (xMax - xMin) / (points - 1);
  const result = [];

  try {
    const cleanExpr = expr
      .replace(/\\cdot/g, '*')
      .replace(/\^/g, '**')
      .replace(/\\frac{(\d+)}{(\d+)}/g, '($1/$2)');

    const node = math.parse(cleanExpr);
    const compiled = node.compile();

    for (let i = 0; i < points; i++) {
      const x = xMin + step * i;
      try {
        const y = compiled.evaluate({ x });
        if (isFinite(y)) {
          result.push({ x, y });
        }
      } catch (error) {
        console.warn('Error evaluating point:', error);
      }
    }
  } catch (error) {
    console.error('Error parsing function:', error);
  }

  return result;
}