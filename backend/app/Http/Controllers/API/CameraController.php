<?php

namespace App\Http\Controllers\API;

use App\Models\Camera;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CameraController extends Controller
{
    /**
     * الحصول على قائمة الكاميرات
     */
    public function index(): JsonResponse
    {
        $cameras = Camera::all();
        return response()->json([
            'success' => true,
            'data' => $cameras
        ]);
    }

    /**
     * إنشاء كاميرا جديدة
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ip_address' => 'required|ip',
            'port' => 'required|integer|between:1,65535',
            'stream_url' => 'required|url',
            'location' => 'nullable|string'
        ]);

        $camera = Camera::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الكاميرا بنجاح',
            'data' => $camera
        ], 201);
    }

    /**
     * عرض تفاصيل كاميرا
     */
    public function show(int $id): JsonResponse
    {
        $camera = Camera::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $camera
        ]);
    }

    /**
     * تحديث كاميرا
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $camera = Camera::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'ip_address' => 'ip',
            'port' => 'integer|between:1,65535',
            'stream_url' => 'url',
            'is_active' => 'boolean',
            'location' => 'nullable|string'
        ]);

        $camera->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث الكاميرا بنجاح',
            'data' => $camera
        ]);
    }

    /**
     * حذف كاميرا
     */
    public function destroy(int $id): JsonResponse
    {
        Camera::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الكاميرا بنجاح'
        ]);
    }
}
