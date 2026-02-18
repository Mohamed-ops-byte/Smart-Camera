import React from 'react';
import { Badge, StatusIndicator } from '@components/Common';
import clsx from 'clsx';
import type { Camera } from '@/types';

interface CameraCardProps {
  camera: Camera;
  isSelected?: boolean;
  onSelect?: (camera: Camera) => void;
  onEdit?: (camera: Camera) => void;
  onDelete?: (cameraId: string) => void;
}

const CameraCard: React.FC<CameraCardProps> = ({ camera, isSelected, onSelect, onEdit, onDelete }) => {
  const [showActions, setShowActions] = React.useState(false);

  const handleMouseEnter = () => setShowActions(true);
  const handleMouseLeave = () => setShowActions(false);

  return (
    <div
      className={clsx(
        'relative bg-white dark:bg-dark-800 rounded-lg shadow-md dark:shadow-lg dark:shadow-dark-950 p-4 border border-gray-200 dark:border-dark-700 hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-200 cursor-pointer',
        isSelected && 'ring-2 ring-blue-500 shadow-lg dark:ring-blue-400'
      )}
      onClick={() => onSelect?.(camera)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* الصورة المصغرة */}
      <div className="relative w-full h-40 bg-gray-800 dark:bg-dark-700 rounded-lg mb-4 overflow-hidden">
        {camera.thumbnailUrl ? (
          <img src={camera.thumbnailUrl} alt={camera.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-dark-400">📷</div>
        )}
        <div className="absolute top-2 left-2">
          <StatusIndicator status={camera.status} />
        </div>
        {showActions && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(camera);
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              تعديل
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(camera.id);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              حذف
            </button>
          </div>
        )}
      </div>

      {/* المعلومات */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-dark-100 truncate">{camera.name}</h3>
        <p className="text-sm text-gray-600 dark:text-dark-400 truncate">📍 {camera.location}</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="info" className="text-xs">
            {camera.resolutionWidth}x{camera.resolutionHeight}
          </Badge>
          <Badge variant="primary" className="text-xs">
            {camera.frameRate} fps
          </Badge>
          {camera.recordingEnabled && <Badge variant="success" className="text-xs">تسجيل</Badge>}
        </div>
      </div>
    </div>
  );
};

export default CameraCard;
