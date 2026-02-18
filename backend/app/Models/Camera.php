<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Camera extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'ip_address',
        'port',
        'username',
        'password',
        'stream_url',
        'is_active',
        'location',
        'notes'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    /**
     * الأحداث المكتشفة من هذه الكاميرا
     */
    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class);
    }

    /**
     * الأشخاص المكتشفون من هذه الكاميرا
     */
    public function detections(): HasMany
    {
        return $this->hasMany(Detection::class);
    }
}
