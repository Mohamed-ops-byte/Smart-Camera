<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // جدول خطط الاشتراك
        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Free, Basic, Pro, Enterprise
            $table->string('slug')->unique(); // free, basic, pro, enterprise
            $table->text('description')->nullable();
            $table->decimal('monthly_price', 10, 2)->default(0);
            $table->decimal('yearly_price', 10, 2)->nullable();
            $table->integer('max_cameras')->default(1); // عدد الكاميرات العظمى
            $table->bigInteger('storage_gb')->default(5); // التخزين بالـ GB
            $table->integer('retention_days')->default(7); // أيام الاحتفاظ بالسجلات
            $table->integer('max_users')->default(1); // عدد المستخدمين الأقصى
            $table->boolean('has_theft_detection')->default(false); // كشف السرقة
            $table->boolean('has_advanced_scheduling')->default(false); // الجدولة المتقدمة
            $table->boolean('has_api_access')->default(false); // الوصول إلى API
            $table->boolean('has_backup')->default(false); // النسخ الاحتياطي التلقائي
            $table->boolean('has_advanced_reports')->default(false); // التقارير المتقدمة
            $table->boolean('has_priority_support')->default(false); // الدعم الأولوية
            $table->string('support_level')->default('none'); // none, email, priority, 24x7
            $table->integer('response_time_hours')->nullable(); // وقت الاستجابة بالساعات
            $table->string('sla_uptime')->default('95%'); // ضمان إمكانية الوصول
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // جدول الاشتراكات
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('pricing_plans')->onDelete('cascade');
            $table->string('stripe_subscription_id')->nullable()->unique();
            $table->string('status')->default('active'); // active, canceled, expired, past_due
            $table->string('billing_cycle')->default('monthly'); // monthly, yearly
            $table->dateTime('started_at');
            $table->dateTime('current_period_start')->nullable();
            $table->dateTime('current_period_end')->nullable();
            $table->dateTime('canceled_at')->nullable();
            $table->dateTime('trial_ends_at')->nullable();
            $table->boolean('is_trial')->default(false);
            $table->decimal('current_price', 10, 2)->nullable();
            $table->integer('active_cameras_count')->default(0);
            $table->bigInteger('used_storage_gb')->default(0);
            $table->integer('active_users_count')->default(1);
            $table->dateTime('last_renewal_at')->nullable();
            $table->timestamps();
        });

        // جدول المدفوعات
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->string('transaction_id')->unique();
            $table->string('payment_method'); // credit_card, paypal, stripe, bank_transfer
            $table->string('payment_gateway'); // stripe, paypal, 2checkout
            $table->string('status')->default('pending'); // pending, completed, failed, refunded
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('USD');
            $table->text('description')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->dateTime('failed_at')->nullable();
            $table->text('error_message')->nullable();
            $table->integer('retry_count')->default(0);
            $table->dateTime('last_retry_at')->nullable();
            $table->json('metadata')->nullable(); // بيانات إضافية
            $table->timestamps();
        });

        // جدول الفواتير
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->foreignId('payment_id')->nullable()->constrained()->onDelete('set null');
            $table->string('invoice_number')->unique();
            $table->string('status')->default('draft'); // draft, sent, paid, overdue, canceled
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('USD');
            $table->dateTime('issued_at');
            $table->dateTime('due_at');
            $table->dateTime('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->json('line_items')->nullable(); // تفاصيل البند
            $table->timestamps();
        });

        // جدول الخصومات والعروضات
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->string('type')->default('percentage'); // percentage, fixed
            $table->decimal('discount_value', 10, 2);
            $table->integer('usage_limit')->nullable(); // عدد مرات الاستخدام
            $table->integer('times_used')->default(0);
            $table->integer('max_uses_per_user')->default(1);
            $table->decimal('min_purchase_amount', 10, 2)->nullable();
            $table->dateTime('valid_from');
            $table->dateTime('valid_until');
            $table->json('applicable_plans')->nullable(); // الخطط القابلة للتطبيق
            $table->json('applicable_users')->nullable(); // المستخدمون المؤهلون
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // جدول استخدام القسيمة
        Schema::create('coupon_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coupon_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->decimal('discount_amount', 10, 2);
            $table->dateTime('used_at');
            $table->timestamps();
        });

        // جدول عروض الإحالة
        Schema::create('referral_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('referrer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('referred_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('referral_code')->unique();
            $table->string('status')->default('pending'); // pending, active, rewarded
            $table->decimal('referral_reward', 10, 2)->default(0);
            $table->dateTime('activated_at')->nullable();
            $table->dateTime('rewarded_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // جدول المزايا الإضافية
        Schema::create('add_ons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('monthly_price', 10, 2);
            $table->decimal('yearly_price', 10, 2)->nullable();
            $table->string('type'); // storage, extra_cameras, extra_users, support
            $table->integer('quantity')->default(1);
            $table->string('unit'); // GB, cameras, users
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // جدول المزايا المضافة للاشتراك
        Schema::create('subscription_add_ons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->foreignId('add_on_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 10, 2);
            $table->dateTime('started_at');
            $table->dateTime('ended_at')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();

            $table->unique(['subscription_id', 'add_on_id']);
        });

        // جدول سجل الفواتير (Billing History)
        Schema::create('billing_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action'); // subscription_created, plan_upgraded, payment_processed, refund_issued
            $table->text('description');
            $table->json('changes')->nullable(); // التغييرات التي تمت
            $table->decimal('amount', 10, 2)->nullable();
            $table->string('related_type')->nullable();
            $table->unsignedBigInteger('related_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billing_history');
        Schema::dropIfExists('subscription_add_ons');
        Schema::dropIfExists('add_ons');
        Schema::dropIfExists('referral_programs');
        Schema::dropIfExists('coupon_usages');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('pricing_plans');
    }
};
