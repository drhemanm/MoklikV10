import React from 'react';
import { Download, FileText, Video, Book } from 'lucide-react';
import { useResources } from '../hooks/useResources';

export function ResourceLibrary() {
  const { resources, downloadResource } = useResources();

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Learning Resources</h2>
      <div className="grid gap-4">
        {resources.map((resource: any) => (
          <div
            key={resource.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-blue-600">
                {getResourceIcon(resource.type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            </div>
            <button
              onClick={() => downloadResource(resource.id)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}