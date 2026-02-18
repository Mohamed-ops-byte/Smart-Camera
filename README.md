# 🎥 نظام الكاميرات الذكي - Smart Camera System

نظام متكامل للكاميرات البيتية والتجارية مع الذكاء الاصطناعي للتعرف على الأشخاص والسرقة والحركة

## ✨ الميزات الرئيسية

### 👤 التعرف على الأشخاص
- التعرف التلقائي على الوجوه والأشخاص
- إضافة قاعدة بيانات بالأشخاص الموثوقين
- مقارنة فعّالة مع ثقة عالية
- دعم الوجوه المتعددة في الإطار الواحد

### 🚨 كشف السرقة
- كشف تلقائي للأشخاص غير المعروفين
- تحليل الحركة المريبة
- تنبيهات فورية عند اكتشاف تهديد
- سجل كامل للحوادث

### 📹 كشف الحركة
- كشف فعّال للحركة والنشاط
- جدولة زمنية للتفعيل والتعطيل
- إشعارات فورية
- تسجيل الفيديو عند الحركة

### ⏰ جدولة مرنة
- تحديد أوقات للتفعيل والتعطيل
- جداول مختلفة لأنواع الكشف
- جداول أسبوعية وحسب الأيام
- تفعيل/تعطيل فوري

### 📊 لوحة التحكم
- واجهة رسومية احترافية
- إحصائيات فورية
- رؤية الكاميرات المتعددة
- سجل التنبيهات والأحداث

### 🔔 نظام التنبيهات
- تنبيهات فورية في الوقت الفعلي
- درجات خطورة مختلفة (منخفض، متوسط، عالي، حرج)
- تأكيد اليدوي للتنبيهات
- سجل التنبيهات الكامل

---

## 🏗️ البنية المعمارية

```
Smart Camera System
│
├── Frontend (React + TypeScript)
│   ├── لوحة التحكم
│   ├── إدارة الكاميرات
│   ├── إدارة الأشخاص
│   ├── عرض الكشف والتنبيهات
│   └── الإعدادات
│
├── Backend (Laravel)
│   ├── API RESTful
│   ├── قاعدة البيانات
│   ├── إدارة الكاميرات
│   ├── إدارة المستخدمين والأشخاص
│   ├── معالجة التنبيهات
│   └── الجدولة
│
└── AI Service (Python)
    ├── التعرف على الوجوه
    ├── كشف الحركة
    ├── كشف السرقة
    └── معالجة الصور
```

---

## 📋 المتطلبات

### Backend Requirements
- PHP 8.2+
- Laravel 12+
- Composer
- SQLite / MySQL
- OpenCV (للخادم)

### Python Service Requirements
- Python 3.8+
- Flask 3.0+
- face-recognition 1.3+
- OpenCV 4.8+
- NumPy

### Frontend Requirements
- Node.js 18+
- React 18+
- TypeScript 5+
- Tailwind CSS

### Optional (Docker)
- Docker 20.10+
- Docker Compose 2.0+

---

## 🚀 البدء السريع

### 1️⃣ تثبيت البرامج المطلوبة

**على Windows:**
```bash
# تثبيت Composer
https://getcomposer.org/download/

# تثبيت Python
https://www.python.org/downloads/

# تثبيت Node.js
https://nodejs.org/

# تثبيت Docker (اختياري)
https://www.docker.com/products/docker-desktop
```

### 2️⃣ تشغيل المشروع

#### الطريقة أ: تشغيل محلي

**Backend:**
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

#### الطريقة ب: استخدام Docker

```bash
# من المجلد الرئيسي
docker-compose up -d

# أو باستخدام السكريبت
./start.sh          # على Linux/Mac
start.bat           # على Windows
```

### 3️⃣ الوصول إلى التطبيق

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Python Service**: http://localhost:5000/api
- **API Documentation**: http://localhost:8000/api/docs

---

## 📖 دليل الاستخدام

### إضافة كاميرا جديدة

1. اذهب إلى **إدارة الكاميرات**
2. انقر على **إضافة كاميرا**
3. أدخل تفاصيل الكاميرا:
   - الاسم
   - عنوان IP
   - المنفذ
   - رابط البث
4. انقر **حفظ**

### إضافة شخص معروف

1. اذهب إلى **إدارة الأشخاص**
2. انقر على **إضافة شخص**
3. أدخل البيانات:
   - الاسم
   - البريد الإلكتروني (اختياري)
   - الهاتف (اختياري)
4. أضف صور الوجه (2-5 صور)
5. انقر **حفظ**

### تشغيل التنبيهات

1. اذهب إلى **الإعدادات**
2. فعّل الميزات المطلوبة:
   - كشف الوجوه
   - كشف الحركة
   - كشف السرقة
3. علّم درجة الثقة والحساسية
4. انقر **حفظ**

### جدولة التفعيل

1. اذهب إلى **الجدولة**
2. أنشئ جدول جديد:
   - اختر النوع (حركة / وجه / سرقة)
   - حدد الساعات
   - فعّل الجدول
3. انقر **حفظ**

---

## 🔌 API Documentation

### Full API دليل

