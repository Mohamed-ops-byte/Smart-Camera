# 🚀 دليل البدء السريع - نظام التسعير

## كل شيء تحتاجه للبدء في 5 دقائق!

---

## الخطوة 1️⃣: تثبيت قاعدة البيانات (2 دقيقة)

```bash
# الخطوة 1: الذهاب إلى مجلد Backend
cd backend

# الخطوة 2: تشغيل الترحيل
php artisan migrate

# الخطوة 3: (اختياري) تعبئة البيانات الأولية
php artisan db:seed --class=PricingSeeder
```

---

## الخطوة 2️⃣: إضافة المسارات (1 دقيقة)

أضف هذا السطر إلى `backend/routes/api.php` في البداية:

```php
// مسارات التسعير والاشتراكات
require base_path('routes/pricing.php');
```

---

## الخطوة 3️⃣: استخدام المكونات (2 دقيقة)

### صفحة التسعير الرئيسية
```tsx
// frontend/src/pages/PricingPage.tsx

import { PricingCards } from '@/components/PricingCards';

export default function PricingPage() {
  const handleSelectPlan = async (plan) => {
    console.log('تم اختيار:', plan.name);
    // يمكنك إضافة منطق الدفع هنا
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">
          اختر خطتك المثالية
        </h1>
        <p className="text-center text-gray-600 mb-12">
          جميع الخطط تشمل 30 يوم ضمان استرجاع المال
        </p>
        
        <PricingCards onSelectPlan={handleSelectPlan} />
      </div>
    </div>
  );
}
```

### صفحة الإعدادات/الاشتراك
```tsx
// frontend/src/pages/SettingsPage.tsx

import { SubscriptionCard } from '@/components/SubscriptionCard';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">إعدادات الاشتراك</h1>
      <SubscriptionCard />
    </div>
  );
}
```

---

## 📋 الاختبار السريع

### 1. اختبر الخطط (بدون توثيق)
```bash
# الحصول على جميع الخطط
curl http://localhost:8000/api/pricing-plans

# الحصول على خطة معينة
curl http://localhost:8000/api/pricing-plans/pro

# حساب التوفير
curl http://localhost:8000/api/pricing-plans/pro/savings
```

### 2. إنشاء اختبار مستخدم توثيق
قم بهذه الخطوات لاختبار الاشتراكات:

```php
// في tinker (php artisan tinker)

// 1. أنشئ مستخدم اختبار
$user = User::create([
    'name' => 'Ahmed Test',
    'email' => 'ahmed@test.com',
    'password' => bcrypt('password')
]);

// 2. أنشئ خطة
$plan = PricingPlan::where('slug', 'pro')->first();

// 3. أنشئ اشتراك
$subscription = $plan->subscriptions()->create([
    'user_id' => $user->id,
    'status' => 'active',
    'billing_cycle' => 'monthly',
    'started_at' => now(),
    'current_period_start' => now(),
    'current_period_end' => now()->addMonth(),
    'current_price' => $plan->monthly_price,
    'active_users_count' => 1,
]);

// 4. اختبر الدوال
dd($subscription->getUsageSummary());
```

### 3. اختبر API برمز الوثيق
```bash
# احصل على التوكن أولاً
TOKEN=$(curl -X POST http://localhost:8000/api/login \
  -d 'email=ahmed@test.com&password=password' | jq -r '.data.token')

# احصل على الاشتراك الحالي
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/subscriptions/current

# أنشئ اشتراك جديد
curl -X POST http://localhost:8000/api/subscriptions/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_slug": "basic",
    "billing_cycle": "monthly"
  }'

# ترقية الخطة
curl -X POST http://localhost:8000/api/subscriptions/upgrade \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_slug": "pro"
  }'
```

---

## 🎨 تخصيص الألوان والتصميم

### تغيير ألوان الخطط
```tsx
// في PricingCards.tsx، غيّر هذا:

const isPopular = plan.name === 'Pro'; // غيّر إلى الخطة التي تريدها

// أو استخدم معرّف خاص:
const isPopular = plan.slug === 'pro';
```

### تغيير الأسعار والميزات
ببساطة عدّل في قاعدة البيانات:

