<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PricingPlan;
use App\Models\AddOn;
use App\Models\Coupon;
use Carbon\Carbon;

class PricingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إضافة خطط التسعير
        $this->seedPricingPlans();
        
        // إضافة المزايا الإضافية
        $this->seedAddOns();
        
        // إضافة القسائم الترويجية
        $this->seedCoupons();
    }

    /**
     * إضافة خطط التسعير
     */
    private function seedPricingPlans(): void
    {
        PricingPlan::create([
            'name' => 'مجاني',
            'slug' => 'free',
            'description' => 'خطة مجانية مثالية للمستخدمين الجدد والاختبار',
            'monthly_price' => 0,
            'yearly_price' => 0,
            'max_cameras' => 1,
            'storage_gb' => 5,
            'retention_days' => 7,
            'max_users' => 1,
            'has_theft_detection' => false,
            'has_advanced_scheduling' => false,
            'has_api_access' => false,
            'has_backup' => false,
            'has_advanced_reports' => false,
            'has_priority_support' => false,
            'support_level' => 'none',
            'response_time_hours' => null,
            'sla_uptime' => '95%',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        PricingPlan::create([
            'name' => 'أساسي',
            'slug' => 'basic',
            'description' => 'خطة مثالية للمنازل الصغيرة والمتاجر',
            'monthly_price' => 9.99,
            'yearly_price' => 99.90,
            'max_cameras' => 4,
            'storage_gb' => 100,
            'retention_days' => 30,
            'max_users' => 1,
            'has_theft_detection' => true,
            'has_advanced_scheduling' => true,
            'has_api_access' => false,
            'has_backup' => false,
            'has_advanced_reports' => false,
            'has_priority_support' => false,
            'support_level' => 'email',
            'response_time_hours' => 48,
            'sla_uptime' => '99%',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        PricingPlan::create([
            'name' => 'احترافي',
            'slug' => 'pro',
            'description' => 'خطة متقدمة للشركات والمؤسسات الصغيرة',
            'monthly_price' => 29.99,
            'yearly_price' => 239.92,
            'max_cameras' => 16,
            'storage_gb' => 1024,
            'retention_days' => 180,
            'max_users' => 3,
            'has_theft_detection' => true,
            'has_advanced_scheduling' => true,
            'has_api_access' => true,
            'has_backup' => true,
            'has_advanced_reports' => true,
            'has_priority_support' => true,
            'support_level' => 'priority',
            'response_time_hours' => 24,
            'sla_uptime' => '99.5%',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        PricingPlan::create([
            'name' => 'مؤسسي',
            'slug' => 'enterprise',
            'description' => 'حل شامل للمؤسسات الكبرى مع دعم مخصص',
            'monthly_price' => 99.99,
            'yearly_price' => 999.90,
            'max_cameras' => 999,
            'storage_gb' => 10240,
            'retention_days' => 365,
            'max_users' => 50,
            'has_theft_detection' => true,
            'has_advanced_scheduling' => true,
            'has_api_access' => true,
            'has_backup' => true,
            'has_advanced_reports' => true,
            'has_priority_support' => true,
            'support_level' => '24x7',
            'response_time_hours' => 4,
            'sla_uptime' => '99.9%',
            'is_active' => true,
            'sort_order' => 4,
        ]);
    }

    /**
     * إضافة المزايا الإضافية
     */
    private function seedAddOns(): void
    {
        AddOn::create([
            'name' => 'تخزين سحابي إضافي 100GB',
            'slug' => 'storage-100gb',
            'description' => 'إضافة 100 GB من التخزين السحابي',
            'monthly_price' => 4.99,
            'yearly_price' => 49.90,
            'type' => 'storage',
            'quantity' => 100,
            'unit' => 'GB',
            'is_active' => true,
        ]);

        AddOn::create([
            'name' => 'كاميرا إضافية',
            'slug' => 'extra-camera',
            'description' => 'إضافة كاميرا واحدة للاشتراك',
            'monthly_price' => 3.99,
            'yearly_price' => 39.90,
            'type' => 'extra_cameras',
            'quantity' => 1,
            'unit' => 'camera',
            'is_active' => true,
        ]);

        AddOn::create([
            'name' => 'مستخدم إضافي',
            'slug' => 'extra-user',
            'description' => 'إضافة مستخدم واحد للاشتراك',
            'monthly_price' => 2.99,
            'yearly_price' => 29.90,
            'type' => 'extra_users',
            'quantity' => 1,
            'unit' => 'user',
            'is_active' => true,
        ]);

        AddOn::create([
            'name' => 'دعم الأولوية',
            'slug' => 'priority-support',
            'description' => 'دعم فني بالأولوية مع Slack و Email',
            'monthly_price' => 9.99,
            'yearly_price' => 99.90,
            'type' => 'support',
            'quantity' => 1,
            'unit' => 'month',
            'is_active' => true,
        ]);
    }

    /**
     * إضافة القسائم والأكواد الترويجية
     */
    private function seedCoupons(): void
    {
        // قسيمة الصيف
        Coupon::create([
            'code' => 'SUMMER2024',
            'description' => 'خصم 20% على جميع الخطط المدفوعة',
            'type' => 'percentage',
            'discount_value' => 20,
            'usage_limit' => 100,
            'times_used' => 0,
            'max_uses_per_user' => 1,
            'min_purchase_amount' => 9.99,
            'valid_from' => Carbon::now()->subDays(30),
            'valid_until' => Carbon::now()->addDays(60),
            'applicable_plans' => json_encode(['basic', 'pro', 'enterprise']),
            'is_active' => true,
        ]);

        // قسيمة الإحالة
        Coupon::create([
            'code' => 'REFERRAL20',
            'description' => 'خصم $20 للعملاء الجدد المحالين',
            'type' => 'fixed',
            'discount_value' => 20,
            'usage_limit' => null,
            'times_used' => 0,
            'max_uses_per_user' => 1,
            'min_purchase_amount' => 9.99,
            'valid_from' => Carbon::now(),
            'valid_until' => Carbon::now()->addYear(),
            'applicable_plans' => json_encode(['basic', 'pro']),
            'is_active' => true,
        ]);

        // قسيمة الطلاب
        Coupon::create([
            'code' => 'STUDENT40',
            'description' => 'خصم 40% للطلاب والمؤسسات التعليمية',
            'type' => 'percentage',
            'discount_value' => 40,
            'usage_limit' => 500,
            'times_used' => 0,
            'max_uses_per_user' => 1,
            'min_purchase_amount' => 0,
            'valid_from' => Carbon::now(),
            'valid_until' => Carbon::now()->addYear(),
            'is_active' => true,
        ]);

        // قسيمة العرض الأول
        Coupon::create([
            'code' => 'WELCOME15',
            'description' => 'خصم 15% على أول اشتراك',
            'type' => 'percentage',
            'discount_value' => 15,
            'usage_limit' => null,
            'times_used' => 0,
            'max_uses_per_user' => 1,
            'min_purchase_amount' => 9.99,
            'valid_from' => Carbon::now(),
            'valid_until' => Carbon::now()->addYear(),
            'applicable_plans' => json_encode(['basic', 'pro', 'enterprise']),
            'is_active' => true,
        ]);
    }
}
