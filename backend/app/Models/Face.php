<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Face extends Model
{
    use HasFactory;

    protected $fillable = [
        'person_id',
        'image_path',
        'face_encoding',
        'verified'
    ];

    protected $casts = [
        'verified' => 'boolean'
    ];

    /**
     * الشخص المرتبط بهذا الوجه
     */
    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
}
