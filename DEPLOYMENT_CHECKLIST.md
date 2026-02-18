# 📝 Checklist النشر والاختبار

## ✅ قبل النشر

### Backend

- [ ] تثبيت Composer packages
  ```bash
  composer install
  ```

- [ ] إنشاء ملف .env
  ```bash
  cp .env.example .env
  ```

- [ ] إنشاء مفتاح التطبيق
  ```bash
  php artisan key:generate
  ```

- [ ] تشغيل Migrations
  ```bash
  php artisan migrate
  ```

- [ ] تحميل Seeder (بيانات تجريبية)
  ```bash
  php artisan db:seed
  ```

### Python Service

- [ ] تثبيت المتطلبات
  ```bash
  pip install -r requirements.txt
  ```

- [ ] اختبار الخدمة
  ```bash
  python test_client.py
  ```

- [ ] فحص الإعدادات
  - [ ] تحقق من FLASK_ENV
  - [ ] تحقق من المنفذ 5000

### Frontend

- [ ] تثبيت NPM packages
  ```bash
  npm install
  ```

- [ ] التحقق من متغيرات البيئة
  ```bash
  cat .env.local
  ```

- [ ] بناء المشروع
  ```bash
  npm run build
  ```

---

## 🧪 اختبارات وحدة

- [ ] Backend Unit Tests
  ```bash
  php artisan test
  ```

- [ ] Frontend Unit Tests
  ```bash
  npm run test
  ```

- [ ] Python Tests
  ```bash
  python test_client.py
  ```

---

## 🔗 اختبارات التكامل

### التحقق من الاتصال

- [ ] اختبر اتصال Frontend ← Backend
  ```bash
  curl -X GET http://localhost:8000/api/cameras
  ```

- [ ] اختبر اتصال Backend ← Python
  ```bash
  curl -X GET http://localhost:5000/api/health
  ```

- [ ] اختبر الـ CORS
  ```bash
  # من Frontend
  fetch('http://localhost:8000/api/cameras')
  ```

### اختبارات Endpoint

- [ ] GET /api/cameras
  - [ ] يجب أن ترجع قائمة الكاميرات

- [ ] POST /api/cameras
  - [ ] يجب حفظ الكاميرا الجديدة

- [ ] GET /api/persons
  - [ ] يجب أن ترجع قائمة الأشخاص

- [ ] POST /api/alerts/{id}/acknowledge
  - [ ] يجب تأكيد التنبيه

### اختبارات الخدمة الذكية

- [ ] /api/health
  - [ ] يجب أن ترجع status: healthy

- [ ] /api/statistics
  - [ ] يجب أن ترجع إحصائيات النظام

- [ ] /api/recognize
  - [ ] يجب أن تتعرف على الوجوه

---

## 📋 قائمة تفعيل الإنتاج

### قبل النشر

- [ ] تحديث جميع المتطلبات
- [ ] فحص السجلات (logs)
- [ ] تفعيل HTTPS
- [ ] إعداد نسخ احتياطية لقاعدة البيانات
- [ ] تكوين البريد الإلكتروني (للإشعارات)
- [ ] تفعيل Rate Limiting
- [ ] إعداد Monitoring و Alerts

### أثناء النشر

- [ ] نسخ احتياطية من قاعدة البيانات
- [ ] تشغيل Migrations
- [ ] إعادة تشغيل الخدمات
- [ ] فحص الأداء

### بعد النشر

- [ ] اختبار شامل
- [ ] مراقبة السجلات
- [ ] فحص الاستجابة
- [ ] الاستعداد للتراجع

---

## 🎯 معايير الأداء

- [ ] وقت استجابة الخادم < 500ms
- [ ] وقت كشف الوجه < 2 ثانية
- [ ] معدل توفر الخدمة > 99%
- [ ] استهلاك الذاكرة < 1GB

---

## 📞 معلومات التوصل للدعم

عند حدوث مشاكل:

1. تحقق من السجلات (Logs)
2. اختبر الاتصال بين الخدمات
3. راجع الوثائق
4. اتصل بفريق الدعم

---

## ✅ علامات النجاح

- ✅ Frontend يحمل بنجاح
- ✅ Backend API يستجيب
- ✅ Python Service يعمل
- ✅ قاعدة البيانات تحتوي على بيانات
- ✅ التنبيهات تعمل
- ✅ الكاميرات متصلة
- ✅ التعرف على الأشخاص يعمل
- ✅ لا توجد أخطاء في السجلات
