<?php

namespace App\Http\Controllers\API;

use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ScheduleController extends Controller
{
    /**
     * قائمة الجداول
     */
    public function index(): JsonResponse
    {
        $schedules = Schedule::all();
        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }

    /**
     * إنشاء جدول جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:motion_detection,face_detection,theft_detection',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'is_active' => 'boolean',
            'settings' => 'nullable|array'
        ]);

        $schedule = Schedule::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الجدول بنجاح',
            'data' => $schedule
        ], 201);
    }

    /**
     * عرض تفاصيل الجدول
     */
    public function show(int $id): JsonResponse
    {
        $schedule = Schedule::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $schedule
        ]);
    }

    /**
     * تحديث الجدول
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $schedule = Schedule::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'type' => 'in:motion_detection,face_detection,theft_detection',
            'start_time' => 'date_format:H:i',
            'end_time' => 'date_format:H:i',
            'is_active' => 'boolean',
            'settings' => 'nullable|array'
        ]);

        $schedule->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث الجدول بنجاح',
            'data' => $schedule
        ]);
    }

    /**
     * حذف الجدول
     */
    public function destroy(int $id): JsonResponse
    {
        Schedule::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الجدول بنجاح'
        ]);
    }

    /**
     * الجداول النشطة الآن
     */
    public function active(): JsonResponse
    {
        $schedules = Schedule::all()->filter(function ($schedule) {
            return $schedule->isActiveNow();
        })->values();

        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }
}
