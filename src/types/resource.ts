export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'ebook' | 'exam' | 'syllabus';
  format: string;
  size: number;
  downloads: number;
  path: string;
  previewUrl?: string;
  updatedAt: number;
  category: string;
  level: 'o-level' | 'a-level' | 'both';
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}