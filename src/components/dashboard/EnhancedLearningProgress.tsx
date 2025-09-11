import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  Zap,
  Star,
  Calendar,
  BookOpen,
  ChevronRight,
  Crown,
  Medal,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedLearningProgress = () => {
  const [currentXP, setCurrentXP] = useState(0);
  const [targetXP] = useState(1000);
  const [animatedXP, setAnimatedXP] = useState(0);

  // Sample data - replace with real data from your useGamification hook
  const playerData = {
    level: 1,
    xp: 0,
    nextLevelXP: 1000,
    streak: 0,
    longestStreak: 0,
    accuracy: 85,
    problemsSolved: 0,
    studyTimeHours: 0,
    studyTimeMinutes: 0,
    achievements: [],
    weeklyGoal: 5, // hours
    weeklyProgress: 0
  };

  // Animate XP counter
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedXP(prev => {
        if (prev < currentXP) {
          return Math.min(prev + 10, currentXP);
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentXP]);

  const progressPercentage = (animatedXP / targetXP) * 100;
  const weeklyProgressPercentage = (playerData.weeklyProgress / playerData.weeklyGoal) * 100;

  const getLevelInfo = (level) => {
    const levels = {
      1: { title: "Beginner Explorer", color: "from-blue-400 to-blue-600", icon: BookOpen },
      2: { title: "Math Apprentice", color: "from-green-400 to-green-600", icon: Target },
      3: { title: "Problem Solver", color: "from-purple-400 to-purple-600", icon: Zap },
      4: { title: "Math Scholar", color: "from-orange-400 to-orange-600", icon: Award },
      5: { title: "Math Master", color: "from-red-400 to-red-600", icon: Crown }
    };
    return levels[level] || levels[1];
  };

  const levelInfo = getLevelInfo(playerData.level);
  const LevelIcon = levelInfo.icon;

  const recentAchievements = [
    {
      id: 1,
      title: "Problem Solver",
      description: "Solved 10 problems in a row correctly",
      earned: "2 days ago",
      icon: Trophy,
      color: "from-yellow-400 to-yellow-600",
      rarity: "common"
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Maintained a 7-day study streak",
      earned: "5 days ago",
      icon: Flame,
      color: "from-orange-400 to-red-500",
      rarity: "rare"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with Level Badge */}
      <div className={`bg-gradient-to-r ${levelInfo.color} px-6 py-4 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <LevelIcon className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Your Learning Journey</h2>
              <div className="flex items-center space-x-2">
                <LevelIcon className="w-5 h-5" />
                <span className="text-lg font-semibold">{levelInfo.title}</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                  Level {playerData.level}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{animatedXP} XP</div>
              <div className="text-sm opacity-90">{targetXP - animatedXP} XP to next level</div>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progress to Level {playerData.level + 1}</span>
          <span className="text-sm font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${levelInfo.color} rounded-full relative`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Streak */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-xs font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                STREAK
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-900 mb-1">
              {playerData.streak}
              <span className="text-lg text-blue-600"> days</span>
            </div>
            <div className="text-xs text-blue-600">
              Longest: {playerData.longestStreak} days
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-green-500" />
              <span className="text-xs font-semibold text-green-600 bg-green-200 px-2 py-1 rounded-full">
                ACCURACY
              </span>
            </div>
            <div className="text-2xl font-bold text-green-900 mb-1">
              {playerData.accuracy}%
            </div>
            <div className="text-xs text-green-600">
              {playerData.problemsSolved} problems solved
            </div>
          </div>

          {/* Study Time */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-purple-500" />
              <span className="text-xs font-semibold text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                TIME
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-900 mb-1">
              {playerData.studyTimeHours}h
            </div>
            <div className="text-xs text-purple-600">
              Total learning time
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <Medal className="w-6 h-6 text-yellow-600" />
              <span className="text-xs font-semibold text-yellow-700 bg-yellow-200 px-2 py-1 rounded-full">
                BADGES
              </span>
            </div>
            <div className="text-2xl font-bold text-yellow-900 mb-1">
              {playerData.achievements.length}/10
            </div>
            <div className="text-xs text-yellow-700">
              Achievements unlocked
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-indigo-900">This Week's Goal</span>
            </div>
            <span className="text-sm font-bold text-indigo-600">
              {playerData.weeklyProgress}/{playerData.weeklyGoal} hours
            </span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2 mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${weeklyProgressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="text-xs text-indigo-600">
            {playerData.weeklyGoal - playerData.weeklyProgress} hours remaining to reach your goal
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Achievements</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.map((achievement) => {
                const AchievementIcon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center shadow-lg`}>
                      <AchievementIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          achievement.rarity === 'rare' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500">Earned {achievement.earned}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-500 mb-2">No Achievements Yet</h4>
              <p className="text-gray-400 mb-4">Start learning to unlock your first badge!</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Start Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedLearningProgress;
