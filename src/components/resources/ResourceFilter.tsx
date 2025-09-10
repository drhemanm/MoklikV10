import { Filter } from 'lucide-react';

export function ResourceFilter() {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">All Formats</option>
          <option value="pdf">PDF</option>
          <option value="epub">EPUB</option>
          <option value="doc">DOC</option>
        </select>
      </div>
      
      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        <option value="">All Subjects</option>
        <option value="math">Mathematics</option>
        <option value="physics">Physics</option>
        <option value="chemistry">Chemistry</option>
      </select>
      
      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="popular">Most Downloaded</option>
      </select>
    </div>
  );
}