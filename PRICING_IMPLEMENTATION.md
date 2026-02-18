# 📖 دليل نظام التسعير والاشتراكات

## نظرة عامة

تم تطوير نظام تسعير شامل وكامل لتطبيق Smart Camera مع دعم:
- ✅ عدة خطط تسعير (Free, Basic, Pro, Enterprise)
- ✅ الترقية والتنزيل بين الخطط
- ✅ نظام الدفع والفواتير
- ✅ إدارة القسائم والأكواد الترويجية
- ✅ المزايا الإضافية
- ✅ برنامج الإحالة

---

## الملفات الأساسية المُضافة

### 1. **قاعدة البيانات** (Backend)
- `backend/database/migrations/2024_01_01_000008_create_subscriptions_table.php`
  - جداول الاشتراكات والدفعات والفواتير والقسائم

### 2. **نماذج البيانات** (Models)
- `backend/app/Models/PricingPlan.php` - خطط التسعير
- `backend/app/Models/Subscription.php` - الاشتراكات
- `backend/app/Models/Payment.php` - المدفوعات
- `backend/app/Models/Invoice.php` - الفواتير
- `backend/app/Models/Coupon.php` - القسائم الترويجية
- `backend/app/Models/CouponUsage.php` - استخدام القسائم
- `backend/app/Models/AddOn.php` - المزايا الإضافية
- `backend/app/Models/SubscriptionAddOn.php` - المزايا المضافة للاشتراكات

### 3. **الخدمات** (Services)
- `backend/app/Services/SubscriptionService.php`
  - معالجة جميع عمليات الاشتراكات والترقيات والتجديد

### 4. **المتحكمات** (Controllers)
- `backend/app/Http/Controllers/API/PricingPlanController.php` - إدارة الخطط
- `backend/app/Http/Controllers/API/SubscriptionController.php` - إدارة الاشتراكات
- `backend/routes/pricing.php` - مسارات API

### 5. **واجهة المستخدم** (Frontend)
- `frontend/src/components/PricingTable.tsx` - جدول المقارنة
- `frontend/src/components/PricingCards.tsx` - بطاقات الخطط
- `frontend/src/components/SubscriptionCard.tsx` - معلومات الاشتراك الحالي

---

## خطط التسعير

### 1. خطة مجاني (Free) - 0 دولار/شهر
- 1 كاميرا
- 5 GB تخزين
- تنبيهات محدودة
- سجل أحداث 7 أيام

### 2. خطة أساسي (Basic) - $9.99/شهر
- 4 كاميرات
- 100 GB تخزين
- كشف السرقة
- سجل أحداث 30 يوم
- دعم بريد إلكتروني

### 3. خطة احترافي (Pro) - $29.99/شهر
- 16 كاميرا
- 1 TB تخزين
- جدولة متقدمة
- وصول API
- 3 مستخدمين إضافيين
- دعم الأولوية
- نسخ احتياطي تلقائي

### 4. خطة مؤسسي (Enterprise) - حسب الطلب
- كاميرات غير محدودة
- تخزين غير محدود
- دعم 24/7
- فريق تكنيكي مخصص
- تكامل مخصص

---

## كيفية الاستخدام

### 1. تثبيت قاعدة البيانات

```bash
# تشغيل الترحيل
php artisan migrate
```

### 2. إضافة المسارات

أضف المسارات إلى `backend/routes/api.php`:

```php
// استيراد مسارات التسعير
require base_path('routes/pricing.php');
```

### 3. استخدام الواجهة الأمامية

```tsx
import { PricingCards } from '@/components/PricingCards';
import { SubscriptionCard } from '@/components/SubscriptionCard';

export default function PricingPage() {
  const handleSelectPlan = (plan) => {
    // معالجة اختيار الخطة
    console.log('تم اختيار:', plan.name);
  };

  return (
    <div className="space-y-12">
      <PricingCards onSelectPlan={handleSelectPlan} />
      <SubscriptionCard />
    </div>
  );
}
```

---

## API Endpoints

### الخطط
```
GET /api/pricing-plans                      # جميع الخطط
GET /api/pricing-plans/{slug}               # خطة معينة
GET /api/pricing-plans/{slug}/savings       # حساب التوفير
POST /api/pricing-plans/compare             # مقارنة الخطط
```

