import { Trophy, Medal, User, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  isCurrentUser: boolean;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  title: string;
  metric: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  limit?: number;
}

export function LeaderboardCard({ 
  entries, 
  title, 
  metric,
  period = 'weekly',
  limit = 5
}: LeaderboardCardProps) {
  const displayEntries = entries.slice(0, limit);
  
  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center font-medium text-gray-500">{rank}</span>;
    }
  };
  
  const getPeriodText = () => {
    switch(period) {
      case 'daily':
        return 'Today';
      case 'weekly':
        return 'This Week';
      case 'monthly':
        return 'This Month';
      case 'all-time':
        return 'All Time';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{getPeriodText()}</p>
        </div>
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>
      
      <div className="space-y-4">
        {displayEntries.map((entry) => (
          <motion.div
            key={entry.id}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center p-3 rounded-lg ${
              entry.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
            }`}
          >
            <div className="w-8 flex-shrink-0 flex items-center justify-center">
              {getRankIcon(entry.rank)}
            </div>
            
            <div className="flex-shrink-0 ml-3">
              {entry.avatar ? (
                <img 
                  src={entry.avatar} 
                  alt={entry.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <p className={`font-medium truncate ${entry.isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                {entry.name} {entry.isCurrentUser && '(You)'}
              </p>
            </div>
            
            <div className="ml-3 flex-shrink-0">
              <span className="font-semibold text-gray-900">{entry.score}</span>
              <span className="text-xs text-gray-500 ml-1">{metric}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {entries.length > limit && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View Full Leaderboard
          </button>
        </div>
      )}
    </div>
  );
}