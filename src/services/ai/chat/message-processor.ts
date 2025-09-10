import { cleanMathExpression } from '../../../utils/mathUtils';

export function processMessageContent(content: string): string {
  // Process LaTeX expressions
  content = content.replace(/\\\((.*?)\\\)/g, (_, expr) => `$${cleanMathExpression(expr)}$`);
  content = content.replace(/\\\[(.*?)\\\]/g, (_, expr) => `$$${cleanMathExpression(expr)}$$`);
  
  // Ensure proper spacing around math delimiters
  content = content.replace(/([^$])(\$[^$]+\$)([^$])/g, '$1 $2 $3');
  
  // Format display math blocks
  content = content.replace(/\n*\$\$(.*?)\$\$/gs, '\n\n$$$$1$$\n\n');
  
  // Handle plots and charts
  content = content.replace(/```(plot|chart)([\s\S]*?)```/g, (match, type, data) => {
    try {
      const jsonData = JSON.parse(data.trim());
      return `\`\`\`${type}\n${JSON.stringify(jsonData, null, 2)}\n\`\`\``;
    } catch (error) {
      console.warn('Error parsing plot/chart data:', error);
      return match;
    }
  });

  return content;
}