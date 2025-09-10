import { useState, useEffect } from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import { db } from '../../config/firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { DataChart } from '../graphs/DataChart.js';

interface ResourceMetricsProps {
  userId: string | undefined;
}

export function ResourceMetrics({ userId }: ResourceMetricsProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const resourcesRef = collection(db, 'user_resources');
        const q = query(resourcesRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        
        const resourceData = snapshot.docs.map(doc => doc.data());
        const processedMetrics = processResourceData(resourceData);
        setMetrics(processedMetrics);
      } catch (error) {
        console.error('Error fetching resource metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [userId]);

  const processResourceData = (data: any[]) => {
    // Process the raw data into chart-friendly format
    const resourceTypes = ['pdf', 'video', 'document'];
    const usage = {
      downloads: resourceTypes.map(type => 
        data.filter(item => item.type === type)
          .reduce((sum, item) => sum + item.downloads, 0)
      ),
      views: resourceTypes.map(type => 
        data.filter(item => item.type === type)
          .reduce((sum, item) => sum + item.views, 0)
      )
    };

    return {
      chartData: {
        labels: resourceTypes,
        datasets: [
          {
            label: 'Downloads',
            data: usage.downloads,
            backgroundColor: 'rgba(59, 130, 246, 0.5)'
          },
          {
            label: 'Views',
            data: usage.views,
            backgroundColor: 'rgba(16, 185, 129, 0.5)'
          }
        ]
      },
      totalDownloads: usage.downloads.reduce((a, b) => a + b, 0),
      totalViews: usage.views.reduce((a, b) => a + b, 0),
      resourceCount: data.length
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-gray-500">
        No resource metrics available
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.totalDownloads}
              </p>
            </div>
            <Download className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.totalViews}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resources Used</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.resourceCount}
              </p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Usage by Type</h3>
        <div className="h-[300px]">
          <DataChart
            data={metrics.chartData}
            type="bar"
            showGrid={true}
          />
        </div>
      </div>
    </div>
  );
}