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
  Trophy,
  Zap,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useOpenAI } from '../../hooks/useOpenAI';
import { useGamification } from '../../hooks/useGamification';
import toast, { toast as toastLib } from 'react-hot-toast';
import { ChatHistory } from './ChatHistory';
import { SubscriptionGate } from '../subscription/SubscriptionGate';

// DOMPurify config for math content - allows KaTeX-generated HTML
const MATH_PURIFY_CONFIG = {
  ALLOWED_TAGS: ['span', 'div', 'p', 'br', 'math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'msqrt', 'mroot', 'mtext', 'annotation'],
  ALLOWED_ATTR: ['class', 'style', 'aria-hidden', 'xmlns'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'object', 'embed'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
};

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
  
  const { 
    addXP, 
    incrementStreak, 
    trackStudyTime, 
    stats, 
    unlockAchievement 
  } = useGamification();

  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showTip, setShowTip] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [messageCount, setMessageCount] = useState(0);
  const [showXPNotification, setShowXPNotification] = useState<{show: boolean, amount: number, reason: string}>({
    show: false, 
    amount: 0, 
    reason: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize session tracking
  useEffect(() => {
    setSessionStartTime(Date.now());
    incrementStreak();
  }, [incrementStreak]);

  // Track study time when component unmounts or user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      const studyMinutes = Math.floor((Date.now() - sessionStartTime) / 60000);
      if (studyMinutes > 0) {
        trackStudyTime(studyMinutes);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [sessionStartTime, trackStudyTime]);

  // Show XP notification helper
  const showXPGain = (amount: number, reason: string) => {
    setShowXPNotification({ show: true, amount, reason });
    setTimeout(() => {
      setShowXPNotification({ show: false, amount: 0, reason: '' });
    }, 3000);
  };

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
      
      const newMessageCount = messageCount + 1;
      setMessageCount(newMessageCount);
      
      const xpAmount = 5;
      await addXP(xpAmount, 'Asked a question');
      showXPGain(xpAmount, 'Question asked!');
      
      await sendMessage(inputValue);
      setInputValue('');
      
      setTimeout(async () => {
        const responseXP = 8;
        await addXP(responseXP, 'Received AI response');
        showXPGain(responseXP, 'Learning from AI!');
      }, 2000);
      
      if (newMessageCount === 1) {
        await addXP(25, 'First question achievement');
        showXPGain(25, 'First question bonus!');
        await unlockAchievement('first_question');
      } else if (newMessageCount === 5) {
        await addXP(50, 'Curious learner achievement');
        showXPGain(50, 'Curious learner bonus!');
        await unlockAchievement('curious_learner');
      } else if (newMessageCount === 10) {
        await addXP(100, 'Active student achievement');
        showXPGain(100, 'Active student bonus!');
        await unlockAchievement('active_student');
      } else if (newMessageCount === 25) {
        await addXP(200, 'Dedicated learner achievement');
        showXPGain(200, 'Dedicated learner bonus!');
        await unlockAchievement('dedicated_learner');
      }
      
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const uploadXP = 15;
    addXP(uploadXP, 'Uploaded study material');
    showXPGain(uploadXP, 'File uploaded!');
    
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
      const { ImageAnalysisService } = await import('../../services/ai/imageAnalysis');
      
      const validation = ImageAnalysisService.validateImageFile(file);
      if (!validation.valid) {
        toastLib.error(validation.error || 'Invalid file');
        return;
      }
      
      toastLib.loading('Analyzing your image...', { id: 'image-analysis' });
      
      const base64 = await ImageAnalysisService.fileToBase64(file);
      const result = await ImageAnalysisService.analyzeImage(base64, file.name);
      
      toastLib.dismiss('image-analysis');
      
      if (!result.success) {
        toastLib.error(result.error || 'Failed to analyze image');
        return;
      }
      
      if (!result.isMathRelated) {
        toastLib.error(result.error || 'This image doesn\'t contain mathematical content');
        
        if (result.suggestions) {
          setTimeout(() => {
            result.suggestions?.forEach((suggestion: any, index: number) => {
              setTimeout(() => {
                toastLib(suggestion, { duration: 4000 });
              }, index * 1000);
            });
          }, 1000);
        }
        return;
      }
      
      // ✅ FIXED: Now send the ACTUAL IMAGE to the AI, not just extracted text
      if (result.content) {
        await sendMessage(
          `I've uploaded an image containing mathematical content: ${file.name}\n\nPlease analyze this image and help me solve or understand the problems shown.`,
          base64  // ← Pass the actual image base64 data!
        );
        const bonusXP = 25;
        await addXP(bonusXP, 'Successfully analyzed math image');
        showXPGain(bonusXP, 'Math image analyzed!');
        toastLib.success('Image uploaded successfully! AI is analyzing...', { duration: 3000 });
      }
    } catch (error) {
      toastLib.dismiss();
      console.error('Error analyzing image:', error);
      toastLib.error('Failed to analyze image. Please try again.');
    }
  };

  const handlePDFUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toastLib.error('PDF size must be less than 10MB');
      return;
    }
    
    toastLib.loading('Processing PDF...');
    try {
      await sendMessage(`I've uploaded a PDF file named "${file.name}". Please analyze its mathematical content and help me understand the problems or concepts shown.`);
      const pdfXP = 30;
      await addXP(pdfXP, 'Uploaded PDF for analysis');
      showXPGain(pdfXP, 'PDF processed!');
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

  const handleThumbsUp = async () => {
    const feedbackXP = 3;
    await addXP(feedbackXP, 'Provided positive feedback');
    showXPGain(feedbackXP, 'Thanks for feedback!');
    toast.success('Thank you for your feedback!');
  };

  const handleThumbsDown = async () => {
    const feedbackXP = 2;
    await addXP(feedbackXP, 'Provided feedback');
    showXPGain(feedbackXP, 'Feedback noted!');
    toast.success('Thank you for your feedback! We\'ll improve.');
  };

  const suggestions = [
    "Explain the quadratic formula",
    "How do I solve systems of linear equations?",
    "What's the difference between permutation and combination?",
    "Help me understand trigonometric identities",
    "Show me how to differentiate polynomials",
    "Explain integration by parts"
  ];

  const sessionMinutes = Math.floor((Date.now() - sessionStartTime) / 60000);

  const renderMathContent = (content: string): string => {
    return content
      .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$1$$')
      .replace(/\\\((.*?)\\\)/g, '$$$1$$')
      .replace(/\$\$([\s\S]*?)\$\$/g, (_match, math) => {
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
      const regenXP = 2;
      await addXP(regenXP, 'Regenerated response');
      showXPGain(regenXP, 'Response regenerated!');
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
    <SubscriptionGate 
      feature="AI tutoring" 
      fallbackMessage="Subscribe to get unlimited access to Moklik AI tutoring and personalized learning."
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
        <AnimatePresence>
          {showXPNotification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">+{showXPNotification.amount} XP</span>
              <span className="text-green-100">{showXPNotification.reason}</span>
            </motion.div>
          )}
        </AnimatePresence>

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
                <div className="hidden sm:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{sessionMinutes}m</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Zap className="w-4 h-4" />
                    <span>{messageCount} msgs</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-600 font-medium">
                    <Trophy className="w-4 h-4" />
                    <span>{stats.xp} XP</span>
                  </div>
                </div>
                
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

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {error && !error.includes('API key') && (
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
                              p: ({children}: any) => {
                                const content = String(children);
                                if (content.includes('$') || content.includes('\\(') || content.includes('\\[')) {
                                  const processedContent = renderMathContent(content);
                                  // Sanitize the processed content to prevent XSS attacks
                                  const sanitizedContent = DOMPurify.sanitize(processedContent, MATH_PURIFY_CONFIG);
                                  return <div className="mb-4" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
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
                              onClick={handleThumbsUp}
                              className="text-gray-400 hover:text-green-600 transition-colors"
                              title="Helpful"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleThumbsDown}
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
                      : selectedTopic === 'Geometry'
                      ? "Always label your diagrams clearly and identify given information before starting proofs."
                      : selectedTopic === 'Statistics'
                      ? "Remember the difference between population and sample statistics when interpreting data."
                      : "Try explaining concepts in your own words to check your understanding."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Upload file (+15 XP)"
                    disabled={isLoading}
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
                  <div className="text-xs text-gray-500 ml-auto">
                    +5 XP per question
                  </div>
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </SubscriptionGate>
  );
}
