import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { storage } from '../../config/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { resourceService } from '../../services/firebase/resources.js';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

export function ResourceUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resourceData, setResourceData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'both' as const
  });

  const handleFileUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 50MB');
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only PDF, Word, and PowerPoint files are allowed');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `resources/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Add resource to Firestore
      await resourceService.addResource({
        ...resourceData,
        url,
        type: file.type.includes('pdf') ? 'ebook' : 'ebook',
        format: file.type,
        size: file.size,
        downloads: 0,
        path: `resources/${Date.now()}_${file.name}`,
      });

      // Reset form
      setResourceData({
        title: '',
        description: '',
        category: '',
        level: 'both'
      });

      alert('Resource uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload resource. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Learning Resource</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={resourceData.title}
            onChange={(e) => setResourceData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={resourceData.description}
            onChange={(e) => setResourceData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            value={resourceData.category}
            onChange={(e) => setResourceData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Study Guide, Practice Problems"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Level
          </label>
          <select
            value={resourceData.level}
            onChange={(e) => setResourceData(prev => ({ ...prev, level: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="o-level">O-Level</option>
            <option value="a-level">A-Level</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
        >
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              Drag and drop your file here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-2">
              PDF, Word, or PowerPoint (max 50MB)
            </p>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {isUploading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
            <span>Uploading resource...</span>
          </div>
        )}
      </div>
    </div>
  );
}