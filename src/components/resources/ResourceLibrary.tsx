import React from 'react';
import { Book, FileText, BookOpen, FileType } from 'lucide-react';

export function ResourceLibrary() {
  const resources = [
    {
      id: 'syllabus',
      title: 'Course Syllabus',
      description: 'Official Cambridge Additional Mathematics Syllabus',
      url: 'https://drive.google.com/drive/folders/1UfLqzU_JDHWDLXfKCJ13PRwSx8uB1-ik?usp=sharing',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'workbook',
      title: 'Practice Workbook',
      description: 'Additional Mathematics Practice Workbook',
      url: 'https://drive.google.com/drive/folders/1Zz0HOU5VDPeKBNF-JdAJVDMbc9zGFSRr?usp=sharing',
      icon: <Book className="w-8 h-8" />,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'past-papers',
      title: 'Past Examination Papers',
      description: 'Access past papers and marking schemes',
      url: 'https://drive.google.com/drive/folders/1IDMOnsLdMDN-sAeJKYNHI7eGlVbAAnOK?usp=sharing',
      icon: <FileType className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="glass rounded-2xl shadow-glass p-6 hover:shadow-glow transition-all">
      <div className="flex items-center space-x-3 mb-6">
        <Book className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Learning Resources</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource.id}
            onClick={() => handleResourceClick(resource.url)}
            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all hover:scale-105 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${resource.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
            
            <div className="relative p-6">
              <div className="text-white mb-4">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
              <p className="text-white/80 text-sm mb-4">
                {resource.description}
              </p>
              <div className="flex items-center text-white/90 group-hover:translate-x-2 transition-transform">
                <span className="text-sm font-medium">Access Resource</span>
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Please Note:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Click on each card to access the Google Drive folders</li>
          <li>If you encounter any access issues, contact your course administrator</li>
          <li>Resources are regularly updated - check back often for new materials</li>
          <li>Make sure you're logged into your Google account to access the files</li>
        </ul>
      </div>
    </div>
  );
}