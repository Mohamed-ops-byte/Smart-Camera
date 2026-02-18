<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\PricingPlanController;
use App\Http\Controllers\API\SubscriptionController;
use App\Http\Controllers\API\PaymentController;

/**
 * مسارات التسعير والاشتراكات
 * 
 * تتضمن جميع العمليات المتعلقة بخطط التسعير والاشتراكات والمدفوعات
 */

// مسارات بدون المصادقة (عامة)
Route::group(['prefix' => 'pricing-plans'], function () {
    // الحصول على جميع الخطط
    Route::get('/', [PricingPlanController::class, 'index']);
    
    // الحصول على خطة معينة
    Route::get('/{slug}', [PricingPlanController::class, 'show']);
    
    // حساب التوفير من الدفع السنوي
    Route::get('/{slug}/savings', [PricingPlanController::class, 'calculateSavings']);
    
    // مقارنة الخطط
    Route::post('/compare', [PricingPlanController::class, 'compare']);
});

// مسارات تتطلب المصادقة (مستخدم)
Route::middleware('auth:api')->group(function () {
    Route::group(['prefix' => 'subscriptions'], function () {
        // الحصول على الاشتراك الحالي
        Route::get('/current', [SubscriptionController::class, 'current']);
        
        // إنشاء اشتراك جديد
        Route::post('/create', [SubscriptionController::class, 'create']);
        
        // ترقية الخطة
        Route::post('/upgrade', [SubscriptionController::class, 'upgrade']);
        
        // تنزيل الخطة
        Route::post('/downgrade', [SubscriptionController::class, 'downgrade']);
        
        // إلغاء الاشتراك
        Route::post('/cancel', [SubscriptionController::class, 'cancel']);
        
        // إعادة تفعيل الاشتراك
        Route::post('/resume', [SubscriptionController::class, 'resume']);
        
        // إحصائيات الاشتراك
        Route::get('/stats', [SubscriptionController::class, 'stats']);
    });

    /**
     * مسارات الدفع
     * 
     * تعامل مع جميع عمليات الدفع والفواتير والمدفوعات
     */
    Route::group(['prefix' => 'payments'], function () {
        // استخدام قسيمة
        Route::post('/validate-coupon', [PaymentController::class, 'validateCoupon']);
        
        // معالجة المدفوعات
        Route::post('/process', [PaymentController::class, 'processPayment']);
        
        // الحصول على رسالة callback من Stripe
        Route::post('/webhook/stripe', [PaymentController::class, 'stripeWebhook']);
        
        // الحصول على رسالة callback من PayPal
        Route::post('/webhook/paypal', [PaymentController::class, 'paypalWebhook']);
        
        // الحصول على سجل الدفعات
        Route::get('/history', [PaymentController::class, 'paymentHistory']);
        
        // الحصول على الفواتير
        Route::get('/invoices', [PaymentController::class, 'invoices']);
        
        // تحميل فاتورة PDF
        Route::get('/invoices/{invoiceId}/pdf', [PaymentController::class, 'downloadInvoice']);
    });

    /**
     * مسارات المزايا الإضافية
     */
    Route::group(['prefix' => 'add-ons'], function () {
        // الحصول على المزايا المتاحة
        Route::get('/', [PaymentController::class, 'getAddOns']);
        
        // إضافة مزية إضافية للاشتراك
        Route::post('/subscribe', [PaymentController::class, 'subscribeToAddOn']);
        
        // إلغاء مزية إضافية
        Route::post('/{addOnId}/cancel', [PaymentController::class, 'cancelAddOn']);
    });
});
