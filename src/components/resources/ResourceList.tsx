import React from 'react';
import { FileText, Download, Eye, Clock, FileType } from 'lucide-react';
import type { Resource } from '../../types/resource';

interface ResourceListProps {
  resources: Resource[];
  onDownload: (resource: Resource) => void;
  onPreview: (resource: Resource) => void;
}

export function ResourceList({ resources, onDownload, onPreview }: ResourceListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'ebook':
        return <FileText className="w-5 h-5" />;
      case 'exam':
        return <FileType className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="flex items-start p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onDownload(resource)}
        >
          <div className="text-blue-600 mt-1">
            {getResourceIcon(resource.type)}
          </div>
          
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{resource.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
              </div>
              
              <div>
                <button
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Access Resources</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}