import { knowledgeBase } from '../db/index.js';
import { ExamPaper, Question } from '../../types/knowledge.js';

export class KnowledgeService {
  static async getRelevantExamQuestions(topic: string): Promise<Question[]> {
    return knowledgeBase.getQuestionsByTopic(topic);
  }

  static async getExaminerInsights(topic: string): Promise<string[]> {
    return knowledgeBase.getExaminerComments(topic);
  }

  static async getPastPapers(topic: string): Promise<ExamPaper[]> {
    return knowledgeBase.searchByTopic(topic);
  }

  static generateStudyGuide(topic: string, questions: Question[]): string {
    const difficultyLevels = ['Easy', 'Medium', 'Hard'];
    const questionsByDifficulty = questions.reduce((acc, q) => {
      acc[q.difficulty] = acc[q.difficulty] || [];
      acc[q.difficulty].push(q);
      return acc;
    }, {} as Record<string, Question[]>);

    let guide = `Study Guide for ${topic}\n\n`;

    difficultyLevels.forEach(level => {
      const levelQuestions = questionsByDifficulty[level] || [];
      guide += `${level} Questions (${levelQuestions.length}):\n`;
      levelQuestions.forEach(q => {
        guide += `- Question ${q.number} (${q.marks} marks)\n`;
        if (q.examinerComments) {
          guide += `  Examiner's Tip: ${q.examinerComments}\n`;
        }
      });
      guide += '\n';
    });

    return guide;
  }
}