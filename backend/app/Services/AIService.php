<?php

namespace App\Services;

use App\Models\Detection;
use App\Models\Alert;
use Illuminate\Support\Facades\Http;

/**
 * خدمة التواصل مع نظام الذكاء الاصطناعي
 */
class AIService
{
    protected string $pythonServiceUrl;

    public function __construct()
    {
        $this->pythonServiceUrl = config('app.python_service_url', 'http://localhost:5000');
    }

    /**
     * إرسال صورة للتعرف على الوجوه
     */
    public function recognizeFace(string $imagePath, int $cameraId): array
    {
        try {
            $response = Http::timeout(30)->post(
                $this->pythonServiceUrl . '/api/recognize',
                [
                    'image_path' => $imagePath,
                    'camera_id' => $cameraId
                ]
            );

            if ($response->successful()) {
                $data = $response->json();
                $this->handleFaceRecognitionResult($data, $cameraId, $imagePath);
                return $data;
            }
        } catch (\Exception $e) {
            report($e);
        }

        return ['success' => false];
    }

    /**
     * كشف الحركة
     */
    public function detectMotion(string $imagePath, int $cameraId): array
    {
        try {
            $response = Http::timeout(10)->post(
                $this->pythonServiceUrl . '/api/motion-detect',
                [
                    'image_path' => $imagePath,
                    'camera_id' => $cameraId
                ]
            );

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            report($e);
        }

        return ['detected' => false];
    }

    /**
     * كشف السرقة
     */
    public function detectTheft(string $imagePath, int $cameraId): array
    {
        try {
            $response = Http::timeout(10)->post(
                $this->pythonServiceUrl . '/api/theft-detect',
                [
                    'image_path' => $imagePath,
                    'camera_id' => $cameraId
                ]
            );

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Exception $e) {
            report($e);
        }

        return ['detected' => false];
    }

    /**
     * معالجة نتيجة التعرف على الوجوه
     */
    protected function handleFaceRecognitionResult(array $result, int $cameraId, string $imagePath): void
    {
        if (!$result['success'] ?? false) {
            return;
        }

        foreach ($result['faces'] ?? [] as $face) {
            $personId = $face['person_id'] ?? null;
            $confidence = $face['confidence'] ?? 0;

            Detection::create([
                'camera_id' => $cameraId,
                'person_id' => $personId,
                'detection_type' => 'person',
                'confidence' => $confidence,
                'image_path' => $imagePath,
                'timestamp' => now()
            ]);

            // إنشاء تنبيه إذا كان شخصاً غير معروف
            if (!$personId && $confidence > 0.5) {
                Alert::create([
                    'camera_id' => $cameraId,
                    'alert_type' => 'unknown_person',
                    'severity' => 'medium',
                    'message' => 'تم اكتشاف شخص غير معروف',
                    'image_path' => $imagePath
                ]);
            }
        }
    }
}
