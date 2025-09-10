import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Filter, 
  PlusCircle, 
  ArrowLeft,
  Users,
  TrendingUp,
  Clock,
  Tag
} from 'lucide-react';
import { SearchInput } from '../ui/SearchInput.js';
import { Card } from '../ui/Card.js';
import { Button } from '../ui/Button.js';

interface ForumLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  onlineUsers?: number;
}

export function ForumLayout({ 
  children, 
  title = "Discussion Forum",
  showBackButton = false,
  onBack,
  onlineUsers = 0
}: ForumLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'unanswered'>('latest');

  const categories = [
    { id: 'algebra', name: 'Algebra' },
    { id: 'geometry', name: 'Geometry' },
    { id: 'calculus', name: 'Calculus' },
    { id: 'trigonometry', name: 'Trigonometry' },
    { id: 'statistics', name: 'Statistics' },
    { id: 'general', name: 'General' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {showBackButton ? (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Discussions</span>
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            )}
            
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">{title}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Online: {onlineUsers}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search discussions..."
                  onClear={() => setSearchQuery('')}
                />
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-gray-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === null
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Topics
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-gray-600" />
                  Sort By
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy('latest')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                      sortBy === 'latest'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Latest
                  </button>
                  
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                      sortBy === 'popular'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Popular
                  </button>
                  
                  <button
                    onClick={() => setSortBy('unanswered')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                      sortBy === 'unanswered'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Unanswered
                  </button>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                fullWidth 
                leftIcon={<PlusCircle className="w-5 h-5" />}
                onClick={() => {}}
              >
                New Discussion
              </Button>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}