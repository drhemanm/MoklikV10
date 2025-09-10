import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const progressPercentage = achievement.progress && achievement.target 
    ? (achievement.progress / achievement.target) * 100 
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border-2 transition-all ${
        achievement.unlocked
          ? 'border-yellow-200 bg-yellow-50'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
          achievement.unlocked
            ? 'bg-yellow-100'
            : 'bg-gray-200'
        }`}>
          {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
        </div>
        
        <div className="flex-1">
          <h4 className={`font-semibold ${
            achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {achievement.title}
          </h4>
          <p className={`text-sm ${
            achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {achievement.description}
          </p>
          
          {!achievement.unlocked && achievement.progress !== undefined && achievement.target && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {achievement.progress} / {achievement.target}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}