import React, { useRef, useState } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, BookOpen, Brain } from 'lucide-react';
import { DocumentProcessor } from '../services/document/documentProcessor';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ChatContainer } from './chat/ChatContainer';
import { SubscriptionGate } from './subscription/SubscriptionGate';

const ASSISTANT_ID = import.meta.env.VITE_OPENAI_AGENT_ID;

interface ProcessedDocument {
  name: string;
  content: string;
  extractedText: string;
  wordCount: number;
  detectedTopics: string[];
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
  const [processingStage, setProcessingStage] = useState<string>('');

  const updateProgress = (progress: number, stage: string) => {
    setUploadProgress(progress);
    setProcessingStage(stage);
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setError('');
    setSuccess('');
    setUploadProgress(0);
    setIsProcessing(true);
    setProcessingStage('');
    
    // Process only the first file
    const file = files[0];
    
    try {
      updateProgress(10, 'Validating file...');
      
      // Handle image files with existing ImageAnalysisService
      if (file.type.startsWith('image/')) {
        updateProgress(25, 'Analyzing image...');
        
        const { ImageAnalysisService } = await import('../services/ai/imageAnalysis');
        
        const validation = ImageAnalysisService.validateImageFile(file);
        if (!validation.valid) {
          setError(validation.error || 'Invalid image file');
          return;
        }
        
        updateProgress(50, 'Processing image content...');
        const base64 = await ImageAnalysisService.fileToBase64(file);
        
        updateProgress(75, 'AI analysis in progress...');
        const result = await ImageAnalysisService.analyzeImage(base64, file.name);
        
        updateProgress(100, 'Complete!');
        
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
          wordCount: result.content ? result.content.split(/\s+/).length : 0,
          detectedTopics: ['Image Analysis'],
          analysisComplete: true
        });
        
        setSuccess(`Image "${file.name}" analyzed successfully! Math content detected and ready for discussion.`);
        return;
      }
      
      // Handle document files with enhanced DocumentProcessor
      updateProgress(25, 'Reading document...');
      
      const result = await DocumentProcessor.processDocument(file, ASSISTANT_ID);
      
      updateProgress(75, 'AI analysis in progress...');
      
      if (!result.success) {
        setError(result.error || 'Failed to process document');
        return;
      }

      updateProgress(100, 'Analysis complete!');

      setCurrentDocument({
        name: file.name,
        content: result.content || '',
        extractedText: result.extractedText || '',
        wordCount: result.wordCount || 0,
        detectedTopics: result.detectedTopics || [],
        analysisComplete: true
      });
      
      const topicsText = result.detectedTopics && result.detectedTopics.length > 0 
        ? ` Topics detected: ${result.detectedTopics.join(', ')}.`
        : '';
      
      setSuccess(`Document "${file.name}" processed successfully! ${result.wordCount} words extracted.${topicsText} Ready for discussion.`);

    } catch (error) {
      console.error('Error processing file:', error);
      setError(`Error processing "${file.name}": ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      setProcessingStage('');
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

  const resetUpload = () => {
    setCurrentDocument(null);
    clearMessages();
    setUploadProgress(0);
    setProcessingStage('');
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
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 relative
            ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
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
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-xl">
              <div className="text-center max-w-sm">
                <LoadingSpinner />
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">Processing Document</p>
                  <p className="text-xs text-gray-600 mt-1">{processingStage}</p>
                  <div className="w-48 h-3 bg-gray-200 rounded-full mt-3 mx-auto">
                    <div
                      className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {Math.round(uploadProgress)}% complete
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDragging ? 'Drop your files here' : 'Upload Your Documents'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag & drop your files here, or click to browse
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">PDF</span>
              <span className="bg-gray-100 px-2 py-1 rounded">DOCX</span>
              <span className="bg-gray-100 px-2 py-1 rounded">DOC</span>
              <span className="bg-gray-100 px-2 py-1 rounded">TXT</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Images</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Maximum file size: 10MB</p>
          </div>
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
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {currentDocument.wordCount} words
                      </span>
                      {currentDocument.detectedTopics.length > 0 && (
                        <span className="flex items-center">
                          <Brain className="w-4 h-4 mr-1" />
                          {currentDocument.detectedTopics.length} topics detected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetUpload}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                  title="Upload new document"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Topics and Analysis Preview */}
            {currentDocument.detectedTopics.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Detected Mathematical Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {currentDocument.detectedTopics.map((topic, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* AI Analysis Preview */}
            {currentDocument.content && (
              <div className="px-6 py-4 bg-yellow-50 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">AI Analysis Preview</h4>
                <div className="text-sm text-gray-700 bg-white rounded-lg p-3 border max-h-32 overflow-y-auto">
                  {currentDocument.content.substring(0, 300)}
                  {currentDocument.content.length > 300 && '...'}
                </div>
              </div>
            )}
            
            {/* Chat Interface */}
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Ask Questions About Your Document
              </h4>
              <ChatContainer 
                topic="document-review"
                initialContext={{
                  documentName: currentDocument.name,
                  documentContent: currentDocument.content,
                  extractedText: currentDocument.extractedText,
                  wordCount: currentDocument.wordCount,
                  detectedTopics: currentDocument.detectedTopics
                }}
              />
            </div>
          </div>
        )}
      </div>
    </SubscriptionGate>
  );
}
