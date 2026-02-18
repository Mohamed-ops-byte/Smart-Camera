import React, { useState } from 'react';
import AlertItem from './AlertItem';
import { Button, Badge } from '@components/Common';
import type { Alert } from '@/types';

interface AlertListProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => Promise<void>;
  onResolve?: (alertId: string) => Promise<void>;
  maxItems?: number;
  compact?: boolean;
}

const AlertList: React.FC<AlertListProps> = ({
  alerts,
  onAcknowledge,
  onResolve,
  maxItems = 5,
  compact = false,
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayAlerts = showAll ? alerts : alerts.slice(0, maxItems);
  const unreadCount = alerts.filter((a) => !a.acknowledged).length;

  const handleAcknowledge = async (id: string) => {
    setLoadingId(id);
    try {
      await onAcknowledge?.(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleResolve = async (id: string) => {
    setLoadingId(id);
    try {
      await onResolve?.(id);
    } finally {
      setLoadingId(null);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">✓ لا توجد تنبيهات نشطة</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with Stats */}
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">التنبيهات</h3>
          {unreadCount > 0 && (
            <Badge variant="danger">{unreadCount} جديد</Badge>
          )}
        </div>
      )}

      {/* Alert Items */}
      {displayAlerts.map((alert) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
          isLoading={loadingId === alert.id}
        />
      ))}

      {/* Show More Button */}
      {alerts.length > maxItems && !showAll && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(true)}
          className="w-full"
        >
          عرض جميع التنبيهات ({alerts.length})
        </Button>
      )}
    </div>
  );
};

export default AlertList;
