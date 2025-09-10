import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Clock, Calendar } from 'lucide-react';

interface ProgressStats {
  level: number;
  xp: number;
  xpForNextLevel: number;
  streak: number;
  longestStreak: number;
  totalProblems: number;
  accuracy: number;
  studyTime: number;
  badgesEarned: number;
  totalBadges: number;
}

interface ProgressTrackerProps {
  stats: ProgressStats;
  showDetails?: boolean;
}

export function ProgressTracker({ stats, showDetails = true }: ProgressTrackerProps) {
  const levelProgress = (stats.xp % stats.xpForNextLevel) / stats.xpForNextLevel * 100;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
        Your Learning Progress
      </h2>
      
      {/* Level and XP */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="font-semibold text-gray-900">Level {stats.level}</h3>
            <p className="text-sm text-gray-600">
              {stats.xpForNextLevel - (stats.xp % stats.xpForNextLevel)} XP to Level {stats.level + 1}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.xp} XP</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            className="bg-blue-600 h-3 rounded-full"
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Streak</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.streak} days</p>
          <p className="text-xs text-gray-600">Longest: {stats.longestStreak} days</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Accuracy</h4>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.accuracy}%</p>
          <p className="text-xs text-gray-600">{stats.totalProblems} problems solved</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Study Time</h4>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.studyTime}h</p>
          <p className="text-xs text-gray-600">Total learning time</p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <h4 className="font-medium text-gray-900">Badges</h4>
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.badgesEarned}/{stats.totalBadges}
          </p>
          <p className="text-xs text-gray-600">Achievements unlocked</p>
        </div>
      </div>
      
      {showDetails && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 mb-2">Recent Achievements</h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Problem Solver</h4>
                <p className="text-sm text-gray-600">Solved 10 problems in a row correctly</p>
                <p className="text-xs text-gray-500 mt-1">Earned 2 days ago</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 rounded-full p-2">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Week Warrior</h4>
                <p className="text-sm text-gray-600">Maintained a 7-day study streak</p>
                <p className="text-xs text-gray-500 mt-1">Earned 5 days ago</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Achievements
            </button>
          </div>
        </div>
      )}
    </div>
  );
}