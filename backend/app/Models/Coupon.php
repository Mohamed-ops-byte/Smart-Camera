<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Coupon extends Model
{
    use HasFactory;

    protected $table = 'coupons';

    protected $fillable = [
        'code',
        'description',
        'type',
        'discount_value',
        'usage_limit',
        'times_used',
        'max_uses_per_user',
        'min_purchase_amount',
        'valid_from',
        'valid_until',
        'applicable_plans',
        'applicable_users',
        'is_active',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'min_purchase_amount' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'applicable_plans' => 'json',
        'applicable_users' => 'json',
        'is_active' => 'boolean',
    ];

    /**
     * العلاقة مع استخدام القسيمة
     */
    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * التحقق من صحة القسيمة
     */
    public function isValid(User $user = null, float $purchaseAmount = null): array
    {
        $errors = [];

        // التحقق من التفعيل
        if (!$this->is_active) {
            $errors[] = 'القسيمة غير مفعلة';
            return ['valid' => false, 'errors' => $errors];
        }

        // التحقق من صلاحية التاريخ
        if (now() < $this->valid_from) {
            $errors[] = 'القسيمة لم تبدأ بعد';
        }

        if (now() > $this->valid_until) {
            $errors[] = 'انتهت صلاحية القسيمة';
        }

        // التحقق من حد الاستخدام الكلي
        if ($this->usage_limit !== null && $this->times_used >= $this->usage_limit) {
            $errors[] = 'تم الوصول إلى حد الاستخدام الأقصى للقسيمة';
        }

        // التحقق من حد الاستخدام لكل مستخدم
        if ($user !== null) {
            $userUsageCount = CouponUsage::where('coupon_id', $this->id)
                ->where('user_id', $user->id)
                ->count();

            if ($userUsageCount >= $this->max_uses_per_user) {
                $errors[] = 'تم الوصول إلى حد الاستخدام الأقصى لك';
            }
        }

        // التحقق من الحد الأدنى للشراء
        if ($purchaseAmount !== null && $purchaseAmount < $this->min_purchase_amount) {
            $errors[] = 'المبلغ أقل من الحد الأدنى المطلوب';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }

    /**
     * حساب مبلغ الخصم
     */
    public function calculateDiscount(float $amount): float
    {
        if ($this->type === 'percentage') {
            return ($amount * $this->discount_value) / 100;
        } else {
            return min($this->discount_value, $amount);
        }
    }

    /**
     * استخدام القسيمة
     */
    public function use(User $user, Subscription $subscription, float $discountAmount): CouponUsage
    {
        $this->increment('times_used');

        $usage = new CouponUsage();
        $usage->coupon_id = $this->id;
        $usage->user_id = $user->id;
        $usage->subscription_id = $subscription->id;
        $usage->discount_amount = $discountAmount;
        $usage->used_at = now();
        $usage->save();

        return $usage;
    }

    /**
     * الحصول على القسائم النشطة
     */
    public static function getActiveCoupons()
    {
        return self::where('is_active', true)
            ->where('valid_from', '<=', now())
            ->where('valid_until', '>=', now())
            ->get();
    }

    /**
     * البحث عن قسيمة من خلال الكود
     */
    public static function findByCode(string $code)
    {
        return self::where('code', $code)->first();
    }
}
