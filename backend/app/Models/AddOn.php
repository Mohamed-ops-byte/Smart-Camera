<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AddOn extends Model
{
    use HasFactory;

    protected $table = 'add_ons';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'monthly_price',
        'yearly_price',
        'type',
        'quantity',
        'unit',
        'is_active',
    ];

    protected $casts = [
        'monthly_price' => 'decimal:2',
        'yearly_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * الحصول على السعر السنوي
     */
    public function getAnnualPrice()
    {
        return $this->yearly_price ?? ($this->monthly_price * 12);
    }

    /**
     * الحصول على المزايا النشطة
     */
    public static function getActiveAddOns()
    {
        return self::where('is_active', true)->get();
    }

    /**
     * البحث عن مزية من خلال الـ slug
     */
    public static function findBySlug(string $slug)
    {
        return self::where('slug', $slug)->first();
    }
}
