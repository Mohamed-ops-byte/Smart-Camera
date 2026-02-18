<?php

// تسجيل الخدمات والإعدادات الأساسية

// إعدادات التطبيق الذكي
return [
    'face' => [
        'detection_enabled' => env('FACE_DETECTION_ENABLED', true),
        'recognition_threshold' => env('FACE_RECOGNITION_THRESHOLD', 0.6),
        'max_faces_per_image' => env('MAX_FACES_TO_RECOGNIZE', 10),
    ],

    'motion' => [
        'detection_enabled' => env('MOTION_DETECTION_ENABLED', true),
        'sensitivity' => env('MOTION_SENSITIVITY', 0.5),
    ],

    'theft' => [
        'detection_enabled' => env('THEFT_DETECTION_ENABLED', true),
    ],

    'ai_service' => [
        'url' => env('PYTHON_SERVICE_URL', 'http://localhost:5000'),
        'timeout' => env('PYTHON_SERVICE_TIMEOUT', 30),
    ],
];
