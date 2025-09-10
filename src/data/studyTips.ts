export interface StudyTip {
  id: string;
  heading: string;
  content: string;
  category: 'concept' | 'strategy' | 'exam' | 'visualization' | 'mistake';
  topic?: string;
}

export const studyTips: StudyTip[] = [
  {
    id: 'tip-1',
    heading: 'Differentiation Shortcut',
    content: 'Remember "Power Rule": When differentiating $x^n$, multiply by the power and reduce it by 1. Example: $\\frac{d}{dx}(x^4) = 4x^3$',
    category: 'strategy',
    topic: 'calculus'
  },
  {
    id: 'tip-2',
    heading: 'Integration by Parts',
    content: 'Use LIATE order (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential) to choose u when integrating by parts.',
    category: 'strategy',
    topic: 'calculus'
  },
  {
    id: 'tip-3',
    heading: 'Quadratic Formula Visualization',
    content: 'The discriminant $b^2-4ac$ determines root types: positive = 2 real roots, zero = 1 real root, negative = complex roots.',
    category: 'visualization',
    topic: 'algebra'
  },
  {
    id: 'tip-4',
    heading: 'Common Integration Mistake',
    content: 'Don\'t forget the constant of integration! Every indefinite integral should end with $+ C$. Example: $\\int 2x dx = x^2 + C$',
    category: 'mistake',
    topic: 'calculus'
  },
  {
    id: 'tip-5',
    heading: 'Exam Time Management',
    content: 'Allocate time based on marks: roughly 1.5 minutes per mark. For a 12-mark question, spend about 18 minutes maximum.',
    category: 'exam'
  },
  {
    id: 'tip-6',
    heading: 'Trigonometric Identities',
    content: 'Draw a unit circle to quickly recall values. Key points: $\\sin(30°) = \\frac{1}{2}$, $\\cos(60°) = \\frac{1}{2}$, $\\tan(45°) = 1$',
    category: 'visualization',
    topic: 'trigonometry'
  },
  {
    id: 'tip-7',
    heading: 'Function Transformations',
    content: 'Inside brackets shift opposite: $f(x-2)$ shifts right. Outside brackets shift same way: $f(x)+2$ shifts up.',
    category: 'concept',
    topic: 'functions'
  },
  {
    id: 'tip-8',
    heading: 'Logarithm Properties',
    content: 'Convert division to subtraction: $\\log_a(\\frac{x}{y}) = \\log_a(x) - \\log_a(y)$. Useful for solving complex equations.',
    category: 'strategy',
    topic: 'logarithms'
  },
  {
    id: 'tip-9',
    heading: 'Vector Dot Product',
    content: 'If vectors are perpendicular, their dot product equals zero. Use this to find unknown angles or lengths.',
    category: 'concept',
    topic: 'vectors'
  },
  {
    id: 'tip-10',
    heading: 'Sequence Pattern Recognition',
    content: 'Check differences between terms. Constant first difference = arithmetic, constant ratio = geometric sequence.',
    category: 'strategy',
    topic: 'sequences'
  },
  {
    id: 'tip-11',
    heading: 'Complex Numbers Visualization',
    content: 'Plot complex numbers on Argand diagram. Multiplication by $i$ rotates 90° counterclockwise.',
    category: 'visualization',
    topic: 'complex-numbers'
  },
  {
    id: 'tip-12',
    heading: 'Exam Working Space',
    content: 'Show ALL working steps clearly. Even if final answer is wrong, you can earn method marks.',
    category: 'exam'
  },
  {
    id: 'tip-13',
    heading: 'Partial Fractions Setup',
    content: 'For distinct linear factors $(ax+b)$, use $\\frac{A}{ax+b}$. For repeated factors, use $\\frac{A}{ax+b} + \\frac{B}{(ax+b)^2}$',
    category: 'strategy',
    topic: 'algebra'
  },
  {
    id: 'tip-14',
    heading: 'Common Graph Mistake',
    content: 'When sketching $y=f(x)$, always identify domain restrictions. Example: $y=\\ln(x)$ is only defined for $x>0$',
    category: 'mistake',
    topic: 'functions'
  },
  {
    id: 'tip-15',
    heading: 'Binomial Expansion Check',
    content: 'Number of terms = power + 1. In $(x+2)^4$, expect 5 terms. Use this to catch errors.',
    category: 'strategy',
    topic: 'algebra'
  }
];