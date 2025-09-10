import type { Topic } from '../types/topic';

export const topics: Topic[] = [
  {
    id: 'algebra',
    title: 'Algebra',
    description: 'Learn about algebraic expressions, equations, inequalities, and their applications',
    difficulty: 'beginner',
    category: 'o-level'
  },
  {
    id: 'functions',
    title: 'Functions and Graphs',
    description: 'Explore different types of functions, their graphs, and transformations',
    difficulty: 'intermediate',
    category: 'o-level'
  },
  {
    id: 'geometry',
    title: 'Geometry and Trigonometry',
    description: 'Study geometric properties, trigonometric ratios, and their applications',
    difficulty: 'intermediate',
    category: 'o-level'
  },
  {
    id: 'statistics',
    title: 'Statistics and Probability',
    description: 'Learn data handling, probability theory, and statistical analysis',
    difficulty: 'beginner',
    category: 'o-level'
  },
  {
    id: 'vectors',
    title: 'Vectors and Transformation',
    description: 'Understand vector operations and geometric transformations',
    difficulty: 'intermediate',
    category: 'o-level'
  },
  {
    id: 'sets',
    title: 'Sets and Logic',
    description: 'Study set theory, Venn diagrams, and logical reasoning',
    difficulty: 'beginner',
    category: 'o-level'
  },
  // A-Level topics
  {
    id: 'calculus',
    title: 'Differential Calculus',
    description: 'Master derivatives, rates of change, and optimization problems',
    difficulty: 'advanced',
    category: 'a-level'
  },
  {
    id: 'integration',
    title: 'Integral Calculus',
    description: 'Explore integration techniques and their applications',
    difficulty: 'advanced',
    category: 'a-level'
  },
  {
    id: 'complex-numbers',
    title: 'Complex Numbers',
    description: "Study complex numbers, Argand diagrams, and De Moivre's theorem",
    difficulty: 'advanced',
    category: 'a-level'
  }
];