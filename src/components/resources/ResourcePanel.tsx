import { useState, useEffect } from 'react';
import { Book, FileText, Video, ExternalLink, Loader2 } from 'lucide-react';
import { ExamPaperList } from './ExamPaperList.js';
import { resourceService } from '../../services/firebase/resources.js';
import type { Resource } from '../../types/resource.js';

export function ResourcePanel() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'papers' | 'guides' | 'practice'>('papers');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const data = await resourceService.getResources();
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
      setError('Failed to load learning resources');
    } finally {
      setIsLoading(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <Book className="w-5 h-5" />;
    }
  };

  const featuredResources = resources.slice(0, 4);

  return (
    <div className="glass rounded-2xl shadow-glass p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Book className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Learning Resources</h2>
          <p className="text-sm text-gray-600 mt-1">
            Access study materials and past papers
          </p>
        </div>
      </div>

      {/* Resource Type Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('papers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 ${
            activeTab === 'papers'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Past Papers
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 ${
            activeTab === 'guides'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Study Guides
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 ${
            activeTab === 'practice'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Practice Sets
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'papers' ? (
        <ExamPaperList />
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <>
              {/* Featured Resources */}
              <div className="grid gap-4 md:grid-cols-2">
                {featuredResources
                  .filter(resource => {
                    switch (activeTab) {
                      case 'guides':
                        return resource.type === 'pdf' && resource.category === 'study-guides'; 
                      case 'practice':
                        return resource.category === 'practice';
                      default:
                        return true;
                    }
                  })
                  .map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="text-blue-600 mt-1">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {resource.title}
                          </h4>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {resource.description}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full capitalize">
                            {resource.type === 'pdf' ? 'PDF Document' : 'Document'}
                          </span>
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full capitalize">
                            {resource.level}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
              </div>

              {/* View All Link */}
              {resources.length > 4 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => {/* Implement view all logic */}}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    View all resources
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}