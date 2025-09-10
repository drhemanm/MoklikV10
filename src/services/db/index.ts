import { ConnectionManager } from './connectionManager.js';
import { schema } from './schema.js';
import { ExamPaper, Question } from '../../types/knowledge.js';
import { nanoid } from 'nanoid';

const connectionManager = ConnectionManager.getInstance({
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  acquireTimeoutMillis: 10000
});

export class KnowledgeBase {
  private async getConnection() {
    return await connectionManager.getConnection();
  }

  constructor() {
    this.init();
  }

  private async init() {
    const connection = await this.getConnection();
    try {
      await connection.exec(schema);
    } finally {
      await connectionManager.releaseConnection(connection);
    }
  }

  async addExamPaper(paper: ExamPaper): Promise<void> {
    const connection = await this.getConnection();
    try {
      const stmt = connection.prepare(`
        INSERT INTO exam_papers (id, year, session, paper_number, type, subject, level, syllabus, content)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const topicStmt = connection.prepare(`
        INSERT OR IGNORE INTO topics (id, name) VALUES (?, ?)
      `);

      const paperTopicStmt = connection.prepare(`
        INSERT INTO paper_topics (paper_id, topic_id) VALUES (?, ?)
      `);

      const questionStmt = connection.prepare(`
        INSERT INTO questions (id, paper_id, number, difficulty, marks, content, solution, examiner_comments)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const questionTopicStmt = connection.prepare(`
        INSERT INTO question_topics (question_id, topic_id) VALUES (?, ?)
      `);

      await connection.transaction(async () => {
        // Insert paper
        stmt.run(
          paper.id,
          paper.year,
          paper.session,
          paper.paperNumber,
          paper.type,
          paper.subject,
          paper.level,
          paper.syllabus,
          paper.content
        );

        // Insert topics and paper-topic relationships
        paper.topics.forEach((topic: string) => {
          const topicId = nanoid();
          topicStmt.run(topicId, topic);
          paperTopicStmt.run(paper.id, topicId);
        });

        // Insert questions and their topics
        paper.questions.forEach((question: any) => {
          const questionId = nanoid();
          questionStmt.run(
            questionId,
            paper.id,
            question.number,
            question.difficulty,
            question.marks,
            question.content,
            question.solution,
            question.examinerComments
          );

          question.topics.forEach((topic: string) => {
            const topicId = this.getTopicId(topic);
            if (topicId) {
              questionTopicStmt.run(questionId, topicId);
            }
          });
        });
      })();
    } finally {
      await connectionManager.releaseConnection(connection);
    }
  }

  private async getTopicId(topicName: string): Promise<string | null> {
    const connection = await this.getConnection();
    try {
      const result = await connection.prepare('SELECT id FROM topics WHERE name = ?').get(topicName) as any;
      return result ? result.id : null;
    } finally {
      await connectionManager.releaseConnection(connection);
    }
  }

  async searchByTopic(topic: string): Promise<ExamPaper[]> {
    const connection = await this.getConnection();
    try {
      const query = `
        SELECT DISTINCT ep.*
        FROM exam_papers ep
        JOIN paper_topics pt ON ep.id = pt.paper_id
        JOIN topics t ON pt.topic_id = t.id
        WHERE t.name LIKE ?
        ORDER BY ep.year DESC, ep.session DESC
      `;

      const results = await connection.prepare(query).all(`%${topic}%`) as any[];
      return results.map(row => ({
        id: row.id,
        year: row.year,
        session: row.session,
        paperNumber: row.paper_number,
        type: row.type,
        subject: row.subject,
        level: row.level,
        syllabus: row.syllabus,
        content: row.content,
        topics: [],
        questions: []
      }));
    } finally {
      await connectionManager.releaseConnection(connection);
    }
  }

  async searchByYear(year: number): Promise<ExamPaper[]> {
    const connection = await this.getConnection();
    try {
      const results = await connection.prepare('SELECT * FROM exam_papers WHERE year = ?').all(year) as any[];
      return results.map(row => ({
        id: row.id,
        year: row.year,
        session: row.session,
        paperNumber: row.paper_number,
        type: row.type,
        subject: row.subject,
        level: row.level,
        syllabus: row.syllabus,
        content: row.content,
        topics: [],
        questions: []
      }));
    } finally {
      await connectionManager.releaseConnection(connection);
    }
  }

  async getQuestionsByTopic(topic: string): Promise<Question[]> {
    const connection = await this.getConnection();
    try {
      const query = `
        SELECT q.*
        FROM questions q
        JOIN question_topics qt ON q.id = qt.question_id
        JOIN topics t ON qt.topic_id = t.id
        WHERE t.name LIKE ?
        ORDER BY q.difficulty
      `;

      const results = await connection.prepare(query).all(`%${topic}%`) as any[];
      return results.map(row => ({
        number: row.number,
        topics: [],
        difficulty: row.difficulty,
        marks: row.marks,
        content: row.content,
        solution: row.solution,
        examinerComments: row.examiner_comments
      }));
    } finally {
      await connectionManager.releaseConnection(connection);
    }
  }

  async getExaminerComments(topic: string): Promise<string[]> {
    const connection = await this.getConnection();
    try {
      const query = `
        SELECT DISTINCT q.examiner_comments
        FROM questions q
        JOIN question_topics qt ON q.id = qt.question_id
        JOIN topics t ON qt.topic_id = t.id
        WHERE t.name LIKE ?
        AND q.examiner_comments IS NOT NULL
      `;

      return (await connection.prepare(query).all(`%${topic}%`)).map((row: any) => row.examiner_comments);
    } finally {
      await connectionManager.releaseConnection(connection);
    }
  }
}

// Export singleton instance
export const knowledgeBase = new KnowledgeBase();