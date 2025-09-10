import { useState, useEffect } from 'react';
import { Clock, MessageSquare, Search, Filter, Download, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';
import { ChatMessage } from './ChatMessage.js';
import { LoadingSpinner } from '../ui/LoadingSpinner.js';
import toast, { toast as toastLib } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  topic?: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  topic?: string;
}

interface ChatHistoryProps {
  onNewChat?: () => void;
 loadConversationHistory?: () => any[];
 loadConversation?: (conversationId: string) => void;
}

export function ChatHistory({ 
  onNewChat, 
  loadConversationHistory, 
  loadConversation 
}: ChatHistoryProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    if (user) {
     if (loadConversationHistory) {
       const conversations = loadConversationHistory();
       const formattedSessions = conversations.map((conv: any) => ({
         id: conv.id,
         title: conv.title,
         lastMessage: conv.messages[conv.messages.length - 1]?.content || '',
         timestamp: new Date(conv.timestamp),
         messageCount: conv.messageCount,
         topic: conv.topic || 'General'
       }));
       setSessions(formattedSessions);
     } else {
       loadChatSessions();
     }
    }
  }, [user, loadConversationHistory]);

  const loadChatSessions = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual Firebase query
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSessions: ChatSession[] = [
        {
          id: '1',
          title: 'Quadratic Equations Help',
          lastMessage: 'Thank you! That explanation was very helpful.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          messageCount: 12,
          topic: 'Algebra'
        },
        {
          id: '2',
          title: 'Trigonometry Problems',
          lastMessage: 'Can you explain the unit circle?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          messageCount: 8,
          topic: 'Trigonometry'
        },
        {
          id: '3',
          title: 'Calculus Derivatives',
          lastMessage: 'What is the derivative of sin(x)?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          messageCount: 15,
          topic: 'Calculus'
        },
        {
          id: '4',
          title: 'Statistics and Probability',
          lastMessage: 'How do I calculate standard deviation?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
          messageCount: 6,
          topic: 'Statistics'
        }
      ];
      
      setSessions(mockSessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      toastLib.error('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    setIsLoading(true);
    try {
     if (loadConversation) {
       loadConversation(sessionId);
       // Get the loaded messages from the conversation
       const conversations = JSON.parse(localStorage.getItem('moklik_conversations') || '[]');
       const conversation = conversations.find((c: any) => c.id === sessionId);
       if (conversation) {
         setMessages(conversation.messages.map((msg: any) => ({
           ...msg,
           timestamp: new Date(msg.timestamp)
         })));
       }
     } else {
       // Fallback to mock data
       await new Promise(resolve => setTimeout(resolve, 800));
       setMessages([]);
     }
      setSelectedSession(sessionId);
    } catch (error) {
      console.error('Error loading session messages:', error);
      toastLib.error('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;
    
    try {
      // Simulate API call - replace with actual Firebase delete
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (selectedSession === sessionId) {
        setSelectedSession(null);
        setMessages([]);
      }
      toastLib.success('Conversation deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      toastLib.error('Failed to delete conversation');
    }
  };

  const exportSession = (session: ChatSession) => {
    const content = `# ${session.title}\n\nExported on: ${new Date().toLocaleString()}\nTopic: ${session.topic || 'General'}\nMessages: ${session.messageCount}\n\n---\n\n`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toastLib.success('Conversation exported');
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = filterTopic === 'all' || session.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  const topics = ['all', ...Array.from(new Set(sessions.map(s => s.topic).filter(Boolean)))];

  if (!user) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Please sign in to view your chat history</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar - Chat Sessions */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
            {onNewChat && (
              <button
                onClick={onNewChat}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                New Chat
              </button>
            )}
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          {/* Topic Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {topics.map(topic => (
                <option key={topic} value={topic}>
                  {topic === 'all' ? 'All Topics' : topic}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">
                {searchQuery ? 'No conversations found' : 'No chat history yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredSessions.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all group ${
                    selectedSession === session.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => loadSessionMessages(session.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {session.title}
                    </h3>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportSession(session);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Export conversation"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {session.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(session.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.topic && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                          {session.topic}
                        </span>
                      )}
                      <span>{session.messageCount} msgs</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Selected Conversation */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {sessions.find(s => s.id === selectedSession)?.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {sessions.find(s => s.id === selectedSession)?.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedSession(null);
                    setMessages([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ChatMessage message={message} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Conversation
              </h3>
              <p className="text-gray-600 max-w-sm">
                Choose a conversation from the sidebar to view your chat history, or start a new chat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}