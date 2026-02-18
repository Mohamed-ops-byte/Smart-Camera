<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $table = 'subscriptions';

    protected $fillable = [
        'user_id',
        'plan_id',
        'stripe_subscription_id',
        'status',
        'billing_cycle',
        'started_at',
        'current_period_start',
        'current_period_end',
        'canceled_at',
        'trial_ends_at',
        'is_trial',
        'current_price',
        'active_cameras_count',
        'used_storage_gb',
        'active_users_count',
        'last_renewal_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'current_period_start' => 'datetime',
        'current_period_end' => 'datetime',
        'canceled_at' => 'datetime',
        'trial_ends_at' => 'datetime',
        'last_renewal_at' => 'datetime',
        'is_trial' => 'boolean',
        'current_price' => 'decimal:2',
        'used_storage_gb' => 'integer',
    ];

    /**
     * العلاقة مع المستخدم
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * العلاقة مع خطة التسعير
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(PricingPlan::class, 'plan_id');
    }

    /**
     * العلاقة مع المدفوعات
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * العلاقة مع الفواتير
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * العلاقة مع المزايا الإضافية
     */
    public function addOns(): HasMany
    {
        return $this->hasMany(SubscriptionAddOn::class);
    }

    /**
     * التحقق من أن الاشتراك نشط
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->current_period_end >= now();
    }

    /**
     * التحقق من أن هناك فترة تجريبية
     */
    public function isOnTrial(): bool
    {
        return $this->is_trial && $this->trial_ends_at > now();
    }

    /**
     * التحقق من انتهاء الفترة التجريبية
     */
    public function isTrialExpired(): bool
    {
        return $this->is_trial && $this->trial_ends_at <= now();
    }

    /**
     * الحصول على عدد الأيام المتبقية للاشتراك
     */
    public function getDaysRemainingAttribute(): int
    {
        if (!$this->current_period_end) {
            return 0;
        }

        return now()->diffInDays($this->current_period_end, false);
    }

    /**
     * الحصول على نسبة استخدام التخزين
     */
    public function getStorageUsagePercentage(): float
    {
        if ($this->plan->storage_gb == 0) {
            return 0;
        }

        return ($this->used_storage_gb / $this->plan->storage_gb) * 100;
    }

    /**
     * التحقق من استخدام التخزين الكامل
     */
    public function isStorageFull(): bool
    {
        return $this->used_storage_gb >= $this->plan->storage_gb;
    }

    /**
     * التحقق من إمكانية إضافة كاميرا جديدة
     */
    public function canAddCamera(): bool
    {
        return $this->active_cameras_count < $this->plan->max_cameras;
    }

    /**
     * التحقق من إمكانية إضافة مستخدم جديد
     */
    public function canAddUser(): bool
    {
        return $this->active_users_count < $this->plan->max_users;
    }

    /**
     * الترقية إلى خطة أخرى
     */
    public function upgradeTo(PricingPlan $newPlan): void
    {
        $this->update([
            'plan_id' => $newPlan->id,
            'status' => 'active',
        ]);
    }

    /**
     * تنزيل إلى خطة أخرى
     */
    public function downgradeTo(PricingPlan $newPlan): void
    {
        $this->update([
            'plan_id' => $newPlan->id,
            'status' => 'active',
        ]);
    }

    /**
     * إلغاء الاشتراك
     */
    public function cancel(): void
    {
        $this->update([
            'status' => 'canceled',
            'canceled_at' => now(),
        ]);
    }

    /**
     * السماح بالاشتراك مرة أخرى
     */
    public function resume(): void
    {
        $this->update([
            'status' => 'active',
            'canceled_at' => null,
        ]);
    }

    /**
     * حساب السعر الشهري للاشتراك الحالي
     */
    public function getMonthlyPrice(): float
    {
        $basePrice = $this->plan->monthly_price;
        
        // إضافة تكاليف المزايا الإضافية
        $addOnsPrice = $this->addOns()
            ->where('status', 'active')
            ->sum('price');

        return $basePrice + $addOnsPrice;
    }

    /**
     * الحصول على إجمالي الاستخدام
     */
    public function getUsageSummary(): array
    {
        return [
            'cameras' => [
                'current' => $this->active_cameras_count,
                'limit' => $this->plan->max_cameras,
                'percentage' => ($this->active_cameras_count / $this->plan->max_cameras) * 100,
            ],
            'storage' => [
                'current' => $this->used_storage_gb,
                'limit' => $this->plan->storage_gb,
                'percentage' => $this->getStorageUsagePercentage(),
            ],
            'users' => [
                'current' => $this->active_users_count,
                'limit' => $this->plan->max_users,
                'percentage' => ($this->active_users_count / $this->plan->max_users) * 100,
            ],
        ];
    }
}
