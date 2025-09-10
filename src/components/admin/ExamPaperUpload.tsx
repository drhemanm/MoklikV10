import React, { useState } from 'react';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import { ExamPaperService } from '../../services/firebase/examPapers';
import type { ExamPaper } from '../../types/examPaper';

export function ExamPaperUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Partial<ExamPaper>>({
    syllabusCode: '',
    session: 'S',
    year: '',
    documentType: 'QP'
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      await ExamPaperService.uploadPaper(file, metadata);
      // Reset form
      setMetadata({
        syllabusCode: '',
        session: 'S',
        year: '',
        documentType: 'QP'
      });
      e.target.value = '';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Upload Exam Paper
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Syllabus Code
            </label>
            <input
              type="text"
              pattern="\d{4}"
              placeholder="e.g., 4037"
              value={metadata.syllabusCode}
              onChange={(e) => setMetadata(prev => ({ 
                ...prev, 
                syllabusCode: e.target.value 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session
            </label>
            <select
              value={metadata.session}
              onChange={(e) => setMetadata(prev => ({ 
                ...prev, 
                session: e.target.value as 'S' | 'W' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="S">Summer</option>
              <option value="W">Winter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="text"
              pattern="\d{2}"
              placeholder="e.g., 23"
              value={metadata.year}
              onChange={(e) => setMetadata(prev => ({ 
                ...prev, 
                year: e.target.value 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              value={metadata.documentType}
              onChange={(e) => setMetadata(prev => ({ 
                ...prev, 
                documentType: e.target.value as 'MS' | 'QP' 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="QP">Question Paper</option>
              <option value="MS">Marking Scheme</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="mt-6">
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="exam-paper-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="exam-paper-upload"
            className={`flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isUploading 
                ? 'bg-gray-100 border-gray-300' 
                : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                <span className="text-gray-500">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600">Select File</span>
              </>
            )}
          </label>
          <p className="mt-2 text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX
          </p>
        </div>
      </div>
    </div>
  );
}