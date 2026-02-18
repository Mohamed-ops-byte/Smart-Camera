<?php

namespace App\Http\Controllers\API;

use App\Models\PricingPlan;
use App\Models\Subscription;
use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PricingPlanController extends BaseController
{
    /**
     * احصل على جميع خطط التسعير
     */
    public function index(): JsonResponse
    {
        try {
            $plans = PricingPlan::getActivePlans();

            return $this->success([
                'plans' => $plans,
                'total' => $plans->count(),
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * احصل على تفاصيل خطة معينة
     */
    public function show(string $slug): JsonResponse
    {
        try {
            $plan = PricingPlan::findBySlug($slug);

            if (!$plan) {
                return $this->error('الخطة غير موجودة', 404);
            }

            return $this->success([
                'plan' => $plan,
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * حساب التوفير من الدفع السنوي
     */
    public function calculateSavings(string $slug): JsonResponse
    {
        try {
            $plan = PricingPlan::findBySlug($slug);

            if (!$plan) {
                return $this->error('الخطة غير موجودة', 404);
            }

            return $this->success([
                'plan' => $plan->name,
                'monthly_price' => $plan->monthly_price,
                'annual_monthly_total' => $plan->monthly_price * 12,
                'annual_price' => $plan->getAnnualPrice(),
                'savings' => $plan->getYearlySavings(),
                'discount_percentage' => $plan->getYearlyDiscountPercentage(),
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * مقارنة الخطط المختلفة
     */
    public function compare(Request $request): JsonResponse
    {
        try {
            $slugs = $request->input('plans', []);
            
            if (empty($slugs)) {
                $plans = PricingPlan::getActivePlans();
            } else {
                $plans = PricingPlan::whereIn('slug', $slugs)->get();
            }

            return $this->success([
                'plans' => $plans,
                'comparison_fields' => [
                    'max_cameras' => 'عدد الكاميرات',
                    'storage_gb' => 'التخزين السحابي (GB)',
                    'retention_days' => 'مدة الاحتفاظ بالسجلات',
                    'max_users' => 'عدد المستخدمين',
                    'has_theft_detection' => 'كشف السرقة',
                    'has_advanced_scheduling' => 'جدولة متقدمة',
                    'has_api_access' => 'وصول API',
                    'has_backup' => 'نسخ احتياطي تلقائي',
                    'support_level' => 'مستوى الدعم',
                ],
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
