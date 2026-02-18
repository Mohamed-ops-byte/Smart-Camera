<?php

namespace App\Services;

use App\Models\Alert;
use App\Models\Detection;

/**
 * خدمة إدارة التنبيهات
 */
class AlertService
{
    /**
     * إنشاء تنبيه سرقة
     */
    public function createTheftAlert(int $cameraId, string $imagePath): Alert
    {
        return Alert::create([
            'camera_id' => $cameraId,
            'alert_type' => 'theft',
            'severity' => 'critical',
            'message' => 'تم اكتشاف سرقة محتملة!',
            'image_path' => $imagePath,
            'is_acknowledged' => false
        ]);
    }

    /**
     * إنشاء تنبيه حركة
     */
    public function createMotionAlert(int $cameraId, string $imagePath): Alert
    {
        return Alert::create([
            'camera_id' => $cameraId,
            'alert_type' => 'motion',
            'severity' => 'medium',
            'message' => 'تم اكتشاف حركة',
            'image_path' => $imagePath,
            'is_acknowledged' => false
        ]);
    }

    /**
     * إنشاء تنبيه شخص غير معروف
     */
    public function createUnknownPersonAlert(int $cameraId, string $imagePath, float $confidence): Alert
    {
        return Alert::create([
            'camera_id' => $cameraId,
            'alert_type' => 'unknown_person',
            'severity' => $confidence > 0.8 ? 'high' : 'medium',
            'message' => 'شخص غير معروف بثقة ' . round($confidence * 100) . '%',
            'image_path' => $imagePath,
            'is_acknowledged' => false
        ]);
    }

    /**
     * الحصول على التنبيهات غير المؤكدة
     */
    public function getUnacknowledgedAlerts(int $limit = 10)
    {
        return Alert::where('is_acknowledged', false)
            ->with('camera', 'detection')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * إحصائيات التنبيهات
     */
    public function getStatistics(): array
    {
        return [
            'total' => Alert::count(),
            'unacknowledged' => Alert::where('is_acknowledged', false)->count(),
            'by_type' => Alert::selectRaw('alert_type, COUNT(*) as count')
                ->groupBy('alert_type')
                ->get(),
            'by_severity' => Alert::selectRaw('severity, COUNT(*) as count')
                ->groupBy('severity')
                ->get(),
            'today' => Alert::whereDate('created_at', today())->count()
        ];
    }
}
