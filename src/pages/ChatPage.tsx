import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Upload, MessageSquare } from 'lucide-react';
import { EnhancedChatInterface } from '../components/chat/EnhancedChatInterface';
import { FileUpload } from '../components/FileUpload';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function ChatPage() {
  const [activeMode, setActiveMode] = useState<'chat' | 'upload'>('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">Moklik AI Tutor</span>
            </div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">AI Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                activeMode === 'chat'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat with AI</span>
            </button>
            
            <button
              onClick={() => setActiveMode('upload')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                activeMode === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload Work for Review</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <ErrorBoundary>
          {activeMode === 'chat' ? (
            <div className="bg-white rounded-xl shadow-sm">
              <EnhancedChatInterface
                onBack={() => {}} // Empty function since we handle navigation differently
                selectedTopic={null}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Upload Your Work for AI Review
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Upload your math homework, assignments, or any written work to get detailed 
                  feedback and suggestions from Moklik AI.
                </p>
              </div>
              
              <FileUpload />
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}