### الاشتراكات (تتطلب توثيق)
```
GET /api/subscriptions/current               # الاشتراك الحالي
POST /api/subscriptions/create               # إنشاء اشتراك
POST /api/subscriptions/upgrade              # ترقية الخطة
POST /api/subscriptions/downgrade            # تنزيل الخطة
POST /api/subscriptions/cancel               # إلغاء الاشتراك
POST /api/subscriptions/resume               # إعادة تفعيل
GET /api/subscriptions/stats                 # الإحصائيات
```

### الدفع (تتطلب توثيق)
```
POST /api/payments/validate-coupon          # التحقق من القسيمة
POST /api/payments/process                   # معالجة الدفع
POST /api/payments/webhook/stripe            # Stripe Webhook
POST /api/payments/webhook/paypal            # PayPal Webhook
GET /api/payments/history                    # سجل الدفعات
GET /api/payments/invoices                   # الفواتير
GET /api/payments/invoices/{id}/pdf          # تحميل فاتورة
```

---

## أمثلة الاستخدام

### إنشاء اشتراك

```bash
curl -X POST http://localhost:8000/api/subscriptions/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_slug": "pro",
    "billing_cycle": "monthly",
    "use_trial": true
  }'
```

### ترقية الخطة

```bash
curl -X POST http://localhost:8000/api/subscriptions/upgrade \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_slug": "pro"
  }'
```

### التحقق من القسيمة

```bash
curl -X POST http://localhost:8000/api/payments/validate-coupon \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER2024",
    "purchase_amount": 99.99
  }'
```

---

## المتطلبات المستقبلية

للتكامل الكامل مع بوابات الدفع:

### 1. Stripe Integration
```bash
composer require stripe/stripe-php
```

### 2. PayPal Integration
```bash
composer require paypal/checkout-sdk
```

### 3. إرسال البريد الإلكتروني
```php
// تنبيهات الفواتير والدفع والاشتراكات
Mail::send(new SubscriptionConfirmation($subscription));
```

---

## السياسات والقواعد

### سياسة الترقية والتنزيل
- **حساب يومي:** عند الترقية/التنزيل يتم حساب الفرق يومياً
- **بدون رسوم إضافية:** لا توجد رسوم على التغيير
- **فوري:** يتم التغيير فور الطلب

### سياسة الإلغاء
- **بدون عقوبة:** يمكن الإلغاء في أي وقت
- **استرجاع المال:** 30 يوم ضمان استرجاع كامل
- **الدفع الشهري:** إلغاء فوري
- **الدفع السنوي:** استرجاع إذا كانت المدة أقل من 30 يوم

### سياسة SLA
| الخطة | إمكانية الوصول | وقت الاستجابة |
|-------|:----:|:----:|
| Basic | 99% | 48 ساعة |
| Pro | 99.5% | 24 ساعة |
| Enterprise | 99.9% | 4 ساعات |

---

## الإحصائيات والتقارير

```php
$subscriptionService = new SubscriptionService();
$stats = $subscriptionService->getSubscriptionStats();

// النتيجة:
[
    'total_subscriptions' => 150,
    'active_subscriptions' => 120,
    'total_revenue' => 15000,
    'monthly_revenue' => 2500,
    'churn_rate' => 20,
    'plan_distribution' => [...]
]
```

---

## الملاحظات الأمنية

1. **حماية البيانات**
   - جميع المدفوعات على SSL/HTTPS
   - تشفير رقم البطاقة
   - عدم تخزين البيانات الحساسة

2. **التحقق**
   - التحقق من جميع طلبات API
   - التوثيق المزدوج للمدفوعات
   - سجل كامل للعمليات

3. **الامتثال**
   - GDPR - حماية البيانات الشخصية
   - PCI DSS - معايير الدفع
   - قوانين الخصوصية المحلية

---

## أسئلة شائعة

**س: هل يمكن تغيير الخطة منتصف الشهر؟**
ج: نعم، يتم حساب الفرق يومياً وتحديثها في الفاتورة التالية.

**س: هل يوجد فترة تجريبية مجانية؟**
ج: نعم، 14 يوم تجريبي للخطط المدفوعة (قابل للتعديل).

**س: كيف يتم معالجة الدفع الدوري التلقائي؟**
ج: يتم تجديد الاشتراك تلقائياً في نهاية كل فترة.

**س: هل يمكن إلغاء الاشتراك فوراً؟**
ج: نعم، يتم الإلغاء فوراً مع استرجاع الرصيد إن وجد.

---

## الدعم والمساعدة

للأسئلة والمساعدة:
- 📧 البريد الإلكتروني: support@smartcamera.com
- 🌐 الموقع: https://smartcamera.com/support
- 📱 الدردشة الحية: متاحة 24/7 للخطط Pro و Enterprise
