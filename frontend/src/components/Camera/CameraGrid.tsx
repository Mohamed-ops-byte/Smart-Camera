import React from 'react';
import CameraCard from './CameraCard';
import type { Camera } from '@/types';

interface CameraGridProps {
  cameras: Camera[];
  selectedCameraId?: string;
  onSelectCamera: (camera: Camera) => void;
  onEditCamera?: (camera: Camera) => void;
  onDeleteCamera?: (cameraId: string) => void;
  loading?: boolean;
}

const CameraGrid: React.FC<CameraGridProps> = ({
  cameras,
  selectedCameraId,
  onSelectCamera,
  onEditCamera,
  onDeleteCamera,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-64" />
        ))}
      </div>
    );
  }

  if (cameras.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">📷 لا توجد كاميرات مضافة</p>
        <p className="text-gray-400">ابدأ بإضافة كاميرا جديدة من menu</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cameras.map((camera) => (
        <CameraCard
          key={camera.id}
          camera={camera}
          isSelected={selectedCameraId === camera.id}
          onSelect={onSelectCamera}
          onEdit={onEditCamera}
          onDelete={onDeleteCamera}
        />
      ))}
    </div>
  );
};

export default CameraGrid;
