import React from 'react';
import { Card, Badge } from '@components/Common';
import { formatDateTime, formatConfidence, getDetectionTypeLabel } from '@utils/formatters';
import type { Detection } from '@/types';

interface DetectionCardProps {
  detection: Detection;
  onViewDetails?: (detection: Detection) => void;
}

const DetectionCard: React.FC<DetectionCardProps> = ({ detection, onViewDetails }) => {
  const typeColors = {
    face: 'primary',
    motion: 'info',
    person: 'info',
    theft: 'danger',
    intrusion: 'danger',
  } as const;

  return (
    <Card
      onClick={() => onViewDetails?.(detection)}
      className="cursor-pointer hover:shadow-lg dark:hover:shadow-xl transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-32 bg-gray-800 dark:bg-dark-700 rounded-lg mb-3 overflow-hidden">
        {detection.snapshotUrl ? (
          <img src={detection.snapshotUrl} alt="كشف" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-dark-400">📸</div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={typeColors[detection.type as keyof typeof typeColors]}>
            {getDetectionTypeLabel(detection.type)}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        {detection.detectedPerson && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-dark-100">👤 {detection.detectedPerson.name}</span>
            <Badge variant="success" className="text-xs">
              {detection.detectedPerson.type === 'resident' && 'ساكن'}
              {detection.detectedPerson.type === 'visitor' && 'زائر'}
              {detection.detectedPerson.type === 'intruder' && 'غير معروف'}
            </Badge>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-dark-400">الموثوقية</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${detection.confidence * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-dark-300">
              {formatConfidence(detection.confidence)}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-dark-500">{formatDateTime(detection.timestamp)}</p>
      </div>
    </Card>
  );
};

export default DetectionCard;
