// src/pages/ModernDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Users, 
  Award, 
  Clock, 
  Target,
  Zap,
  Upload,
  PenTool,
  MessageSquare,
  BarChart3,
  Star,
  ChevronRight,
  Trophy,
  Fire,
  CheckCircle,
  ArrowRight,
  Plus,
  PlayCircle,
  FileText,
  Settings,
  Crown
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { useGamification } from '../hooks/useGamification';
import { 
  Typography, 
  Card, 
  Button, 
  StatCard, 
  ActionCard, 
  Badge, 
  Progress 
} from '../components/ui/ComponentLibrary';
import { EnhancedLayout } from '../components/layout/EnhancedLayout';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalXP: number;
  currentLevel: number;
  accuracy: number;
  studyTime: number;
  streak: number;
  questionsAnswered: number;
}

interface RecentActivity {
  id: string;
  type: 'question' | 'achievement' | 'study_session' | 'forum_post';
  title: string;
  description: string;
  timestamp: Date;
  xpGained?: number;
}

interface UpcomingTask {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export function ModernDashboard() {
  const { user } = useAuth();
  const { subscriptionStatus, trialDaysLeft, isOnTrial, isTrialExpired } = useSubscription();
  const { stats } = useGamification();
  const navigate = useNavigate();

  // Mock data - replace with real data from your services
  const [dashboardStats] = useState<DashboardStats>({
    totalXP: stats.xp || 1250,
    currentLevel: Math.floor((stats.xp || 1250) / 1000) + 1,
    accuracy: 85,
    studyTime: 127, // minutes this week
    streak: stats.streak || 5,
    questionsAnswered: 234
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Problem Solver',
      description: 'Solved 50 algebra problems',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      xpGained: 100
    },
    {
      id: '2',
      type: 'study_session',
      title: 'Calculus Study Session',
      description: '45 minutes of focused learning',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      xpGained: 75
    },
    {
      id: '3',
      type: 'question',
      title: 'Trigonometry Help',
      description: 'Asked about sine and cosine functions',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      xpGained: 15
    }
  ]);

