<?php

namespace App\Http\Controllers\API;

use App\Models\Detection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class DetectionController extends Controller
{
    /**
     * قائمة الاكتشافات
     */
    public function index(Request $request): JsonResponse
    {
        $query = Detection::with('camera', 'person');

        if ($request->has('camera_id')) {
            $query->where('camera_id', $request->camera_id);
        }

        if ($request->has('type')) {
            $query->where('detection_type', $request->type);
        }

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->whereBetween('timestamp', [
                $request->from_date,
                $request->to_date
            ]);
        }

        $detections = $query->orderBy('timestamp', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $detections
        ]);
    }

    /**
     * تسجيل اكتشاف جديد (من Python Service)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'camera_id' => 'required|exists:cameras,id',
            'person_id' => 'nullable|exists:persons,id',
            'detection_type' => 'required|in:person,motion,theft',
            'confidence' => 'required|numeric|between:0,1',
            'image_path' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        $detection = Detection::create(array_merge($validated, [
            'timestamp' => now()
        ]));

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الاكتشاف',
            'data' => $detection
        ], 201);
    }

    /**
     * تفاصيل الاكتشاف
     */
    public function show(int $id): JsonResponse
    {
        $detection = Detection::with('camera', 'person')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $detection
        ]);
    }

    /**
     * إحصائيات الاكتشافات
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_detections' => Detection::count(),
            'today_detections' => Detection::whereDate('timestamp', today())->count(),
            'by_type' => Detection::selectRaw('detection_type, COUNT(*) as count')
                ->groupBy('detection_type')
                ->get(),
            'by_person' => Detection::with('person')
                ->selectRaw('person_id, COUNT(*) as count')
                ->groupBy('person_id')
                ->limit(10)
                ->get()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
