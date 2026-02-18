import React from 'react';
import DetectionCard from './DetectionCard';
import type { Detection } from '@/types';

interface DetectionsListProps {
  detections: Detection[];
  onSelectDetection?: (detection: Detection) => void;
  columns?: 1 | 2 | 3 | 4;
  loading?: boolean;
}

const DetectionsList: React.FC<DetectionsListProps> = ({
  detections,
  onSelectDetection,
  columns = 3,
  loading = false,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-48" />
        ))}
      </div>
    );
  }

  if (detections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">📸 لا توجد عمليات كشف</p>
        <p className="text-gray-400">سيتم عرض الكشفيات المكتشفة هنا</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {detections.map((detection) => (
        <DetectionCard
          key={detection.id}
          detection={detection}
          onViewDetails={onSelectDetection}
        />
      ))}
    </div>
  );
};

export default DetectionsList;
