import { useState } from 'react';
import { Brain, Upload, MessageSquare } from 'lucide-react';
import { EnhancedChatInterface } from '../components/chat/EnhancedChatInterface';
import { FileUpload } from '../components/FileUpload';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function ChatPage() {
  const [activeMode, setActiveMode] = useState<'chat' | 'upload'>('chat');

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Tutor Chat</h1>
              <p className="text-sm text-gray-500">Get personalized help with your math questions</p>
            </div>
          </div>
        </div>

        {/* Mode Selection Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                activeMode === 'chat'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Chat with AI</span>
            </button>

            <button
              onClick={() => setActiveMode('upload')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                activeMode === 'upload'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload Work for Review</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <ErrorBoundary>
          {activeMode === 'chat' ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <EnhancedChatInterface
                onBack={() => {}}
                selectedTopic={null}
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Upload Your Work for AI Review
                </h2>
                <p className="text-gray-600 max-w-xl mx-auto">
                  Upload your math homework, assignments, or any written work to get detailed
                  feedback and suggestions from Moklik AI.
                </p>
              </div>

              <FileUpload />
            </div>
          )}
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
}
