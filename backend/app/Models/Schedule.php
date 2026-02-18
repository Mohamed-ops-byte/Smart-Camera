<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'start_time',
        'end_time',
        'is_active',
        'settings'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'json'
    ];

    /**
     * التحقق من ما إذا كان الجدول نشطاً الآن
     */
    public function isActiveNow(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now()->format('H:i');
        $startTime = $this->start_time;
        $endTime = $this->end_time;

        if ($startTime <= $endTime) {
            return $now >= $startTime && $now <= $endTime;
        }

        return $now >= $startTime || $now <= $endTime;
    }
}
