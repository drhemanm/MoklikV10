import { FileText, Info } from 'lucide-react';
import { WritingSubmission } from '../components/writing/WritingSubmission';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export function WritingReview() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Writing Review</h1>
              <p className="text-sm text-gray-500">Get AI-powered feedback on your writing</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <WritingSubmission />

        {/* Info Footer */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Privacy Notice</p>
              <p className="text-blue-700">
                Your submissions are analyzed securely and are not stored permanently.
                For best results, submit writing samples of at least 100 words.
                Our AI provides feedback based on standard English writing conventions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
