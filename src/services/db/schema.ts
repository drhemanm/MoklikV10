export const schema = `
CREATE TABLE IF NOT EXISTS exam_papers (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  session TEXT NOT NULL,
  paper_number INTEGER NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  level TEXT NOT NULL,
  syllabus TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  paper_id TEXT NOT NULL,
  number INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  marks INTEGER NOT NULL,
  content TEXT NOT NULL,
  solution TEXT,
  examiner_comments TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paper_id) REFERENCES exam_papers(id)
);

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_topics (
  question_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (question_id, topic_id),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE IF NOT EXISTS paper_topics (
  paper_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (paper_id, topic_id),
  FOREIGN KEY (paper_id) REFERENCES exam_papers(id),
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE INDEX IF NOT EXISTS idx_papers_year ON exam_papers(year);
CREATE INDEX IF NOT EXISTS idx_papers_session ON exam_papers(session);
CREATE INDEX IF NOT EXISTS idx_papers_type ON exam_papers(type);
CREATE INDEX IF NOT EXISTS idx_questions_paper ON questions(paper_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
`;