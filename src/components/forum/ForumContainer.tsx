import React, { useState } from 'react';
import { MessageSquare, Search, Filter } from 'lucide-react';
import { useForum } from '../../hooks/useForum.js';
import { TopicList } from './TopicList.js';
import { TopicView } from './TopicView.js';
import { NewTopicModal } from './NewTopicModal.js';
import { useAuth } from '../../hooks/useAuth.js';

export function ForumContainer() {
  const { user } = useAuth();
  const {
    topics,
    currentTopic,
    posts,
    isLoading,
    error,
    sortBy,
    searchQuery,
    loadTopics,
    searchTopics,
    loadTopic,
    createTopic,
    createPost,
    toggleLike
  } = useForum();

  const [showNewTopic, setShowNewTopic] = useState(false);
  const [searchInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput;
    if (query) {
      searchTopics(query);
    }
  };

  const handleSortChange = (newSort: 'newest' | 'popular' | 'unanswered') => {
    loadTopics(newSort);
  };

  return (
    <div className="glass rounded-2xl shadow-glass p-4 lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Discussion Forum</h2>
        </div>
        
        {!currentTopic && (
          <button
            onClick={() => setShowNewTopic(true)}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Discussion
          </button>
        )}
      </div>

      {!currentTopic && (
        <div className="flex flex-col gap-3 mb-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search discussions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          <div className="flex items-center space-x-2 text-sm">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'newest' | 'popular' | 'unanswered')}
              className="px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
          {error}
        </div>
      )}

      {currentTopic ? (
        <TopicView
          topic={currentTopic}
          posts={posts}
          onBack={() => loadTopics(sortBy)}
         onReply={createPost}
         onLike={(id: any, type: any) => user && toggleLike(type, id, user.uid)}
          isLoading={isLoading}
        />
      ) : (
        <TopicList
          topics={topics}
          onTopicClick={loadTopic}
         onLike={(id: any) => user && toggleLike('topic', id, user.uid)}
          isLoading={isLoading}
        />
      )}

      {showNewTopic && user && (
        <NewTopicModal
          onClose={() => setShowNewTopic(false)}
         onSubmit={async (title: any, content: any, tags: any) => {
            await createTopic(title, content, user.uid, user.email!, tags);
            setShowNewTopic(false);
          }}
        />
      )}
    </div>
  );
}