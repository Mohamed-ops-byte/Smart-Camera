# دليل البدء السريع

## 🚀 خطوات التشغيل

### الطريقة 1: تشغيل محلي

#### تثبيت المتطلبات:

**Backend Laravel:**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

**Python Service:**
```bash
cd backend/python_services
pip install -r requirements.txt
python ai_service.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

### الطريقة 2: استخدام Docker

```bash
# تشغيل جميع الخدمات
docker-compose up -d

# إيقاف الخدمات
docker-compose down
```

---

## 📋 المتطلبات

### Backend:
- PHP 8.2+
- Laravel 12+
- Composer
- SQLite (أو MySQL)

### Python Service:
- Python 3.8+
- Flask 3.0+
- face-recognition 1.3+
- OpenCV 4.8+

### Frontend:
- Node.js 18+
- React 18+
- TypeScript
- Tailwind CSS

---

## 🔌 API Endpoints

### Cameras
```
GET    /api/cameras              - الحصول على الكاميرات
POST   /api/cameras              - إضافة كاميرا
GET    /api/cameras/{id}         - تفاصيل الكاميرا
PUT    /api/cameras/{id}         - تحديث الكاميرا
DELETE /api/cameras/{id}         - حذف الكاميرا
```

### Persons
```
GET    /api/persons              - قائمة الأشخاص
POST   /api/persons              - إضافة شخص
GET    /api/persons/{id}         - تفاصيل الشخص
PUT    /api/persons/{id}         - تحديث الشخص
DELETE /api/persons/{id}         - حذف الشخص
POST   /api/persons/{id}/faces   - إضافة صورة وجه
```

### Detections
```
GET    /api/detections           - قائمة الاكتشافات
POST   /api/detections           - تسجيل اكتشاف
GET    /api/detections/{id}      - تفاصيل الاكتشاف
GET    /api/detections/statistics - إحصائيات
```

### Alerts
```
GET    /api/alerts               - قائمة التنبيهات
POST   /api/alerts               - إنشاء تنبيه
POST   /api/alerts/{id}/acknowledge - تأكيد التنبيه
GET    /api/alerts/unacknowledged    - التنبيهات غير المؤكدة
DELETE /api/alerts/{id}          - حذف التنبيه
```

### Settings
```
GET    /api/settings             - الإعدادات
PUT    /api/settings             - تحديث الإعدادات
POST   /api/settings/reset       - إعادة تعيين
```

### Schedules
```
GET    /api/schedules            - الجداول
POST   /api/schedules            - إنشاء جدول
GET    /api/schedules/{id}       - تفاصيل الجدول
PUT    /api/schedules/{id}       - تحديث الجدول
DELETE /api/schedules/{id}       - حذف الجدول
GET    /api/schedules/active     - الجداول النشطة
```

---

## 🤖 Python AI Service Endpoints

```
GET    /api/health               - فحص الخدمة
GET    /api/statistics           - إحصائيات
POST   /api/recognize            - التعرف على الوجوه
POST   /api/motion-detect        - كشف الحركة
POST   /api/theft-detect         - كشف السرقة
POST   /api/add-person           - إضافة شخص
```

---

## 📝 ملفات التكوين

### Backend .env
```
APP_NAME="Smart Camera"
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite

FRONTEND_URL=http://localhost:5173
PYTHON_SERVICE_URL=http://localhost:5000
```

### Frontend .env
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_PYTHON_SERVICE_URL=http://localhost:5000/api
```

---

## 🔍 الميزات الرئيسية

✅ **التعرف على الأشخاص** - استخدام face-recognition
✅ **كشف الحركة** - كشف الحركة المريبة في الفيديو
✅ **كشف السرقة** - كشف السرقة المحتملة
✅ **الجدولة** - تحديد الأوقات للتفعيل
✅ **التنبيهات** - نظام تنبيهات فوري
✅ **قاعدة البيانات** - تخزين البيانات والإحصائيات

---

## 📞 الدعم

للمزيد من المساعدة، راجع:
- Backend: `backend/README.md`
- API Documentation: في الملفات المرفقة
