<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Person extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'is_trusted',
        'notes'
    ];

    protected $casts = [
        'is_trusted' => 'boolean'
    ];

    /**
     * صور الوجوه المتعلقة بهذا الشخص
     */
    public function faces(): HasMany
    {
        return $this->hasMany(Face::class);
    }

    /**
     * الكشف الخاص بهذا الشخص
     */
    public function detections(): HasMany
    {
        return $this->hasMany(Detection::class);
    }
}
