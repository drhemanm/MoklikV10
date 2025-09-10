import React, { useState } from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';
import { ExamPaperService } from '../../services/firebase/examPapers.js';
import type { ExamPaper, ExamPaperFilter } from '../../types/examPaper.js';
import { LoadingSpinner } from '../ui/LoadingSpinner.js';

export function ExamPaperList() {
  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ExamPaperFilter>({});

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await ExamPaperService.searchPapers(filter);
      setPapers(results);
    } catch (error) {
      setError('Failed to load exam papers');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (paper: ExamPaper) => {
    try {
      window.open(paper.url, '_blank');
      await ExamPaperService.updateLastAccessed(paper.id);
    } catch (error) {
      console.error('Error downloading paper:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Syllabus Code
          </label>
          <input
            type="text"
            pattern="\d{4}"
            placeholder="e.g., 4037"
            value={filter.syllabusCode || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, syllabusCode: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Session
          </label>
          <select
            value={filter.session || ''}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              session: e.target.value as 'S' | 'W' | undefined 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="S">Summer</option>
            <option value="W">Winter</option>
          </select>
        </div>

        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="text"
            pattern="\d{2}"
            placeholder="e.g., 23"
            value={filter.year || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, year: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filter.documentType || ''}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              documentType: e.target.value as 'MS' | 'QP' | undefined 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="QP">Question Paper</option>
            <option value="MS">Marking Scheme</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : papers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No exam papers found. Try adjusting your search filters.
        </div>
      ) : (
        <div className="grid gap-4">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {paper.syllabusCode} {paper.session}{paper.year} {paper.documentType}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {paper.documentType === 'QP' ? 'Question Paper' : 'Marking Scheme'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleDownload(paper)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}