import { useState } from 'react';
import { 
  Brain, 
  BookOpen, 
  Upload,
  MessageSquare,
  Target,
  Clock,
  RotateCcw,
  Zap,
  Trophy,
  PenTool
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { DigitalBadge } from '../components/gamification/DigitalBadge';
import { BadgeCollection } from '../components/gamification/BadgeCollection';
import { ProgressTracker } from '../components/gamification/ProgressTracker';
import { EnhancedChatInterface } from '../components/chat/EnhancedChatInterface';
import { LeaderboardCard } from '../components/gamification/LeaderboardCard';
import { AchievementNotification } from '../components/gamification/AchievementNotification';
import { useGamification } from '../hooks/useGamification';
import { SubscriptionStatus } from '../components/account/SubscriptionStatus';


export function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { 
    badges, 
    stats, 
    newAchievement, 
    dismissAchievementNotification 
  } = useGamification();


  const quickActions = [
    {
      id: 'continue',
      title: 'Chat with AI Tutor',
      description: 'Ask questions and get instant help',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-blue-600',
      action: () => {
        try {
          window.location.href = '/chat';
        } catch (error) {
          console.error('Navigation error:', error);
          setSelectedTopic(null);
          setShowChat(true);
        }
      }
    },
    {
      id: 'upload-work',
      title: 'Upload Your Work',
      description: 'Get AI feedback on assignments',
      icon: <Upload className="w-6 h-6" />,
      color: 'bg-green-600',
      action: () => {
        try {
          window.location.href = '/chat';
        } catch (error) {
          console.error('Navigation error:', error);
          setSelectedTopic('document-review');
          setShowChat(true);
        }
      }
    },
    {
      id: 'review',
      title: 'Review Mistakes',
      description: 'Learn from past errors',
      icon: <RotateCcw className="w-6 h-6" />,
      color: 'bg-purple-600',
      action: () => setActiveTab('review')
    },
    {
      id: 'upload',
      title: 'Upload Problem',
      description: 'Get help with homework',
      icon: <Upload className="w-6 h-6" />,
      color: 'bg-orange-600',
      action: () => document.getElementById('file-upload')?.click()
    },
    {
      id: 'writing',
      title: 'Writing Review',
      description: 'Get feedback on essays',
      icon: <PenTool className="w-6 h-6" />,
      color: 'bg-indigo-600',
      action: () => {
        try {
          window.location.href = '/writing-review';
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    },
    {
      id: 'forum',
      title: 'Discussion Forum',
      description: 'Connect with other students',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-pink-600',
      action: () => {
        try {
          window.location.href = '/forum';
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getXPForNextLevel = () => {
    return stats.xpForNextLevel;
  };

  const getLevelProgress = () => {
    return ((stats.xp % stats.xpForNextLevel) / stats.xpForNextLevel) * 100;
  };

  if (showChat) {
    return (
      <EnhancedChatInterface
        onBack={() => setShowChat(false)}
        selectedTopic={selectedTopic}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Navigation */}
        <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.displayName || 'Student'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Ready to continue your math journey? Click "Chat with AI Tutor" below to get started!
          </p>
          
          {/* Prominent AI Chat Button */}
          <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Ask Moklik AI Anything</h3>
                  <p className="text-gray-600">Get instant help with math problems, homework, or concepts</p>
                </div>
              </div>
              <button
                onClick={() => {
                  try {
                    window.location.href = '/chat';
                  } catch (error) {
                    console.error('Navigation error:', error);
                    setSelectedTopic(null);
                    setShowChat(true);
                  }
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Start Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">Level {stats.level}</span>
            </div>
            <p className="text-sm text-gray-600">{getXPForNextLevel()} XP to next level</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getLevelProgress()}%` }}
              />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.streak}</span>
            </div>
            <p className="text-sm text-gray-600">Day streak</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.accuracy}%</span>
            </div>
            <p className="text-sm text-gray-600">Accuracy</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">{stats.studyTime}h</span>
            </div>
            <p className="text-sm text-gray-600">Study time</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="mb-6">
          <SubscriptionStatus />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Chat Quick Access */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">AI Math Tutor</h3>
                    <p className="text-blue-100">Get instant help with any math problem</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    try {
                      window.location.href = '/chat';
                    } catch (error) {
                      console.error('Navigation error:', error);
                      setSelectedTopic(null);
                      setShowChat(true);
                    }
                  }}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-3 rounded-lg transition-all flex items-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Start New Chat</span>
                </button>
                
                <button
                  onClick={() => {
                    try {
                      window.location.href = '/chat';
                    } catch (error) {
                      console.error('Navigation error:', error);
                      setSelectedTopic('document-review');
                      setShowChat(true);
                    }
                  }}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-3 rounded-lg transition-all flex items-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload & Analyze Work</span>
                </button>
              </div>
            </div>

            {/* Progress Tracker */}
            <ProgressTracker stats={stats} />
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Getting Started Guide */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Chat with AI Tutor</p>
                    <p className="text-sm text-gray-600">Ask any math question</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Upload className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Upload Your Work</p>
                    <p className="text-sm text-gray-600">Get feedback on assignments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <PenTool className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Writing Review</p>
                    <p className="text-sm text-gray-600">Improve your essays</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Study Tips</h3>
              <div className="space-y-4">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Tip:</strong> Start each study session by asking the AI tutor to explain a concept you're unsure about.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    📚 <strong>Remember:</strong> Upload your homework for detailed feedback and step-by-step solutions.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    🎯 <strong>Goal:</strong> Practice regularly to build your confidence and improve your skills.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick AI Access Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-100">
              <div className="text-center">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 mb-4">Ask Moklik AI any math question</p>
                <button
                  onClick={() => {
                    try {
                      window.location.href = '/chat';
                    } catch (error) {
                      console.error('Navigation error:', error);
                      setSelectedTopic(null);
                      setShowChat(true);
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Chat with AI Now
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Digital Badges</h3>
                <button 
                  onClick={() => setShowBadges(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View All
                </button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                {badges.slice(0, 4).map((badge: any) => (
                  <DigitalBadge 
                    key={badge.id} 
                    badge={badge} 
                    size="sm" 
                  />
                ))}
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  {badges.filter((b: any) => b.unlocked).length} of {badges.length} badges earned
                </p>
              </div>
              
              {showBadges && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <BadgeCollection 
                      badges={badges} 
                      onClose={() => setShowBadges(false)} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Leaderboard */}
            <LeaderboardCard
              title="XP Leaderboard"
              metric="XP"
              entries={[
                { id: '1', name: 'MathWizard', score: 2450, rank: 1, isCurrentUser: false },
                { id: '2', name: 'AlgebraPro', score: 2100, rank: 2, isCurrentUser: false },
                { id: '3', name: 'You', score: 1250, rank: 3, isCurrentUser: true },
                { id: '4', name: 'CalcKing', score: 1100, rank: 4, isCurrentUser: false },
                { id: '5', name: 'GeometryFan', score: 950, rank: 5, isCurrentUser: false }
              ]}
            />

            {/* Study Calendar */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Study Streak</h3>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      i < stats.streak 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center">
                {stats.streak} days in a row! Keep it up! 🔥
              </p>
            </div>

            {/* Daily Goal */}
            <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Today's Goal</h3>
              <p className="text-blue-100 mb-4">Solve 3 problems</p>
              <div className="w-full bg-blue-400 rounded-full h-2 mb-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '66%' }} />
              </div>
              <p className="text-sm text-blue-100">2 of 3 completed</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievement Notification */}
      {newAchievement && (
        <AchievementNotification
          title={newAchievement.title}
          description={newAchievement.description}
          xpEarned={newAchievement.xpReward}
          isOpen={!!newAchievement}
          onClose={dismissAchievementNotification}
        />
      )}

      {/* Hidden file input for upload */}
      <input
        id="file-upload"
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // Handle file upload
            console.log('File uploaded:', file);
          }
        }}
      />
    </div>
  );
}