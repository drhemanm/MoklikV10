import React from 'react';
import { X, Download, FileText } from 'lucide-react';
import type { Resource } from '../../types/resource';

interface ResourcePreviewProps {
  resource: Resource;
  onClose: () => void;
  onDownload: () => void;
}

export function ResourcePreview({ resource, onClose, onDownload }: ResourcePreviewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {resource.previewUrl ? (
            <iframe
              src={resource.previewUrl}
              className="w-full h-full rounded-lg"
              title={`Preview of ${resource.title}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Preview not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}