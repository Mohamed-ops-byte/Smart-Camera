import React, { useRef, useEffect } from 'react';
import { StatusIndicator, Badge } from '@components/Common';
import type { Camera } from '@/types';

interface CameraViewerProps {
  camera: Camera;
  fullscreen?: boolean;
}

const CameraViewer: React.FC<CameraViewerProps> = ({ camera, fullscreen = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (camera.liveStreamUrl && videoRef.current) {
      // في التطبيق الحقيقي، سيتم استخدام HLS.js أو مكتبة مشابهة
      // هنا نستخدم placeholder
      console.log('تشغيل البث المباشر:', camera.liveStreamUrl);
    }
  }, [camera.liveStreamUrl]);

  return (
    <div className={`relative w-full ${fullscreen ? 'h-screen' : 'h-96'} bg-gray-900 rounded-lg overflow-hidden`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      {/* Overlay Information */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">{camera.name}</h3>
            <p className="text-gray-300 text-sm">📍 {camera.location}</p>
          </div>
          <div className="pointer-events-auto">
            <StatusIndicator status={camera.status} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2">
          <Badge variant="info" className="text-xs">
            {camera.resolutionWidth}x{camera.resolutionHeight}
          </Badge>
          <Badge variant="primary" className="text-xs">
            {camera.frameRate} fps
          </Badge>
          {camera.recordingEnabled && (
            <Badge variant="success" className="text-xs flex items-center gap-1">
              <span className="animate-pulse">●</span> تسجيل
            </Badge>
          )}
        </div>
      </div>

      {/* Placeholder for when offline */}
      {camera.status === 'offline' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-center">
          <div>
            <div className="text-5xl mb-4">📡</div>
            <p className="text-lg font-semibold">الكاميرا غير متصلة</p>
            <p className="text-sm text-gray-300 mt-2">يرجى التحقق من الاتصال</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraViewer;
