import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  BookOpen,
  PenTool,
  Trophy,
  Flame,
  Clock,
  Target,
  TrendingUp,
  Zap,
  FileText,
  Users,
  ChevronRight,
  Sparkles,
  Calendar,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardHeader, CardBody, StatCard, ProgressCard } from '../components/ui/Card';
import { useGamification } from '../hooks/useGamification';
import { useSubscription } from '../hooks/useSubscription.jsx';

export function NewDashboard() {
  const navigate = useNavigate();
  const { stats, badges, isLoading } = useGamification();
  const { isInTrial, daysRemaining } = useSubscription();

  // Quick actions
  const quickActions = [
    {
      title: 'AI Tutor',
      description: 'Get instant help with any subject',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-blue-600',
      onClick: () => navigate('/chat')
    },
    {
      title: 'Writing Review',
      description: 'Get feedback on your essays',
      icon: <PenTool className="w-6 h-6" />,
      color: 'bg-purple-600',
      onClick: () => navigate('/writing-review')
    },
    {
      title: 'Exam Papers',
      description: 'Practice with past papers',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-green-600',
      onClick: () => navigate('/forum')
    },
    {
      title: 'Community',
      description: 'Connect with other students',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-orange-600',
      onClick: () => navigate('/forum')
    }
  ];

  // Recent achievements
  const recentBadges = badges?.slice(0, 3) || [];

  // Study subjects with progress
  const subjects = [
    { name: 'Mathematics', progress: 65, color: 'bg-blue-600' },
    { name: 'Physics', progress: 45, color: 'bg-purple-600' },
    { name: 'Chemistry', progress: 30, color: 'bg-green-600' },
    { name: 'English', progress: 80, color: 'bg-orange-600' }
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Study Streak"
          value={`${stats?.streak || 0} days`}
          change={stats?.streak > 0 ? '+1 today' : 'Start today!'}
          changeType={stats?.streak > 0 ? 'positive' : 'neutral'}
          icon={<Flame className="w-5 h-5" />}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50"
        />
        <StatCard
          title="Total XP"
          value={stats?.xp || 0}
          change={`Level ${stats?.level || 1}`}
          changeType="positive"
          icon={<Zap className="w-5 h-5" />}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-50"
        />
        <StatCard
          title="Study Time"
          value={`${stats?.studyTime || 0}h`}
          change="This week"
          changeType="neutral"
          icon={<Clock className="w-5 h-5" />}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50"
        />
        <StatCard
          title="Badges Earned"
          value={stats?.badgesEarned || 0}
          change="Keep going!"
          changeType="positive"
          icon={<Trophy className="w-5 h-5" />}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader
              title="Quick Actions"
              subtitle="Start learning now"
              icon={<Sparkles className="w-5 h-5" />}
            />
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.onClick}
                    className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{action.title}</span>
                    <span className="text-xs text-gray-500 text-center mt-1">{action.description}</span>
                  </motion.button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Subject Progress */}
          <Card>
            <CardHeader
              title="Learning Progress"
              subtitle="Your subject mastery"
              icon={<Target className="w-5 h-5" />}
              action={
                <button
                  onClick={() => navigate('/chat')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              }
            />
            <CardBody>
              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{subject.name}</span>
                      <span className="text-sm text-gray-500">{subject.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-full ${subject.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* AI Tutor CTA */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white cursor-pointer shadow-xl"
            onClick={() => navigate('/chat')}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Chat with AI Tutor</h3>
                  <p className="text-blue-100 text-sm">Get instant help with any question</p>
                </div>
              </div>
              <p className="text-blue-100 mb-4">
                Our AI tutor is available 24/7 to help you understand concepts, solve problems, and prepare for exams.
              </p>
              <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Start Chatting
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Achievements & Activity */}
        <div className="space-y-6">
          {/* Trial Banner (if applicable) */}
          {isInTrial && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardBody>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900">Free Trial</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      {daysRemaining} days remaining in your trial
                    </p>
                    <button
                      onClick={() => navigate('/pricing')}
                      className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all w-full"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Recent Achievements */}
          <Card>
            <CardHeader
              title="Recent Achievements"
              subtitle={`${badges?.length || 0} total badges`}
              icon={<Award className="w-5 h-5" />}
              action={
                <button
                  onClick={() => navigate('/chat')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Earn more
                </button>
              }
            />
            <CardBody className="p-0">
              {recentBadges.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentBadges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{badge.name || 'Achievement'}</p>
                        <p className="text-xs text-gray-500">{badge.description || 'Keep learning!'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Start learning to earn badges!</p>
                  <button
                    onClick={() => navigate('/chat')}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Start a lesson
                  </button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Study Goals */}
          <Card>
            <CardHeader
              title="Daily Goals"
              subtitle="Keep up the momentum"
              icon={<Target className="w-5 h-5" />}
            />
            <CardBody>
              <div className="space-y-4">
                <ProgressCard
                  title="Study 30 minutes"
                  current={Math.min(stats?.studyTime || 0, 30)}
                  total={30}
                  color="bg-blue-600"
                  icon={<Clock className="w-4 h-4" />}
                />
                <ProgressCard
                  title="Complete 3 exercises"
                  current={2}
                  total={3}
                  color="bg-green-600"
                  icon={<BookOpen className="w-4 h-4" />}
                />
                <ProgressCard
                  title="Ask 1 question"
                  current={1}
                  total={1}
                  color="bg-purple-600"
                  icon={<MessageSquare className="w-4 h-4" />}
                />
              </div>
            </CardBody>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader
              title="Trending Topics"
              subtitle="Popular in community"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <CardBody className="p-0">
              <div className="divide-y divide-gray-100">
                {['Quadratic Equations', 'Newton\'s Laws', 'Essay Writing', 'Chemical Bonding'].map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(`/chat?topic=${encodeURIComponent(topic)}`)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="font-medium text-gray-900">{topic}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NewDashboard;