```php
// في tinker
$plan = PricingPlan::where('slug', 'pro')->first();
$plan->update([
    'monthly_price' => 39.99, // السعر الجديد
    'max_cameras' => 20,      // الكاميرات الجديدة
]);
```

---

## 🔐 إضافة الأمان والمصادقة

### حماية المسارات
جميع المسارات محمية افتراضياً باستثناء:
- `GET /api/pricing-plans/*` - عام
- `POST /api/pricing-plans/compare` - عام

باقي المسارات تتطلب توثيق:
```php
// في routes/pricing.php
Route::middleware('auth:api')->group(function () {
    // هنا المسارات المحمية
});
```

---

## 💾 حفظ النسخة الاحتياطية

### تصدير البيانات
```bash
cd backend

# تصدير خطط التسعير
php artisan db:table pricing_plans --export

# تصدير جميع البيانات
mysqldump -u root -p smart_camera > backup.sql
```

### استرجاع البيانات
```bash
# استيراد من نسخة احتياطية
mysql -u root -p smart_camera < backup.sql

# أو من tinker
php artisan tinker
PricingSeeder::new()->run();
```

---

## 🐛 استكشاف الأخطاء

### الخطأ: "Table not found"
```bash
# إعادة تشغيل الترحيلات
php artisan migrate:fresh
php artisan db:seed --class=PricingSeeder
```

### الخطأ: "401 Unauthorized"
تأكد من إضافة التوكن:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/subscriptions/current
```

### الخطأ: "Model not found"
تأكد من إضافة البيانات الأساسية:
```bash
php artisan db:seed --class=PricingSeeder
```

---

## 📱 الاختبار على الهاتف المحمول

### من جهاز آخر على الشبكة المحلية
```bash
# احصل على عنوان IP
ipconfig getifaddr en0  # Mac
ipconfig              # Windows

# استخدم العنوان:
http://YOUR_IP:8000/api/pricing-plans
```

---

## 🎯 الخطوات التالية

### بعد إعداد النظام:

1. **أضف معالجة الدفع الحقيقية**
   ```bash
   composer require stripe/stripe-php
   ```

2. **أضف إرسال الفواتير بالبريد**
   ```php
   Mail::send(new SubscriptionConfirmed($subscription));
   ```

3. **أضف تنبيهات المستخدم**
   ```php
   SimpleNotify::send($user, 'تمت ترقية خطتك إلى Pro');
   ```

4. **أضف التقارير المتقدمة**
   ```php
   Report::generate('subscriptions', 'revenue');
   ```

---

## 📞 الدعم السريع

### الأسئلة الشائعة:

**س: كيف أغير أسعار الخطط؟**
```php
$plan = PricingPlan::find(1);
$plan->monthly_price = 49.99;
$plan->save();
```

**س: كيف أضيف خطة جديدة؟**
```php
PricingPlan::create([
    'name' => 'Premium',
    'slug' => 'premium',
    'monthly_price' => 49.99,
    // ... باقي الحقول
]);
```

**س: كيف أحصل على الإحصائيات؟**
```php
$stats = app(SubscriptionService::class)->getSubscriptionStats();
dd($stats);
```

---

## ✅ قائمة التحقق (Checklist)

- [ ] تشغيل الترحيل (`php artisan migrate`)
- [ ] تعبئة البيانات الأولية (`php artisan db:seed`)
- [ ] إضافة المسارات في `api.php`
- [ ] اختبار API بـ curl
- [ ] إضافة المكونات إلى الواجهة الأمامية
- [ ] تخصيص الألوان والأسعار
- [ ] اختبار الترقية والتنزيل
- [ ] إضافة معالج الدفع الحقيقي
- [ ] إضافة الفواتير والبريد الإلكتروني
- [ ] نشر الكود 🚀

---

## 🎉 أنت جاهز!

النظام جاهز للاستخدام الفوري. استمتع بـ **نظام تسعير احترافي وسهل الاستخدام!** 🎊

لأي استفسار، راجع الملفات:
- `PRICING.md` - وثائق الأسعار الكاملة
- `PRICING_IMPLEMENTATION.md` - دليل التطبيق المفصل
- `PRICING_SUMMARY.md` - ملخص شامل