تم توثيق جميع API endpoints في:
- [Backend API](backend/README.md)
- [Python Service](backend/python_services/ai_service.py)

### مثال استخدام API

```bash
# الحصول على الكاميرات
curl -X GET http://localhost:8000/api/cameras

# إضافة كاميرا
curl -X POST http://localhost:8000/api/cameras \
  -H "Content-Type: application/json" \
  -d '{
    "name": "كاميرا المداخل",
    "ip_address": "192.168.1.100",
    "port": 8080,
    "stream_url": "http://192.168.1.100:8080/stream"
  }'

# الحصول على التنبيهات
curl -X GET http://localhost:8000/api/alerts

# تأكيد التنبيه
curl -X POST http://localhost:8000/api/alerts/1/acknowledge
```

---

## 🗄️ قاعدة البيانات

### الجداول الرئيسية

```sql
-- الكاميرات
CREATE TABLE cameras (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  ip_address VARCHAR(45),
  port INT,
  stream_url VARCHAR(255),
  is_active BOOLEAN,
  created_at TIMESTAMP
);

-- الأشخاص
CREATE TABLE persons (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  is_trusted BOOLEAN,
  created_at TIMESTAMP
);

-- صور الوجوه
CREATE TABLE faces (
  id INT PRIMARY KEY,
  person_id INT,
  image_path VARCHAR(255),
  face_encoding LONGTEXT,
  verified BOOLEAN,
  created_at TIMESTAMP
);

-- الاكتشافات
CREATE TABLE detections (
  id INT PRIMARY KEY,
  camera_id INT,
  person_id INT,
  detection_type ENUM('person', 'motion', 'theft'),
  confidence FLOAT,
  image_path VARCHAR(255),
  timestamp TIMESTAMP
);

-- التنبيهات
CREATE TABLE alerts (
  id INT PRIMARY KEY,
  camera_id INT,
  detection_id INT,
  alert_type ENUM('theft', 'unknown_person', 'motion'),
  severity ENUM('low', 'medium', 'high', 'critical'),
  message TEXT,
  is_acknowledged BOOLEAN,
  created_at TIMESTAMP
);

-- الجداول
CREATE TABLE schedules (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  type ENUM('motion_detection', 'face_detection', 'theft_detection'),
  start_time TIME,
  end_time TIME,
  is_active BOOLEAN,
  created_at TIMESTAMP
);
```

---

## 🔒 الأمان

- تشفير لكلمات المرور
- CORS مفعّل
- التحقق من الاستخدام (Rate Limiting)
- حماية SQL Injection
- HTTPS في الإنتاج

---

## 🐛 استكشاف الأخطاء

### المشكلة: Python Service لا يتصل

**الحل:**
```bash
# تحقق من تثبيت المتطلبات
pip install -r backend/python_services/requirements.txt

# أعد تشغيل الخدمة
python backend/python_services/ai_service.py
```

### المشكلة: قاعدة البيانات لا تعمل

**الحل:**
```bash
cd backend
php artisan migrate:fresh
php artisan migrate
```

### المشكلة: الـ Frontend لا يتصل بـ Backend

**الحل:**
```bash
# تحقق من رابط الـ API في .env
# يجب أن يكون:
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 📝 ملفات التكوين المهمة

### Backend `.env`
```env
APP_NAME="Smart Camera"
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite
FRONTEND_URL=http://localhost:5173
PYTHON_SERVICE_URL=http://localhost:5000
```

### Frontend `.env.local`
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_PYTHON_SERVICE_URL=http://localhost:5000/api
```

---

## 📊 الإحصائيات المدعومة

- عدد الكاميرات النشطة
- إجمالي الاكتشافات
- الاكتشافات حسب النوع
- الاكتشافات حسب الشخص
- التنبيهات المؤكدة وغير المؤكدة
- معدل كشف الوجوه
- الأشخاص المعروفون

---

## 🎨 الواجهات المتاحة

### Dashboard (لوحة التحكم)
- عرض ملخص الأحداث
- إحصائيات فورية
- عرض الكاميرات المحددة
- آخر التنبيهات

### Camera Viewer (عرض الكاميرات)
- بث مباشر من الكاميرات
- عرض متعدد للكاميرات
- تسجيل الفيديو

### Alerts Panel (لوحة التنبيهات)
- قائمة التنبيهات
- تصفية حسب النوع والخطورة
- تأكيد التنبيهات يدويا

### Settings (الإعدادات)
- إدارة الكاميرات
- إدارة الأشخاص
- تإعدادات الكشف
- الجدولة

---

## 📞 الدعم والمساعدة

- اقرأ [GETTING_STARTED.md](GETTING_STARTED.md) للبدء السريع
- اقرأ [backend/README.md](backend/README.md) للتفاصيل الفنية
- تحقق من السجلات في `backend/storage/logs/`

---

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License

---

## 👨‍💻 المساهمة

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء branch جديد
3. إضافة تحسيناتك
4. عمل Pull Request

---

## 🎉 شكراً لاستخدامك النظام!

للمزيد من الميزات والتحديثات، تابع المشروع.

**آخر تحديث:** فبراير 2026
