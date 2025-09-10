import { Timestamp } from 'firebase/firestore';

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tags: string[];
  views: number;
  likes: number;
  replyCount: number;
}

export interface ForumPost {
  id: string;
  topicId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likes: number;
  attachments?: Attachment[];
  parentId?: string; // For nested replies
  mentions?: string[]; // User IDs mentioned in the post
}

export interface Attachment {
  id: string;
  type: 'image' | 'pdf';
  url: string;
  name: string;
  size: number;
}

export type SortOption = 'newest' | 'popular' | 'unanswered';

export interface ForumState {
  topics: ForumTopic[];
  currentTopic?: ForumTopic;
  posts: ForumPost[];
  isLoading: boolean;
  error: string | null;
  sortBy: SortOption;
  searchQuery: string;
}