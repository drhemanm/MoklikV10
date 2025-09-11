import React, { useRef, useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { DocumentProcessor } from '../services/document/documentProcessor';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ChatContainer } from './chat/ChatContainer';
import { SubscriptionGate } from './subscription/SubscriptionGate';

const ASSISTANT_ID = import.meta.env.VITE_OPENAI_AGENT_ID;

interface ProcessedDocument {
  name: string;
  content: string;
  extractedText?: string;
  analysisComplete: boolean;
}

export function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [currentDocument, setCurrentDocument] = useState<ProcessedDocument | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setError('');
    setSuccess('');
    setUploadProgress(0);
    setIsProcessing(true);
    
    // Process only the first file
    const file = files[0];
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 200);

      // Handle image files with AI analysis (existing logic)
      if (file.type.startsWith('image/')) {
        clearInterval(progressInterval);
        setUploadProgress(50);
        
        const { ImageAnalysisService } = await import('../services/ai/imageAnalysis');
        
        const validation = ImageAnalysisService.validateImageFile(file);
        if (!validation.valid) {
          setError(validation.error || 'Invalid image file');
          return;
        }
        
        setUploadProgress(75);
        const base64 = await ImageAnalysisService.fileToBase64(file);
        const result = await ImageAnalysisService.analyzeImage(base64, file.name);
        
        setUploadProgress(100);
        
        if (!result.success) {
          setError(result.error || 'Failed to analyze image');
          return;
        }
        
        if (!result.isMathRelated) {
          setError(result.error || 'This image doesn\'t contain mathematical content');
          return;
        }
        
        setCurrentDocument({
          name: file.name,
          content: result.content || '',
          extractedText: result.content || '',
          analysisComplete: true
        });
        
        setSuccess('Image analyzed successfully! You can now ask questions about the content.');
        return;
      }
      
      // Handle document files (PDF, DOCX, TXT)
      clearInterval(progressInterval);
      setUploadProgress(50);
      
      const result = await DocumentProcessor.processDocument(file, ASSISTANT_ID);
      
      setUploadProgress(100);
      
      if (!result.success) {
        setError(result.error || 'Failed to process document');
        return;
      }

      setCurrentDocument({
        name: file.name,
        content: result.content || '',
        extractedText: result.extractedText || '',
        analysisComplete: true
      });
      
      setSuccess(`Document "${file.name}" processed successfully! AI analysis complete.`);

    } catch (error) {
      console.error('Error processing file:', error);
      setError(`Error processing "${file.name}". Please try again.`);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
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

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <SubscriptionGate 
      feature="Document Upload & AI Analysis" 
      fallbackMessage="Upload and analyze your math homework, PDFs, and images with AI-powered assistance. Subscribe to unlock unlimited document processing."
    >
      <div className="space-y-6">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            ${isProcessing ? 'pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt,.doc,.docx,image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          
          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <LoadingSpinner />
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">Processing document...</p>
                  <p className="text-xs text-gray-600 mt-1">AI is analyzing your content</p>
                  <div className="w-48 h-2 bg-gray-200 rounded-full mt-3 mx-auto">
                    <div
                      className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(uploadProgress)}% complete
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 font-medium">
            {isDragging
              ? 'Drop your files here...'
              : 'Drag & drop your documents here, or click to select files'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supported: PDF, TXT, DOC, DOCX, Images • Max 10MB • AI-powered analysis
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">Upload Error</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={clearMessages}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-green-800 font-medium">Success!</p>
              <p className="text-sm text-green-600 mt-1">{success}</p>
            </div>
            <button
              onClick={clearMessages}
              className="text-green-400 hover:text-green-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Document Analysis Results */}
        {currentDocument && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Document Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentDocument.name}</h3>
                    <p className="text-sm text-gray-600">
                      {currentDocument.analysisComplete ? 'AI analysis complete' : 'Processing...'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentDocument(null);
                    clearMessages();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* AI Analysis Preview */}
            {currentDocument.content && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">AI Analysis Preview</h4>
                <div className="text-sm text-gray-700 bg-white rounded-lg p-3 border max-h-32 overflow-y-auto">
                  {currentDocument.content.substring(0, 300)}
                  {currentDocument.content.length > 300 && '...'}
                </div>
              </div>
            )}
            
            {/* Chat Interface */}
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Ask Questions About Your Document</h4>
              <ChatContainer 
                topic="document-review"
                initialContext={{
                  documentName: currentDocument.name,
                  documentContent: currentDocument.content,
                  extractedText: currentDocument.extractedText
                }}
              />
            </div>
          </div>
        )}
      </div>
    </SubscriptionGate>
  );
}