  const [upcomingTasks] = useState<UpcomingTask[]>([
    {
      id: '1',
      title: 'Complete Chapter 5 Review',
      subject: 'Algebra',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'Practice Integration Problems',
      subject: 'Calculus',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      completed: false
    },
    {
      id: '3',
      title: 'Prepare for Geometry Quiz',
      subject: 'Geometry',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      completed: true
    }
  ]);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    if (diffInDays < 7) return `Due in ${diffInDays} days`;
    return date.toLocaleDateString();
  };

  const quickActions = [
    {
      title: 'Ask AI Tutor',
      description: 'Get instant help with any math problem',
      icon: Brain,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      action: () => navigate('/chat')
    },
    {
      title: 'Upload Homework',
      description: 'Get feedback on your assignments',
      icon: Upload,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      action: () => navigate('/homework')
    },
    {
      title: 'Writing Review',
      description: 'Improve your essays and reports',
      icon: PenTool,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      action: () => navigate('/writing-review')
    },
    {
      title: 'Study Forum',
      description: 'Connect with other students',
      icon: MessageSquare,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      action: () => navigate('/forum')
    }
  ];

  const progressMetrics = [
    {
      label: 'Weekly Goal',
      current: 127,
      target: 180,
      unit: 'minutes'
    },
    {
      label: 'Monthly XP',
      current: 850,
      target: 1200,
      unit: 'XP'
    }
  ];

  return (
    <EnhancedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <Typography.H2 className="mb-2">
                      Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.displayName?.split(' ')[0] || 'there'}!
                    </Typography.H2>
                    <Typography.Body className="text-gray-600">
                      Ready to continue your math journey? You're on a {dashboardStats.streak}-day streak!
                    </Typography.Body>
                  </div>
                </div>
                
                {/* Level Progress */}
                <div className="flex items-center space-x-4">
                  <Badge variant="info" size="lg">
                    Level {dashboardStats.currentLevel}
                  </Badge>
                  <div className="flex-1 max-w-md">
                    <Progress
                      value={dashboardStats.totalXP % 1000}
                      max={1000}
                      variant="default"
                      showLabel
                      label={`${dashboardStats.totalXP % 1000}/1000 XP to Level ${dashboardStats.currentLevel + 1}`}
                    />
                  </div>
                </div>
              </div>

              {/* Trial Status */}
              {(isOnTrial || isTrialExpired) && (
                <div className="mt-6 lg:mt-0 lg:ml-8">
                  <Card 
                    variant="outlined" 
                    padding="lg"
                    className={`${isTrialExpired ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'} w-full lg:w-80`}
                  >
                    <div className="flex items-start space-x-3">
                      <Crown className={`w-6 h-6 mt-1 ${isTrialExpired ? 'text-red-600' : 'text-orange-600'}`} />
                      <div className="flex-1">
                        <Typography.H4 className={isTrialExpired ? 'text-red-800' : 'text-orange-800'}>
                          {isTrialExpired ? 'Trial Expired' : `${trialDaysLeft} Days Left`}
                        </Typography.H4>
                        <Typography.BodySmall className={`${isTrialExpired ? 'text-red-700' : 'text-orange-700'} mt-1 mb-3`}>
                          {isTrialExpired 
                            ? 'Subscribe to restore access to all features'
                            : 'Upgrade to continue your learning journey'
                          }
                        </Typography.BodySmall>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => navigate('/pricing')}
                        >
                          Choose Plan
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats & Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Overview */}
              <div>
                <Typography.H3 className="mb-6">Your Progress</Typography.H3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <StatCard
                    title="Total XP"
                    value={dashboardStats.totalXP.toLocaleString()}
                    icon={Zap}
                    variant="info"
                    trend={{ value: 12, isPositive: true }}
                  />
                  <StatCard
                    title="Accuracy"
                    value={`${dashboardStats.accuracy}%`}
                    icon={Target}
                    variant="success"
                    trend={{ value: 3, isPositive: true }}
                  />
                  <StatCard
                    title="Study Streak"
                    value={`${dashboardStats.streak} days`}
                    icon={Fire}
                    variant="warning"
                    subtitle="Keep it going!"
                  />
                  <StatCard
                    title="Questions Solved"
                    value={dashboardStats.questionsAnswered}
                    icon={CheckCircle}
                    variant="default"
                    trend={{ value: 18, isPositive: true }}
                  />
                </div>
              </div>

              {/* Progress Metrics */}
              <div>
                <Typography.H3 className="mb-6">Weekly Goals</Typography.H3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {progressMetrics.map((metric, index) => (
                    <Card key={index} variant="elevated" padding="lg">
                      <div className="flex items-center justify-between mb-4">
                        <Typography.H4>{metric.label}</Typography.H4>
                        <Badge 
                          variant={metric.current >= metric.target ? 'success' : 'warning'}
                          size="sm"
                        >
                          {metric.current >= metric.target ? 'Complete' : 'In Progress'}
                        </Badge>
                      </div>
                      <Progress
                        value={metric.current}
                        max={metric.target}
                        variant={metric.current >= metric.target ? 'success' : 'default'}
                        showLabel
                        label={`${metric.current}/${metric.target} ${metric.unit}`}
                        size="lg"
                      />
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <Typography.H3 className="mb-6">Quick Actions</Typography.H3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quickActions.map((action, index) => (
                    <ActionCard
                      key={index}
                      title={action.title}
                      description={action.description}
                      icon={action.icon}
                      iconColor={action.iconColor}
                      iconBg={action.iconBg}
                      action={{
                        label: 'Get Started',
                        onClick: action.action
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Activity & Tasks */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <Typography.H3>Recent Activity</Typography.H3>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => navigate('/progress')}
                  >
                    View All
                  </Button>
                </div>
                <Card variant="elevated" padding="none">
                  <div className="divide-y divide-gray-100">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'achievement' ? 'bg-yellow-100' :
                            activity.type === 'study_session' ? 'bg-blue-100' :
                            activity.type === 'question' ? 'bg-green-100' :
                            'bg-purple-100'
                          }`}>
                            {activity.type === 'achievement' && <Trophy className="w-4 h-4 text-yellow-600" />}
                            {activity.type === 'study_session' && <Clock className="w-4 h-4 text-blue-600" />}
                            {activity.type === 'question' && <Brain className="w-4 h-4 text-green-600" />}
                            {activity.type === 'forum_post' && <MessageSquare className="w-4 h-4 text-purple-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <Typography.BodySmall className="font-medium text-gray-900">
                                {activity.title}
                              </Typography.BodySmall>
                              {activity.xpGained && (
                                <Badge variant="info" size="sm">
                                  +{activity.xpGained} XP
                                </Badge>
                              )}
                            </div>
                            <Typography.Caption className="text-gray-600 mt-1">
                              {activity.description}
                            </Typography.Caption>
                            <Typography.Caption className="text-gray-500 mt-1">
                              {getTimeAgo(activity.timestamp)}
                            </Typography.Caption>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Upcoming Tasks */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <Typography.H3>Upcoming Tasks</Typography.H3>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Plus}
                    onClick={() => navigate('/schedule')}
                  >
                    Add Task
                  </Button>
                </div>
                <Card variant="elevated" padding="none">
                  <div className="divide-y divide-gray-100">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className={`p-4 ${task.completed ? 'opacity-60' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`w-4 h-4 rounded border-2 mt-1 ${
                            task.completed 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300 hover:border-blue-500'
                          }`}>
                            {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <Typography.BodySmall className={`font-medium ${
                                task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                              }`}>
                                {task.title}
                              </Typography.BodySmall>
                              <Badge 
                                variant={
                                  task.priority === 'high' ? 'error' :
                                  task.priority === 'medium' ? 'warning' : 'default'
                                }
                                size="sm"
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            <Typography.Caption className="text-gray-600 mt-1">
                              {task.subject}
                            </Typography.Caption>
                            <Typography.Caption className={`mt-1 ${
                              task.completed ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {formatDueDate(task.dueDate)}
                            </Typography.Caption>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Study Tips */}
              <Card variant="outlined" padding="lg" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <Typography.H4 className="text-blue-900 mb-2">
                      Study Tip of the Day
                    </Typography.H4>
                    <Typography.BodySmall className="text-blue-800">
                      Try the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevents burnout.
                    </Typography.BodySmall>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </EnhancedLayout>
  );
}
