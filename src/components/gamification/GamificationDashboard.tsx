import { Trophy, Clock, Target, Star, Brain } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification.js';
import { ProgressBar } from '../ui/ProgressBar.js';
import { motion } from 'framer-motion';


export function GamificationDashboard() {
  const { stats, isLoading } = useGamification();

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const xpForNextLevel = ((stats.level) * 1000) - (stats.xp % 1000);
  const levelProgress = ((stats.xp % 1000) / 1000) * 100;

  return (
    <div className="space-y-6">
      {/* Level and XP Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <div>
              <h3 className="text-2xl font-bold">Level {stats.level}</h3>
              <p className="text-blue-100">{xpForNextLevel} XP to next level</p>
            </div>
          </div>
          <div className="text-3xl font-bold">{stats.xp} XP</div>
        </div>
        <ProgressBar progress={levelProgress} className="bg-blue-400/30" barClassName="bg-blue-300" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Study Streak */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="font-semibold text-gray-900">Study Streak</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-500 mb-2">
            {stats.streak} Days
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Longest streak: {stats.longestStreak} days</p>
          </div>
        </motion.div>

        {/* Study Time */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-900">Study Time</h3>
          </div>
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {Math.round(stats.studyTime / 60)} Hours
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600">
              Total study time
            </p>
          </div>
        </motion.div>

        {/* Active Goals */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold text-gray-900">Progress</h3>
          </div>
          <div className="text-3xl font-bold text-green-500 mb-2">
            {stats.accuracy}%
          </div>
          <p className="text-sm text-gray-600">Overall accuracy</p>
        </motion.div>
      </div>

      {/* Study Tips */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md p-6 border border-gray-100"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-semibold text-gray-900">Study Tips</h3>
        </div>
        <div className="text-gray-600">
          <p className="mb-2">🎯 Set specific study goals for each session</p>
          <p className="mb-2">⏰ Take regular breaks using the Pomodoro technique</p>
          <p className="mb-2">📝 Practice active recall through problem-solving</p>
          <p>🌟 Maintain your streak for bonus XP rewards!</p>
        </div>
      </motion.div>
    </div>
  );
}