import { useState } from 'react';
import { Brain, User, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { InlineMath, BlockMath } from 'react-katex';
import { toast as toastLib } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, onRegenerate }: ChatMessageProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
      .then(() => toastLib.success('Copied to clipboard!'))
      .catch(() => toastLib.error('Failed to copy'));
  };
  
  const handleFeedback = (value: 'up' | 'down') => {
    setFeedback(value);
    toastLib.success(value === 'up' ? 'Thanks for your feedback!' : 'Thanks for your feedback. We\'ll try to improve.');
  };

  // Enhanced math rendering function
  const renderMathContent = (content: string) => {
    // Split content by math delimiters
    const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$|\\[\[\(][\s\S]*?\\[\]\)])/);
    
    return parts.map((part, index) => {
      // Display math (block)
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        return (
          <div key={index} className="my-4 overflow-x-auto">
            <BlockMath math={math} />
          </div>
        );
      }
      
      // Inline math
      if ((part.startsWith('$') && part.endsWith('$')) || 
          (part.startsWith('\\(') && part.endsWith('\\)')) ||
          (part.startsWith('\\[') && part.endsWith('\\]'))) {
        let math = part;
        if (part.startsWith('$') && part.endsWith('$')) {
          math = part.slice(1, -1);
        } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
          math = part.slice(2, -2);
        } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
          math = part.slice(2, -2);
          return (
            <div key={index} className="my-4 overflow-x-auto">
              <BlockMath math={math} />
            </div>
          );
        }
        
        return <InlineMath key={index} math={math.trim()} />;
      }
      
      // Regular text
      return part;
    });
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                  // Enhanced math rendering
                  p: ({children}) => {
                    const content = String(children);
                    if (content.includes('$') || content.includes('\\(') || content.includes('\\[')) {
                      return <div className="mb-4">{renderMathContent(content)}</div>;
                    }
                    return <p className="mb-4">{children}</p>;
                  },
                  code({className, children}) {
                    const isInline = !className;
                    return !isInline && className ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={className.replace('language-', '')}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
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
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleFeedback('up')}
                  className={`transition-colors ${
                    feedback === 'up' ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFeedback('down')}
                  className={`transition-colors ${
                    feedback === 'down' ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Regenerate response"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
