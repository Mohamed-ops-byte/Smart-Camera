<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PricingPlan extends Model
{
    use HasFactory;

    protected $table = 'pricing_plans';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'monthly_price',
        'yearly_price',
        'max_cameras',
        'storage_gb',
        'retention_days',
        'max_users',
        'has_theft_detection',
        'has_advanced_scheduling',
        'has_api_access',
        'has_backup',
        'has_advanced_reports',
        'has_priority_support',
        'support_level',
        'response_time_hours',
        'sla_uptime',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'monthly_price' => 'decimal:2',
        'yearly_price' => 'decimal:2',
        'has_theft_detection' => 'boolean',
        'has_advanced_scheduling' => 'boolean',
        'has_api_access' => 'boolean',
        'has_backup' => 'boolean',
        'has_advanced_reports' => 'boolean',
        'has_priority_support' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * العلاقة مع الاشتراكات
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'plan_id');
    }

    /**
     * الحصول على الخطط النشطة
     */
    public static function getActivePlans()
    {
        return self::where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * الحصول على الخطة من خلال الـ slug
     */
    public static function findBySlug($slug): ?self
    {
        return self::where('slug', $slug)->first();
    }

    /**
     * الحصول على سعر الإجمالي السنوي
     */
    public function getAnnualPrice()
    {
        return $this->yearly_price ?? ($this->monthly_price * 12);
    }

    /**
     * حساب التوفير من الدفع السنوي
     */
    public function getYearlySavings()
    {
        $monthlyTotal = $this->monthly_price * 12;
        $yearlyPrice = $this->getAnnualPrice();
        return $monthlyTotal - $yearlyPrice;
    }

    /**
     * حساب نسبة الخصم
     */
    public function getYearlyDiscountPercentage()
    {
        $monthlyTotal = $this->monthly_price * 12;
        $yearlyPrice = $this->getAnnualPrice();
        
        if ($monthlyTotal == 0) {
            return 0;
        }

        return round((1 - ($yearlyPrice / $monthlyTotal)) * 100, 1);
    }
}
