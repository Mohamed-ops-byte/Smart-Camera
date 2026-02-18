import React from 'react';
import { Badge } from '@components/Common';
import { formatTime, getDetectionTypeLabel } from '@utils/formatters';
import type { Detection } from '@/types';

interface DetectionTimelineProps {
  detections: Detection[];
  onSelectDetection?: (detection: Detection) => void;
}

const DetectionTimeline: React.FC<DetectionTimelineProps> = ({ detections, onSelectDetection }) => {
  const typeIcons = {
    face: '👤',
    motion: '🔔',
    person: '👥',
    theft: '🚨',
    intrusion: '⚠️',
  } as const;

  const typeColors = {
    face: 'bg-blue-100',
    motion: 'bg-cyan-100',
    person: 'bg-purple-100',
    theft: 'bg-red-100',
    intrusion: 'bg-orange-100',
  } as const;

  if (detections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>📭 لا توجد عمليات كشف</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {detections.map((detection, index) => (
        <div
          key={detection.id}
          className="flex gap-4 cursor-pointer"
          onClick={() => onSelectDetection?.(detection)}
        >
          {/* Timeline Line */}
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full ${typeColors[detection.type as keyof typeof typeColors]} flex items-center justify-center font-lg`}>
              {typeIcons[detection.type as keyof typeof typeIcons]}
            </div>
            {index < detections.length - 1 && <div className="w-1 h-12 bg-gray-300 my-2" />}
          </div>

          {/* Content */}
          <div className="flex-1 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {detection.detectedPerson?.name || getDetectionTypeLabel(detection.type)}
                </h4>
                <p className="text-sm text-gray-600">{getDetectionTypeLabel(detection.type)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{formatTime(detection.timestamp)}</p>
                <Badge variant="primary" className="text-xs">
                  {Math.round(detection.confidence * 100)}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetectionTimeline;
