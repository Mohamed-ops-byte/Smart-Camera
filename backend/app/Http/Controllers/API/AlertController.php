<?php

namespace App\Http\Controllers\API;

use App\Models\Alert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AlertController extends Controller
{
    /**
     * قائمة التنبيهات
     */
    public function index(Request $request): JsonResponse
    {
        $query = Alert::with('camera', 'detection');

        if (!$request->has('all')) {
            $query->where('is_acknowledged', false);
        }

        if ($request->has('severity')) {
            $query->where('severity', $request->severity);
        }

        $alerts = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $alerts
        ]);
    }

    /**
     * إنشاء تنبيه جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'camera_id' => 'required|exists:cameras,id',
            'detection_id' => 'nullable|exists:detections,id',
            'alert_type' => 'required|in:theft,unknown_person,motion',
            'severity' => 'required|in:low,medium,high,critical',
            'message' => 'required|string',
            'image_path' => 'nullable|string'
        ]);

        $alert = Alert::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء التنبيه',
            'data' => $alert
        ], 201);
    }

    /**
     * تأكيد التنبيه
     */
    public function acknowledge(int $id): JsonResponse
    {
        $alert = Alert::findOrFail($id);
        $alert->acknowledge();

        return response()->json([
            'success' => true,
            'message' => 'تم تأكيد التنبيه',
            'data' => $alert
        ]);
    }

    /**
     * الحصول على التنبيهات غير المؤكدة
     */
    public function unacknowledged(): JsonResponse
    {
        $alerts = Alert::where('is_acknowledged', false)
            ->with('camera', 'detection')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'count' => count($alerts),
            'data' => $alerts
        ]);
    }

    /**
     * حذف التنبيه
     */
    public function destroy(int $id): JsonResponse
    {
        Alert::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف التنبيه'
        ]);
    }
}
