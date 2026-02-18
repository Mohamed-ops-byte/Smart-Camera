<?php

namespace App\Http\Controllers\API;

use App\Models\Subscription;
use App\Models\PricingPlan;
use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class SubscriptionController extends BaseController
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * احصل على اشتراك المستخدم الحالي
     */
    public function current(): JsonResponse
    {
        try {
            $user = Auth::user();
            $subscription = Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->with(['plan', 'addOns'])
                ->first();

            if (!$subscription) {
                return $this->error('لا يوجد اشتراك نشط', 404);
            }

            return $this->success([
                'subscription' => $subscription,
                'usage' => $subscription->getUsageSummary(),
                'is_trial' => $subscription->isOnTrial(),
                'days_remaining' => $subscription->getDaysRemainingAttribute(),
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * إنشاء اشتراك جديد
     */
    public function create(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'plan_slug' => 'required|string',
                'billing_cycle' => 'required|in:monthly,yearly',
                'use_trial' => 'boolean',
                'coupon_code' => 'nullable|string',
            ]);

            $user = Auth::user();

            // التحقق من عدم وجود اشتراك نشط
            $existingSubscription = Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->first();

            if ($existingSubscription) {
                return $this->error('لديك اشتراك نشط بالفعل', 400);
            }

            // البحث عن الخطة
            $plan = PricingPlan::findBySlug($validated['plan_slug']);
            if (!$plan) {
                return $this->error('الخطة غير موجودة', 404);
            }

            // إنشاء الاشتراك
            $useTrialPeriod = $validated['use_trial'] ?? false;
            $subscription = $this->subscriptionService->createSubscription(
                user: $user,
                plan: $plan,
                billingCycle: $validated['billing_cycle'],
                isTrialPeriod: $useTrialPeriod
            );

            return $this->success([
                'subscription' => $subscription,
                'message' => 'تم إنشاء الاشتراك بنجاح',
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * ترقية الخطة
     */
    public function upgrade(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'plan_slug' => 'required|string',
            ]);

            $user = Auth::user();
            $subscription = Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->first();

            if (!$subscription) {
                return $this->error('لا يوجد اشتراك نشط', 404);
            }

            $newPlan = PricingPlan::findBySlug($validated['plan_slug']);
            if (!$newPlan) {
                return $this->error('الخطة غير موجودة', 404);
            }

            if ($newPlan->monthly_price <= $subscription->plan->monthly_price) {
                return $this->error('يجب اختيار خطة أعلى', 400);
            }

            $subscription = $this->subscriptionService->upgradePlan($subscription, $newPlan);

            return $this->success([
                'subscription' => $subscription,
                'message' => 'تم ترقية الخطة بنجاح',
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * تنزيل الخطة
     */
    public function downgrade(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'plan_slug' => 'required|string',
            ]);

            $user = Auth::user();
            $subscription = Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->first();

            if (!$subscription) {
                return $this->error('لا يوجد اشتراك نشط', 404);
            }

            $newPlan = PricingPlan::findBySlug($validated['plan_slug']);
            if (!$newPlan) {
                return $this->error('الخطة غير موجودة', 404);
            }

            if ($newPlan->monthly_price >= $subscription->plan->monthly_price) {
                return $this->error('يجب اختيار خطة أقل', 400);
            }

            $subscription = $this->subscriptionService->downgradePlan($subscription, $newPlan);

            return $this->success([
                'subscription' => $subscription,
                'message' => 'تم تنزيل الخطة بنجاح',
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * إلغاء الاشتراك
     */
    public function cancel(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'reason' => 'nullable|string',
            ]);

            $user = Auth::user();
            $subscription = Subscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->first();

            if (!$subscription) {
                return $this->error('لا يوجد اشتراك نشط', 404);
            }

            $this->subscriptionService->cancelSubscription(
                subscription: $subscription,
                reason: $validated['reason'] ?? null
            );

            return $this->success([
                'message' => 'تم إلغاء الاشتراك بنجاح',
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * إعادة تفعيل الاشتراك الملغى
     */
    public function resume(): JsonResponse
    {
        try {
            $user = Auth::user();
            $subscription = Subscription::where('user_id', $user->id)
                ->where('status', 'canceled')
                ->first();

            if (!$subscription) {
                return $this->error('لا يوجد اشتراك ملغى', 404);
            }

            $subscription = $this->subscriptionService->resumeSubscription($subscription);

            return $this->success([
                'subscription' => $subscription,
                'message' => 'تم إعادة تفعيل الاشتراك بنجاح',
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /**
     * احصل على إحصائيات الاشتراك
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = $this->subscriptionService->getSubscriptionStats();

            return $this->success([
                'stats' => $stats,
            ]);
        } catch (Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
