import React from 'react';
import { Card } from '@components/Common';
import type { Alert } from '@/types';

interface AlertPanelProps {
  alerts: Alert[];
  isLoading?: boolean;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => {
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && !a.acknowledged);
  const highAlerts = alerts.filter((a) => a.severity === 'high' && !a.acknowledged);
  const totalUnread = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Critical Alerts Card */}
      <Card className="border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">تنبيهات حرجة</p>
            <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
          </div>
          <span className="text-4xl">🚨</span>
        </div>
      </Card>

      {/* High Priority Alerts Card */}
      <Card className="border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">تنبيهات مهمة</p>
            <p className="text-2xl font-bold text-orange-600">{highAlerts.length}</p>
          </div>
          <span className="text-4xl">⚠️</span>
        </div>
      </Card>

      {/* Total Unread Card */}
      <Card className="border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">إجمالي غير مقروء</p>
            <p className="text-2xl font-bold text-blue-600">{totalUnread}</p>
          </div>
          <span className="text-4xl">📬</span>
        </div>
      </Card>
    </div>
  );
};

export default AlertPanel;
