import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Camera, 
  Upload, 
  Mic, 
  Brain, 
  User, 
  Lightbulb, 
  Loader2, 
  Image as ImageIcon,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Eraser,
  X,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useOpenAI } from '../../hooks/useOpenAI.js';
import toast, { toast as toastLib } from 'react-hot-toast';
import { ChatHistory } from './ChatHistory.js';

interface EnhancedChatInterfaceProps {
  onBack: () => void;
  selectedTopic?: string | null;
}

export function EnhancedChatInterface({ onBack, selectedTopic }: EnhancedChatInterfaceProps) {
  const { 
    sendMessage, 
    isLoading, 
    messages, 
    clearMessages, 
    loadConversationHistory, 
    loadConversation,
    error 
  } = useOpenAI();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showTip, setShowTip] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('EnhancedChatInterface mounted');
    console.log('Messages:', messages);
    console.log('IsLoading:', isLoading);
    console.log('Error:', error);
  }, [messages, isLoading, error]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    try {
      console.log('Sending message:', inputValue);
      setShowSuggestions(false);
      await sendMessage(inputValue);
      setInputValue('');
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Handle image files with AI analysis
    if (file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else if (file.type === 'application/pdf') {
      handlePDFUpload(file);
    } else {
      toast.error('Please upload an image (JPEG, PNG, GIF, WebP) or PDF file');
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      // Dynamic import to avoid loading the service until needed
      const { ImageAnalysisService } = await import('../../services/ai/imageAnalysis.js');
      
      // Validate file first
      const validation = ImageAnalysisService.validateImageFile(file);
      if (!validation.valid) {
        toastLib.error(validation.error || 'Invalid file');
        return;
      }
      
      // Show processing message
      toastLib.loading('Analyzing your image...', { id: 'image-analysis' });
      
      // Process the image
      const base64 = await ImageAnalysisService.fileToBase64(file);
      const result = await ImageAnalysisService.analyzeImage(base64, file.name);
      
      toastLib.dismiss('image-analysis');
      
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
                toastLib.info(suggestion, { duration: 4000 });
              }, index * 1000);
            });
          }, 1000);
        }
        return;
      }
      
      // If math-related, send the analysis to chat
      if (result.content) {
        await sendMessage(`I've uploaded an image containing mathematical content: ${file.name}\n\n${result.content}`);
        toastLib.success('Image analyzed successfully!');
      }
    } catch (error) {
      toastLib.dismiss();
      console.error('Error analyzing image:', error);
      toastLib.error('Failed to analyze image. Please try again.');
    }
  };

  const handlePDFUpload = async (file: File) => {
    // Check file size (max 10MB for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      toastLib.error('PDF size must be less than 10MB');
      return;
    }
    
    toastLib.loading('Processing PDF...');
    try {
      await sendMessage(`I've uploaded a PDF file named "${file.name}". Please analyze its mathematical content and help me understand the problems or concepts shown.`);
      toastLib.dismiss();
      toastLib.success('PDF uploaded successfully!');
    } catch (error) {
      toastLib.dismiss();
      toastLib.error('Failed to process PDF. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = [
    "Explain the quadratic formula",
    "How do I solve systems of linear equations?",
    "What's the difference between permutation and combination?",
    "Help me understand trigonometric identities"
  ];

  // Enhanced math rendering for better equation display
  const renderMathContent = (content: string): string => {
    // Handle LaTeX delimiters properly
    return content
      .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$1$$') // Convert \[...\] to $$...$$
      .replace(/\\\((.*?)\\\)/g, '$$$1$$') // Convert \(...\) to $...$
      .replace(/\$\$([\s\S]*?)\$\$/g, (_match, math) => {
        // Ensure display math is on its own line
        return `\n\n$$${math.trim()}$$\n\n`;
      });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toastLib.success('Copied to clipboard!'))
      .catch(() => toastLib.error('Failed to copy'));
  };

  const regenerateResponse = async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) return;
    
    try {
      await sendMessage(lastUserMessage.content, undefined, true);
    } catch (error) {
      console.error('Error regenerating response:', error);
      toastLib.error('Failed to regenerate response. Please try again.');
    }
  };

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <History className="w-6 h-6 text-blue-600" />
                  <h1 className="font-semibold text-gray-900">Chat History</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[calc(100vh-4rem)]">
          <ChatHistory 
            onNewChat={() => setShowHistory(false)}
            loadConversationHistory={loadConversationHistory}
            loadConversation={loadConversation}
          />
        </div>
      </div>
    );
  }

  // Show error state if there's a critical error
  if (error && error.includes('API key')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <Brain className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            AI Service Unavailable
          </h2>
          <p className="text-gray-600 mb-6">
            The AI tutoring service is currently unavailable. Please try again later or contact support.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-900">Moklik AI Tutor</h1>
                  <p className="text-sm text-gray-500">
                    {selectedTopic ? `Studying ${selectedTopic}` : 'Ready to help'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => clearMessages()}
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm flex items-center"
              >
                <Eraser className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Clear chat</span>
              </button>
              <button 
                onClick={() => setShowHistory(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm flex items-center"
              >
                <History className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">History</span>
              </button>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <Brain className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium text-red-800">AI Service Error</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-blue-200 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Moklik AI Tutor
                </h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  I'm here to help you with mathematics. Ask me anything about {selectedTopic || 'math'} or any other topic you're studying!
                </p>
                
                {showSuggestions && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputValue(suggestion);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center">
                          <Sparkles className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-800">{suggestion}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border shadow-sm'
                  }`}>
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="markdown-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            // Enhanced paragraph rendering for math
                            p: ({children}: any) => {
                              const content = String(children);
                             if (content.includes('$') || content.includes('\\(') || content.includes('\\[')) {
                               const processedContent = renderMathContent(content);
                               return <div className="mb-4" dangerouslySetInnerHTML={{ __html: processedContent }} />;
                             }
                             return <p className="mb-4">{children}</p>;
                            },
                            code({node, inline, className, children, ...props}: any) {
                              return !inline && className ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={className.replace('language-', '')}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                         {renderMathContent(message.content)}
                        </ReactMarkdown>
                      </div>
                    )}
                    
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    
                    {message.role === 'assistant' && (
                      <div className="flex items-center justify-end space-x-2 mt-2">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <div className="flex items-center space-x-1">
                          <button
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title="Helpful"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={regenerateResponse}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Regenerate response"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3 max-w-3xl">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-white border shadow-sm rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Study Tip */}
      <AnimatePresence>
        {showTip && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-4 max-w-xs bg-white rounded-lg shadow-lg border border-blue-100 p-4"
          >
            <button
              onClick={() => setShowTip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">Study Tip</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {selectedTopic === 'Algebra' 
                    ? "When solving equations, always perform the same operation on both sides to maintain equality."
                    : selectedTopic === 'Calculus'
                    ? "Remember that the derivative of a constant is zero, and the derivative of x^n is n*x^(n-1)."
                    : "Try explaining concepts in your own words to check your understanding."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Upload file"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Take photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Voice message"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Insert image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-end space-x-2">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a math question or describe your problem..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  disabled={isLoading || !!error}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || !!error}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Moklik AI may produce inaccurate information. Verify important information.
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Custom styles for markdown content */}
      <style>{`
        .markdown-content {
          font-size: 0.95rem;
          line-height: 1.6;
        }
        
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.25;
        }
        
        .markdown-content h1 { font-size: 1.5em; }
        .markdown-content h2 { font-size: 1.3em; }
        .markdown-content h3 { font-size: 1.1em; }
        
        .markdown-content p {
          margin-bottom: 1em;
        }
        
        .markdown-content ul,
        .markdown-content ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        
        .markdown-content ul { list-style-type: disc; }
        .markdown-content ol { list-style-type: decimal; }
        
        .markdown-content li {
          margin-bottom: 0.5em;
        }
        
        .markdown-content pre {
          margin-bottom: 1em;
          border-radius: 0.375rem;
          overflow: auto;
        }
        
        .markdown-content code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9em;
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .markdown-content pre code {
          padding: 0;
          background-color: transparent;
        }
        
        .markdown-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          color: #6b7280;
          margin-bottom: 1em;
        }
        
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1em;
        }
        
        .markdown-content th,
        .markdown-content td {
          padding: 0.5em;
          border: 1px solid #e5e7eb;
        }
        
        .markdown-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        
        .markdown-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .markdown-content a:hover {
          text-decoration: none;
        }
        
        .markdown-content img {
          max-width: 100%;
          border-radius: 0.375rem;
        }
        
        .katex-display {
          overflow-x: auto;
          overflow-y: hidden;
          padding: 0.5em 0;
        }
      `}</style>
    </div>
  );
}