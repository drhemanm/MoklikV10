import React, { useState, useRef } from 'react';
import { Send, Upload, Camera, Mic, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast as toastLib } from 'react-hot-toast';

interface ChatInputProps {
  onSend: (message: string, fileBase64?: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    try {
      await onSend(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toastLib.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Import the image analysis service
    import('../../services/ai/imageAnalysis.js').then(async ({ ImageAnalysisService }) => {
      try {
        // Validate file first
        const validation = ImageAnalysisService.validateImageFile(file);
        if (!validation.valid) {
          toastLib.error(validation.error || 'Invalid file');
          return;
        }
        
        // Show processing message
        toastLib.loading('Analyzing your image...');
        
        // Process the image
        const base64 = await ImageAnalysisService.fileToBase64(file);
        const result = await ImageAnalysisService.analyzeImage(base64, file.name);
        
        toastLib.dismiss();
        
        if (!result.success) {
          toastLib.error(result.error || 'Failed to analyze image');
          return;
        }
        
        if (!result.isMathRelated) {
          toastLib.error(result.error || 'This image doesn\'t contain mathematical content');
          
          // Show suggestions
          if (result.suggestions) {
            setTimeout(() => {
              result.suggestions?.forEach((suggestion: any, index: number) => {
                setTimeout(() => {
                  toastLib(suggestion);
                }, index * 1000);
              });
            }, 1000);
          }
          return;
        }
        
        // If math-related, send the analysis to chat
        if (result.content) {
          await onSend(`I've uploaded an image containing mathematical content: ${file.name}\n\n${result.content}`);
          toastLib.success('Image analyzed successfully!');
        }
      } catch (error) {
        toastLib.dismiss();
        console.error('Error analyzing image:', error);
        toastLib.error('Failed to analyze image. Please try again.');
      }
    });
  };



  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          title="Upload file"
        >
          <Upload className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Take photo">
          <Camera className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Voice message">
          <Mic className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Insert image">
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your math question..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={1}
          style={{ minHeight: '48px', maxHeight: '120px' }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}