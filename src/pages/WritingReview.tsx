import { Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { WritingSubmission } from '../components/writing/WritingSubmission';

export function WritingReview() {
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
              <span className="font-semibold text-gray-900">Moklik Writing Tutor</span>
            </div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">AI Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <WritingSubmission />
      </div>

      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Privacy Notice:</strong> Your submissions are analyzed securely and are not stored permanently.
            </p>
            <p>
              For best results, submit writing samples of at least 100 words. 
              Our AI provides feedback based on standard English writing conventions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}