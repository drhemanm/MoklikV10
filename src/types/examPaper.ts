import { z } from 'zod';

export const examPaperSchema = z.object({
  id: z.string(),
  syllabusCode: z.string().regex(/^\d{4}$/, 'Syllabus code must be 4 digits'),
  session: z.enum(['S', 'W']), // S for Summer, W for Winter
  year: z.string().regex(/^\d{2}$/, 'Year must be 2 digits'),
  documentType: z.enum(['MS', 'QP']), // MS for Marking Scheme, QP for Question Paper
  url: z.string().url(),
  uploadedAt: z.number(),
  lastAccessed: z.number().optional()
});

export type ExamPaper = z.infer<typeof examPaperSchema>;

export interface ExamPaperFilter {
  syllabusCode?: string;
  session?: 'S' | 'W';
  year?: string;
  documentType?: 'MS' | 'QP';
}