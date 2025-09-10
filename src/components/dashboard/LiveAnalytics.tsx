import React, { useState, useEffect } from 'react';
import { DataChart } from '../graphs/DataChart';
import { Brain, Target, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveAnalyticsProps {
  userId: string;
}

export function LiveAnalytics({ userId }: LiveAnalyticsProps) {
  const [studyData, setStudyData] = useState({
    dailyTime: [] as number[],
    weeklyProgress: [] as number[],
    topicMastery: {} as Record<string, number>,
    currentStreak: 0
  });

  // Update study time every minute when studying
  useEffect(() => {
    const interval = setInterval(() => {
      setStudyData(prev => ({
        ...prev,
        dailyTime: [...prev.dailyTime, (prev.dailyTime[prev.dailyTime.length - 1] || 0) + 1]
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Weekly progress data
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Study Hours',
      data: studyData.weeklyProgress,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
    }]
  };

  // Topic mastery data
  const masteryData = {
    labels: Object.keys(studyData.topicMastery),
    datasets: [{
      label: 'Mastery Level',
      data: Object.values(studyData.topicMastery),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ]
    }]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Real-time Study Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Current Session</p>
              <h3 className="text-2xl font-bold">
                {Math.floor(studyData.dailyTime.length / 60)}h {studyData.dailyTime.length % 60}m
              </h3>
            </div>
            <Clock className="w-8 h-8 text-blue-100" />
          </div>
          <div className="mt-4">
            <div className="h-2 bg-blue-400/30 rounded-full">
              <motion.div
                className="h-2 bg-blue-100 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 60, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Focus Score</p>
              <h3 className="text-2xl font-bold">98%</h3>
            </div>
            <Brain className="w-8 h-8 text-green-100" />
          </div>
          <p className="mt-2 text-sm text-green-100">High focus detected</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Learning Streak</p>
              <h3 className="text-2xl font-bold">{studyData.currentStreak} days</h3>
            </div>
            <Target className="w-8 h-8 text-purple-100" />
          </div>
          <p className="mt-2 text-sm text-purple-100">Keep it up!</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Progress Rate</p>
              <h3 className="text-2xl font-bold">+15%</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-100" />
          </div>
          <p className="mt-2 text-sm text-yellow-100">Above average</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl shadow-purple p-6 hover:shadow-purple-hover transition-all"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
          <div className="h-[300px]">
            <DataChart data={weeklyData} type="line" showGrid={true} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl shadow-purple p-6 hover:shadow-purple-hover transition-all"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Mastery</h3>
          <div className="h-[300px]">
            <DataChart data={masteryData} type="bar" showGrid={true} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}