import React, { useState } from 'react';
import { Paperclip, X, Loader2 } from 'lucide-react';
import { attachmentService } from '../../services/firebase/attachments';

interface AttachmentUploadProps {
  onUpload: (url: string) => void;
  userId: string;
}

export function AttachmentUpload({ onUpload, userId }: AttachmentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const url = await attachmentService.uploadAttachment(file, userId);
      onUpload(url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
        <Paperclip className="w-4 h-4" />
        <span className="text-sm">Attach File</span>
        <input
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf"
          disabled={isUploading}
        />
      </label>

      {isUploading && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          Uploading...
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <X className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
}