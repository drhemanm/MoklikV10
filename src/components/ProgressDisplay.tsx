import { Trophy, Star } from 'lucide-react';
import { useProgress } from '../hooks/useProgress.js';

export function ProgressDisplay() {
  const { level, xp, streak } = useProgress();
  const xpForNextLevel = (level * 1000) - (xp % 1000);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-secondary-dark neon-glow" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">Level {level}</h3>
              <p className="text-xs text-gray-500">{xpForNextLevel} XP to next level</p>
            </div>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <path className="animate-progress"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#progress-gradient)"
                strokeWidth="3"
                strokeDasharray={`${(xp % 1000) / 10}, 100`}
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#98FF98" />
                  <stop offset="100%" stopColor="#E6E6FA" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium">{xp % 1000}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-3">
          <Trophy className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Streak</h3>
            <p className="text-lg font-semibold text-blue-600">{streak} days</p>
          </div>
        </div>
        <div className="mt-2 flex space-x-1">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < (streak % 7) ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}