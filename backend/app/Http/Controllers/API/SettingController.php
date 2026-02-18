<?php

namespace App\Http\Controllers\API;

use App\Models\Setting;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SettingController extends Controller
{
    /**
     * الحصول على جميع الإعدادات
     */
    public function index(): JsonResponse
    {
        $settings = Setting::all();
        
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * تحديث إعداد معين
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'face_detection_enabled' => 'boolean',
            'face_recognition_threshold' => 'numeric|between:0,1',
            'motion_detection_enabled' => 'boolean',
            'motion_sensitivity' => 'numeric|between:0,1',
            'theft_detection_enabled' => 'boolean'
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث الإعدادات بنجاح'
        ]);
    }

    /**
     * إعادة تعيين الإعدادات إلى الوضع الافتراضي
     */
    public function reset(): JsonResponse
    {
        Setting::truncate();
        $this->setDefaults();

        return response()->json([
            'success' => true,
            'message' => 'تم إعادة تعيين الإعدادات'
        ]);
    }

    /**
     * تعيين الإعدادات الافتراضية
     */
    private function setDefaults(): void
    {
        Setting::set('face_detection_enabled', true);
        Setting::set('face_recognition_threshold', 0.6);
        Setting::set('motion_detection_enabled', true);
        Setting::set('motion_sensitivity', 0.5);
        Setting::set('theft_detection_enabled', true);
    }
}
