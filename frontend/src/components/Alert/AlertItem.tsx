import React from 'react';
import { Badge, Card } from '@components/Common';
import { formatTimeAgo, getAlertSeverityColor, getAlertTypeLabel } from '@utils/formatters';
import type { Alert } from '@/types';

interface AlertItemProps {
  alert: Alert;
  onAcknowledge?: (alertId: string) => Promise<void>;
  onResolve?: (alertId: string) => Promise<void>;
  isLoading?: boolean;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onAcknowledge, onResolve, isLoading = false }) => {
  // const severityColors = {
  //   low: 'bg-blue-100 text-blue-800',
  //   medium: 'bg-yellow-100 text-yellow-800',
  //   high: 'bg-orange-100 text-orange-800',
  //   critical: 'bg-red-100 text-red-800',
  // };

  const severityDots = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  };

  return (
    <Card className={`border-l-4 ${getAlertSeverityColor(alert.severity)} transition-all ${
      !alert.acknowledged ? 'shadow-md dark:shadow-lg' : 'opacity-75'
    }`}>
      <div className="flex items-start gap-4">
        {/* Indicator */}
        <div className={`w-3 h-3 rounded-full ${severityDots[alert.severity]} mt-1 flex-shrink-0 ${
          !alert.acknowledged ? 'animate-pulse' : ''
        }`} />

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-dark-100">{alert.title}</h4>
              <p className="text-sm text-gray-600 dark:text-dark-400 mt-1">{alert.message}</p>
            </div>
            <Badge variant={alert.severity === 'critical' ? 'danger' : 'warning'}>
              {getAlertTypeLabel(alert.type)}
            </Badge>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-500 mb-3">
            <span>⏰ {formatTimeAgo(alert.timestamp)}</span>
            {alert.resolvedAt && <span>✓ تم الحل</span>}
            {alert.acknowledged && <span>👁️ تم تأكيده</span>}
          </div>

          {/* Actions */}
          {!alert.resolvedAt && (
            <div className="flex gap-2">
              {!alert.acknowledged && (
                <button
                  onClick={() => onAcknowledge?.(alert.id)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 transition-colors"
                >
                  تأكيد
                </button>
              )}
              <button
                onClick={() => onResolve?.(alert.id)}
                disabled={isLoading}
                className="text-xs px-3 py-1 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 transition-colors"
              >
                حل
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AlertItem;
