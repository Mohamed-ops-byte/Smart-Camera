<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Detection extends Model
{
    use HasFactory;

    protected $fillable = [
        'camera_id',
        'person_id',
        'detection_type',
        'confidence',
        'image_path',
        'timestamp',
        'notes'
    ];

    protected $casts = [
        'timestamp' => 'datetime'
    ];

    /**
     * الكاميرا التي قامت بالكشف
     */
    public function camera(): BelongsTo
    {
        return $this->belongsTo(Camera::class);
    }

    /**
     * الشخص المكتشف
     */
    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class)->nullable();
    }
}
