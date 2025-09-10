import { z } from 'zod';

// Zod schemas for runtime validation
export const examPaperSchema = z.object({
  id: z.string(),
  year: z.number(),
  session: z.enum(['May/June', 'October/November']),
  paperNumber: z.number(),
  type: z.enum(['Question Paper', 'Mark Scheme', 'Examiner Report']),
  subject: z.enum(['Additional Mathematics']),
  level: z.enum(['O Level']),
  syllabus: z.string(),
  content: z.string(),
  topics: z.array(z.string()),
  questions: z.array(z.object({
    number: z.number(),
    topics: z.array(z.string()),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    marks: z.number(),
    content: z.string(),
    solution: z.string().optional(),
    examinerComments: z.string().optional()
  }))
});

// TypeScript types inferred from Zod schemas
export type ExamPaper = z.infer<typeof examPaperSchema>;
export type Question = ExamPaper['questions'][number];