import { useState, useEffect } from 'react';
import { Clock, Filter } from 'lucide-react';
import { db } from '../../config/firebase.js';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Timestamp;
}

interface ActivityLogProps {
  userId: string | undefined;
}

export function ActivityLog({ userId }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    if (!userId) return;

    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const startDate = new Date();
        switch (timeRange) {
          case 'day':
            startDate.setDate(startDate.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        }

        const activitiesRef = collection(db, 'user_activities');
        const q = query(
          activitiesRef,
          where('userId', '==', userId),
          where('timestamp', '>=', Timestamp.fromDate(startDate)),
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        const snapshot = await getDocs(q);
        const activityData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Activity));

        setActivities(activityData);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [userId, timeRange]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No activity found for the selected time range
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp.toDate().toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}