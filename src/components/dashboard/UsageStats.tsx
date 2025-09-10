import React, { useState, useEffect } from 'react';
import { Clock, Target, Award, Calendar } from 'lucide-react';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DataChart } from '../graphs/DataChart';

interface UsageStatsProps {
  userId: string | undefined;
}

export function UsageStats({ userId }: UsageStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setStats({
            studyTime: userData.gamification.studyTime,
            streak: userData.gamification.streak,
            level: userData.gamification.level,
            xp: userData.gamification.xp
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        No statistics available
      </div>
    );
  }

  // Prepare chart data
  const studyTimeData = {
    labels: Object.keys(stats.studyTime.daily).slice(-7),
    datasets: [{
      label: 'Study Time (minutes)',
      data: Object.values(stats.studyTime.daily).slice(-7),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
    }]
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Study Time</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(stats.studyTime.total / 60)}h
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.streak.current} days
              </p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Level</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.level}
              </p>
            </div>
            <Award className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total XP</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.xp}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Time Trend</h3>
        <div className="h-[300px]">
          <DataChart
            data={studyTimeData}
            type="line"
            showGrid={true}
          />
        </div>
      </div>
    </div>
  );
}