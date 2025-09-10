import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { DocumentProcessor } from '../services/document/documentProcessor.js';
import { useChat } from '../hooks/useChat.js';
import { useAuth } from '../hooks/useAuth.js';
import { LoadingSpinner } from './ui/LoadingSpinner.js';
import { ChatContainer } from './chat/ChatContainer.js';

const ASSISTANT_ID = import.meta.env.VITE_OPENAI_AGENT_ID;

export function FileUpload() {
  const { sendMessage } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDocument, setCurrentDocument] = useState<{
    name: string;
    content: string;
  } | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    setError(null);
    setUploadProgress(0);
    setIsProcessing(true);
    
    for (const file of Array.from(files)) {
      try {
        // Handle image files with AI analysis
        if (file.type.startsWith('image/')) {
          const { ImageAnalysisService } = await import('../services/ai/imageAnalysis.js');
          
          // Validate file first
          const validation = ImageAnalysisService.validateImageFile(file);
          if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            continue;
          }
          
          // Process the image
          const base64 = await ImageAnalysisService.fileToBase64(file);
          const result = await ImageAnalysisService.analyzeImage(base64, file.name);
          
          if (!result.success) {
            setError(result.error || 'Failed to analyze image');
            continue;
          }
          
          if (!result.isMathRelated) {
            setError(result.error || 'This image doesn\'t contain mathematical content');
            continue;
          }
          
          // Set document content for math-related images
          setCurrentDocument({
            name: file.name,
            content: result.content || ''
          });

          // Send initial message to chat
          await sendMessage(
            `I've uploaded an image named "${file.name}" containing mathematical content. Please analyze it and help me understand the problems or concepts shown.`,
            'document-review'
          );
          
          // Send the analysis content
          if (result.content) {
            await sendMessage(result.content, 'document-review');
          }
          
          continue;
        }
        
        // Handle other file types (PDF, DOC, etc.) as before
        const result = await DocumentProcessor.processDocument(file, ASSISTANT_ID);
        
        if (!result.success) {
          setError(result.error);
          continue;
        }

        setCurrentDocument({
          name: file.name,
          content: result.content || ''
        });

        // Send initial message to chat
        await sendMessage(
          `I've uploaded a document named "${file.name}". Please analyze it and help me understand its content, referencing relevant past papers and marking schemes where applicable.`,
          'document-review'
        );
        
        // Send the document content for analysis
        if (result.content) {
          // Add context about past papers availability
          await sendMessage(
            "You have access to past examination papers and marking schemes in your knowledge base. Please use them to provide comprehensive analysis and feedback.",
            'document-review'
          );
          await sendMessage(result.content, 'document-review');
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setError('Error processing file. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.txt,.doc,.docx"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner />
              <div className="mt-2">
                <p className="text-sm text-gray-600">Processing file...</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm flex items-center">
            <span>{error}</span>
            <X className="w-4 h-4 ml-2 cursor-pointer" onClick={() => setError(null)} />
          </div>
        )}
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragging
            ? 'Drop your files here...'
            : 'Drag & drop your documents here, or click to select files'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: PDF, TXT, DOC, DOCX (max 10MB)
        </p>
      </div>

      {currentDocument && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">{currentDocument.name}</h3>
            </div>
            <button
              onClick={() => setCurrentDocument(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <ChatContainer topic="document-review" />
          </div>
        </div>
      )}
    </div>
  );
}