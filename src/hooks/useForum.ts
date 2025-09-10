import { useState, useCallback } from 'react';
import { forumService } from '../services/firebase/forum';
import type { ForumTopic, ForumPost, SortOption } from '../types/forum';

export function useForum() {
  const [state, setState] = useState<{
    topics: ForumTopic[];
    currentTopic?: ForumTopic;
    posts: ForumPost[];
    isLoading: boolean;
    error: string | null;
    sortBy: SortOption;
    searchQuery: string;
  }>({
    topics: [],
    posts: [],
    isLoading: false,
    error: null,
    sortBy: 'newest',
    searchQuery: ''
  });

  const loadTopics = useCallback(async (sortBy: SortOption = 'newest') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const topics = await forumService.getTopics(sortBy);
      setState(prev => ({
        ...prev,
        topics,
        sortBy,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load topics',
        isLoading: false
      }));
    }
  }, []);

  const searchTopics = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadTopics(state.sortBy);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, searchQuery: query }));
    try {
      const topics = await forumService.searchTopics(query);
      setState(prev => ({
        ...prev,
        topics,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Search failed',
        isLoading: false
      }));
    }
  }, [state.sortBy, loadTopics]);

  const loadTopic = useCallback(async (topicId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const [topic, posts] = await Promise.all([
        forumService.getTopic(topicId),
        forumService.getPosts(topicId)
      ]);
      setState(prev => ({
        ...prev,
        currentTopic: topic,
        posts,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load topic',
        isLoading: false
      }));
    }
  }, []);

  const createTopic = useCallback(async (
    title: string,
    content: string,
    authorId: string,
    authorName: string,
    tags: string[] = []
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const topicId = await forumService.createTopic({
        title,
        content,
        authorId,
        authorName,
        tags
      });
      await loadTopics(state.sortBy);
      return topicId;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create topic',
        isLoading: false
      }));
      throw error;
    }
  }, [state.sortBy, loadTopics]);

  const createPost = useCallback(async (
    topicId: string,
    content: string,
    authorId: string,
    authorName: string,
    parentId?: string
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const postId = await forumService.createPost({
        topicId,
        content,
        authorId,
        authorName,
        parentId
      });
      await loadTopic(topicId);
      return postId;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create post',
        isLoading: false
      }));
      throw error;
    }
  }, [loadTopic]);

  const toggleLike = useCallback(async (
    type: 'topic' | 'post',
    id: string,
    userId: string
  ) => {
    try {
      await forumService.toggleLike(type, id, userId);
      if (type === 'topic') {
        loadTopics(state.sortBy);
      } else if (state.currentTopic) {
        loadTopic(state.currentTopic.id);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update like'
      }));
    }
  }, [state.sortBy, state.currentTopic, loadTopics, loadTopic]);

  return {
    ...state,
    loadTopics,
    searchTopics,
    loadTopic,
    createTopic,
    createPost,
    toggleLike
  };
}