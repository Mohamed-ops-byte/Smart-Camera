import React from 'react';
import { Card, Badge, StatusIndicator } from '@components/Common';
import { AlertList } from '@components/Alert';
import { DetectionsList } from '@components/Detection';
import type { Alert, Detection, Camera } from '@/types';

interface DashboardOverviewProps {
  cameras: Camera[];
  alerts: Alert[];
  detections: Detection[];
  isLoading?: boolean;
  onNavigateToSection?: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  cameras,
  alerts,
  detections,
  isLoading = false,
  onNavigateToSection,
}) => {
  const onlineCameras = cameras.filter((c) => c.status === 'online').length;
  const recordingCameras = cameras.filter((c) => c.status === 'recording').length;
  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;
  const todayDetections = detections.length;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cameras */}
        <Card
          onClick={() => onNavigateToSection?.('cameras')}
          className="cursor-pointer border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-dark-400">إجمالي الكاميرات</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{cameras.length}</p>
            </div>
            <span className="text-3xl">📷</span>
          </div>
        </Card>

        {/* Online Cameras */}
        <Card
          onClick={() => onNavigateToSection?.('cameras')}
          className="cursor-pointer border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-dark-400">متصلة</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{onlineCameras}</p>
              <p className="text-xs text-gray-500 dark:text-dark-500">+ {recordingCameras} قيد التسجيل</p>
            </div>
            <span className="text-3xl">✓</span>
          </div>
        </Card>

        {/* Unread Alerts */}
        <Card
          onClick={() => onNavigateToSection?.('alerts')}
          className="cursor-pointer border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-dark-400">تنبيهات لم تُقرأ</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{unreadAlerts}</p>
            </div>
            <span className="text-3xl">🔔</span>
          </div>
        </Card>

        {/* Today Detections */}
        <Card
          onClick={() => onNavigateToSection?.('detections')}
          className="cursor-pointer border-l-4 border-purple-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-dark-400">الكشفيات اليوم</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{todayDetections}</p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Section */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 flex items-center gap-2">
              <span>🚨</span>
              التنبيهات الأخيرة
              {unreadAlerts > 0 && <Badge variant="danger">{unreadAlerts}</Badge>}
            </h2>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-dark-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <AlertList alerts={alerts.slice(0, 3)} maxItems={3} />
          )}
        </div>

        {/* Cameras Status */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center gap-2">
            <span>📷</span>
            حالة الكاميرات
          </h2>
          <div className="space-y-2">
            {cameras.slice(0, 5).map((camera) => (
              <Card key={camera.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-dark-100">{camera.name}</p>
                    <p className="text-xs text-gray-600 dark:text-dark-400">{camera.location}</p>
                  </div>
                  <StatusIndicator status={camera.status} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Detections */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center gap-2">
          <span>📸</span>
          آخر الكشفيات
        </h2>
        <DetectionsList detections={detections.slice(0, 4)} columns={2} loading={isLoading} />
      </div>
    </div>
  );
};

export default DashboardOverview;
