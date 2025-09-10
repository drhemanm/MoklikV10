import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  BarChart2, 
  PenTool,
  MessageSquare,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
}

interface DashboardNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function DashboardNav({ activeTab, onTabChange }: DashboardNavProps) {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
    { id: 'chat', label: 'AI Tutor', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'learning', label: 'Learning', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'forum', label: 'Forum', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'writing', label: 'Writing', icon: <PenTool className="w-5 h-5" /> },
  ];

  const handleNavClick = (item: NavItem) => {
    try {
      if (item.id === 'chat') {
        navigate('/chat');
      } else if (item.id === 'forum') {
        navigate('/forum');
      } else if (item.id === 'writing') {
        navigate('/writing-review');
      } else {
        onTabChange(item.id);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to direct navigation
      if (item.id === 'chat') {
        window.location.href = '/chat';
      } else if (item.id === 'forum') {
        window.location.href = '/forum';
      } else if (item.id === 'writing') {
        window.location.href = '/writing-review';
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <nav className="flex overflow-x-auto hide-scrollbar space-x-1 sm:space-x-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavClick(item)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors min-w-[80px] ${
              activeTab === item.id
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
}