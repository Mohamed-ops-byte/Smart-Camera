<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Camera;
use App\Models\Person;
use App\Models\Face;
use App\Models\Schedule;
use App\Models\Setting;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // إضافة كاميرات تجريبية
        $this->seedCameras();
        
        // إضافة أشخاص تجريبيين
        $this->seedPersons();
        
        // إضافة جداول تجريبية
        $this->seedSchedules();
        
        // إضافة إعدادات افتراضية
        $this->seedSettings();
    }

    private function seedCameras(): void
    {
        $cameras = [
            [
                'name' => 'كاميرا المداخل',
                'ip_address' => '192.168.1.100',
                'port' => 8080,
                'stream_url' => 'http://192.168.1.100:8080/stream',
                'location' => 'الباب الأمامي',
                'is_active' => true
            ],
            [
                'name' => 'كاميرا الحديقة',
                'ip_address' => '192.168.1.101',
                'port' => 8080,
                'stream_url' => 'http://192.168.1.101:8080/stream',
                'location' => 'الحديقة الخلفية',
                'is_active' => true
            ],
            [
                'name' => 'كاميرا المخزن',
                'ip_address' => '192.168.1.102',
                'port' => 8080,
                'stream_url' => 'http://192.168.1.102:8080/stream',
                'location' => 'المخزن',
                'is_active' => true
            ]
        ];

        foreach ($cameras as $camera) {
            Camera::create($camera);
        }
    }

    private function seedPersons(): void
    {
        $persons = [
            [
                'name' => 'أحمد محمد',
                'email' => 'ahmed@example.com',
                'phone' => '0501234567',
                'is_trusted' => true,
                'notes' => 'مالك المنزل'
            ],
            [
                'name' => 'فاطمة علي',
                'email' => 'fatima@example.com',
                'phone' => '0509876543',
                'is_trusted' => true,
                'notes' => 'سكان المنزل'
            ],
            [
                'name' => 'محمود حسن',
                'email' => 'mahmoud@example.com',
                'phone' => '0505555555',
                'is_trusted' => true,
                'notes' => 'عامل الحديقة'
            ]
        ];

        foreach ($persons as $person) {
            Person::create($person);
        }
    }

    private function seedSchedules(): void
    {
        $schedules = [
            [
                'name' => 'جدول الليل - كشف الحركة',
                'type' => 'motion_detection',
                'start_time' => '22:00',
                'end_time' => '06:00',
                'is_active' => true,
                'settings' => ['sensitivity' => 0.7]
            ],
            [
                'name' => 'جدول النهار - التعرف على الوجوه',
                'type' => 'face_detection',
                'start_time' => '06:00',
                'end_time' => '22:00',
                'is_active' => true,
                'settings' => ['threshold' => 0.6]
            ],
            [
                'name' => 'كشف السرقة - طول الوقت',
                'type' => 'theft_detection',
                'start_time' => '00:00',
                'end_time' => '23:59',
                'is_active' => true,
                'settings' => []
            ]
        ];

        foreach ($schedules as $schedule) {
            Schedule::create($schedule);
        }
    }

    private function seedSettings(): void
    {
        $settings = [
            ['key' => 'face_detection_enabled', 'value' => true, 'type' => 'boolean'],
            ['key' => 'face_recognition_threshold', 'value' => 0.6, 'type' => 'float'],
            ['key' => 'motion_detection_enabled', 'value' => true, 'type' => 'boolean'],
            ['key' => 'motion_sensitivity', 'value' => 0.5, 'type' => 'float'],
            ['key' => 'theft_detection_enabled', 'value' => true, 'type' => 'boolean'],
            ['key' => 'alert_sound_enabled', 'value' => true, 'type' => 'boolean'],
            ['key' => 'email_notifications', 'value' => false, 'type' => 'boolean']
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
