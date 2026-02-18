<?php

namespace App\Services;

use App\Models\PricingPlan;
use App\Models\Subscription;
use App\Models\User;
use App\Models\Payment;
use App\Models\Invoice;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{
    /**
     * إنشاء اشتراك جديد للمستخدم
     */
    public function createSubscription(
        User $user,
        PricingPlan $plan,
        string $billingCycle = 'monthly',
        bool $isTrialPeriod = false,
        int $trialDays = 14
    ): Subscription {
        return DB::transaction(function () use ($user, $plan, $billingCycle, $isTrialPeriod, $trialDays) {
            $subscription = new Subscription();
            $subscription->user_id = $user->id;
            $subscription->plan_id = $plan->id;
            $subscription->billing_cycle = $billingCycle;
            $subscription->status = $isTrialPeriod ? 'active' : 'pending';
            $subscription->started_at = now();
            $subscription->current_period_start = now();
            $subscription->is_trial = $isTrialPeriod;
            
            if ($isTrialPeriod) {
                $subscription->trial_ends_at = now()->addDays($trialDays);
                $subscription->current_period_end = now()->addDays($trialDays);
            } else {
                if ($billingCycle === 'monthly') {
                    $subscription->current_period_end = now()->addMonth();
                } else {
                    $subscription->current_period_end = now()->addYear();
                }
            }

            $subscription->current_price = $billingCycle === 'monthly' 
                ? $plan->monthly_price 
                : $plan->getAnnualPrice();

            $subscription->active_users_count = 1;
            $subscription->save();

            // سجل الفاتورة الأولى للفترة التجريبية المجانية
            if ($isTrialPeriod) {
                $this->createInvoice($subscription, amount: 0, description: 'فترة تجريبية مجانية');
            }

            return $subscription;
        });
    }

    /**
     * ترقية الاشتراك إلى خطة أعلى
     */
    public function upgradePlan(Subscription $subscription, PricingPlan $newPlan): Subscription
    {
        return DB::transaction(function () use ($subscription, $newPlan) {
            // حساب الفرق المستحق
            $oldPrice = $subscription->current_price;
            $newPrice = $newPlan->monthly_price;
            $daysRemaining = $subscription->getDaysRemainingAttribute();
            $pricePerDay = $oldPrice / 30;
            $creditAmount = $pricePerDay * $daysRemaining;
            $duAmount = ($newPrice / 30) * $daysRemaining;
            $amountDue = $duAmount - $creditAmount;

            // تحديث الاشتراك
            $subscription->plan_id = $newPlan->id;
            $subscription->current_price = $newPrice;
            $subscription->save();

            // إنشاء فاتورة للفرق
            if ($amountDue > 0) {
                $this->createInvoice($subscription, amount: $amountDue, description: 'ترقية الخطة');
            }

            return $subscription;
        });
    }

    /**
     * تنزيل الاشتراك إلى خطة أقل
     */
    public function downgradePlan(Subscription $subscription, PricingPlan $newPlan): Subscription
    {
        return DB::transaction(function () use ($subscription, $newPlan) {
            // حساب الرصيد المستحق
            $oldPrice = $subscription->current_price;
            $newPrice = $newPlan->monthly_price;
            $daysRemaining = $subscription->getDaysRemainingAttribute();
            $pricePerDay = $oldPrice / 30;
            $creditAmount = $pricePerDay * $daysRemaining;
            $newDueAmount = ($newPrice / 30) * $daysRemaining;
            $refundAmount = $creditAmount - $newDueAmount;

            // تحديث الاشتراك
            $subscription->plan_id = $newPlan->id;
            $subscription->current_price = $newPrice;
            $subscription->save();

            // إنشاء فاتورة الاسترجاع
            if ($refundAmount > 0) {
                $this->createInvoice(
                    $subscription, 
                    amount: -$refundAmount, 
                    description: 'استرجاع من تنزيل الخطة'
                );
            }

            return $subscription;
        });
    }

    /**
     * معالجة التجديد التلقائي
     */
    public function renewSubscription(Subscription $subscription): Payment
    {
        return DB::transaction(function () use ($subscription) {
            // تحديث فترة الاشتراك
            if ($subscription->billing_cycle === 'monthly') {
                $subscription->current_period_start = $subscription->current_period_end;
                $subscription->current_period_end = $subscription->current_period_end->addMonth();
            } else {
                $subscription->current_period_start = $subscription->current_period_end;
                $subscription->current_period_end = $subscription->current_period_end->addYear();
            }

            $subscription->last_renewal_at = now();
            $subscription->save();

            // إنشاء فاتورة جديدة
            $invoice = $this->createInvoice(
                $subscription,
                amount: $subscription->current_price,
                description: 'تجديد الاشتراك'
            );

            // إنشاء سجل دفع
            $payment = new Payment();
            $payment->subscription_id = $subscription->id;
            $payment->invoice_id = $invoice->id;
            $payment->transaction_id = $this->generateTransactionId();
            $payment->payment_method = 'automatic_renewal';
            $payment->payment_gateway = 'stripe'; // أو البوابة المستخدمة
            $payment->status = 'completed';
            $payment->amount = $subscription->current_price;
            $payment->paid_at = now();
            $payment->save();

            return $payment;
        });
    }

    /**
     * إلغاء الاشتراك
     */
    public function cancelSubscription(Subscription $subscription, string $reason = null): void
    {
        DB::transaction(function () use ($subscription, $reason) {
            $subscription->status = 'canceled';
            $subscription->canceled_at = now();
            $subscription->save();

            // إذا كان هناك رصيد، إنشاء فاتورة استرجاع
            if ($subscription->current_period_end > now()) {
                $daysRemaining = now()->diffInDays($subscription->current_period_end, false);
                $pricePerDay = $subscription->current_price / 30;
                $refundAmount = $pricePerDay * $daysRemaining;

                if ($refundAmount > 0) {
                    $this->createInvoice(
                        $subscription,
                        amount: -$refundAmount,
                        description: 'استرجاع من إلغاء الاشتراك'
                    );
                }
            }
        });
    }

    /**
     * إعادة تفعيل الاشتراك الملغى
     */
    public function resumeSubscription(Subscription $subscription): Subscription
    {
        return DB::transaction(function () use ($subscription) {
            $subscription->status = 'active';
            $subscription->canceled_at = null;
            $subscription->current_period_start = now();
            $subscription->current_period_end = $subscription->billing_cycle === 'monthly' 
                ? now()->addMonth() 
                : now()->addYear();
            $subscription->save();

            // إنشاء فاتورة جديدة
            $this->createInvoice(
                $subscription,
                amount: $subscription->current_price,
                description: 'إعادة تفعيل الاشتراك'
            );

            return $subscription;
        });
    }

    /**
     * إنشاء فاتورة
     */
    public function createInvoice(
        Subscription $subscription,
        float $amount,
        string $description,
        ?\DateTime $dueDate = null
    ): Invoice {
        $invoice = new Invoice();
        $invoice->subscription_id = $subscription->id;
        $invoice->invoice_number = $this->generateInvoiceNumber();
        $invoice->status = $amount == 0 ? 'paid' : 'draft';
        $invoice->amount = abs($amount);
        $invoice->currency = 'USD';
        $invoice->issued_at = now();
        $invoice->due_at = $dueDate ?? now()->addDays(30);
        $invoice->notes = $description;
        $invoice->line_items = json_encode([
            [
                'description' => $description,
                'amount' => $amount,
            ]
        ]);

        $invoice->save();

        return $invoice;
    }

    /**
     * الحصول على جميع الاشتراكات النشطة
     */
    public function getActiveSubscriptions()
    {
        return Subscription::where('status', 'active')
            ->where('current_period_end', '>', now())
            ->with(['user', 'plan'])
            ->get();
    }

    /**
     * الحصول على الاشتراكات المنتهية الصلاحية
     */
    public function getExpiredSubscriptions()
    {
        return Subscription::where('current_period_end', '<=', now())
            ->where('status', '!=', 'canceled')
            ->with(['user', 'plan'])
            ->get();
    }

    /**
     * الحصول على الاشتراكات قريبة الانتهاء (خلال 7 أيام)
     */
    public function getSoonToExpireSubscriptions()
    {
        return Subscription::whereBetween('current_period_end', [now(), now()->addDays(7)])
            ->where('status', 'active')
            ->with(['user', 'plan'])
            ->get();
    }

    /**
     * توليد معرّف الفاتورة
     */
    private function generateInvoiceNumber(): string
    {
        $prefix = 'INV-' . date('Y-m-d') . '-';
        $count = Invoice::whereDate('created_at', today())->count() + 1;
        return $prefix . str_pad($count, 5, '0', STR_PAD_LEFT);
    }

    /**
     * توليد معرّف المعاملة
     */
    private function generateTransactionId(): string
    {
        return 'TXN-' . uniqid() . '-' . time();
    }

    /**
     * احسب إحصائيات الاشتراكات
     */
    public function getSubscriptionStats(): array
    {
        $totalSubscriptions = Subscription::count();
        $activeSubscriptions = Subscription::where('status', 'active')
            ->where('current_period_end', '>', now())
            ->count();
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        $monthlyRevenue = Payment::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount');

        $planDistribution = Subscription::where('status', 'active')
            ->selectRaw('plan_id, count(*) as count')
            ->groupBy('plan_id')
            ->with('plan:id,name')
            ->get();

        return [
            'total_subscriptions' => $totalSubscriptions,
            'active_subscriptions' => $activeSubscriptions,
            'total_revenue' => $totalRevenue,
            'monthly_revenue' => $monthlyRevenue,
            'churn_rate' => $totalSubscriptions > 0 
                ? (($totalSubscriptions - $activeSubscriptions) / $totalSubscriptions) * 100 
                : 0,
            'plan_distribution' => $planDistribution,
        ];
    }
}
