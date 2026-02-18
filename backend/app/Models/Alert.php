<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Alert extends Model
{
    use HasFactory;

    protected $fillable = [
        'camera_id',
        'detection_id',
        'alert_type',
        'severity',
        'message',
        'is_acknowledged',
        'acknowledged_at',
        'image_path'
    ];

    protected $casts = [
        'is_acknowledged' => 'boolean',
        'acknowledged_at' => 'datetime'
    ];

    /**
     * الكاميرا المرتبطة بهذا التنبيه
     */
    public function camera(): BelongsTo
    {
        return $this->belongsTo(Camera::class);
    }

    /**
     * الكشف المرتبط بهذا التنبيه
     */
    public function detection(): BelongsTo
    {
        return $this->belongsTo(Detection::class)->nullable();
    }

    /**
     * تأكيد التنبيه
     */
    public function acknowledge(): void
    {
        $this->update([
            'is_acknowledged' => true,
            'acknowledged_at' => now()
        ]);
    }
}
