# 📐 البنية المعمارية كاملة للنظام

## نظرة عامة

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React)                            │
│  5173   Dashboard | Cameras | Persons | Alerts | Settings      │
└─────────────────────────────────────┬───────────────────────────┘
                                      │
                    ┌─────────────────┴──────────────────┐
                    │                                    │
            ┌───────▼────────┐               ┌──────────▼────────┐
            │  Backend API   │               │ Python Service   │
            │  (Laravel)     │               │  (Flask)         │
            │  Port: 8000    │               │  Port: 5000      │
            └────────────────┘               └──────────────────┘
                    │                                    │
                    │        ┌───────────────────────┐  │
                    └────────│   SQLite Database     │──┘
                             │   database.sqlite     │
                             └───────────────────────┘
```

---

## 📁 هيكل الملفات

```
Smart Camera/
│
├── frontend/                          # تطبيق React
│   ├── src/
│   │   ├── components/               # مكونات React
│   │   ├── pages/                    # الصفحات
│   │   ├── services/
│   │   │   └── api.ts               # خدمة API
│   │   ├── store/
│   │   │   └── dashboardStore.ts    # متجر الحالة
│   │   ├── types/                   # تعريفات TypeScript
│   │   ├── utils/                   # دوال مساعدة
│   │   └── styles/                  # الأنماط
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                           # تطبيق Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/API/     # API Controllers
│   │   │   └── Middleware/
│   │   ├── Models/                  # Eloquent Models
│   │   ├── Services/                # Business Logic
│   │   └── Bootstrap.php
│   │
│   ├── database/
│   │   ├── migrations/              # جداول قاعدة البيانات
│   │   └── seeders/                 # بيانات تجريبية
│   │
│   ├── routes/
│   │   └── api.php                  # مسارات API
│   │
│   ├── config/
│   │   └── smart_camera.php         # الإعدادات
│   │
│   ├── python_services/             # خدمات Python AI
│   │   ├── ai_service.py            # الخدمة الرئيسية
│   │   ├── config.py                # إعدادات Python
│   │   ├── requirements.txt         # المتطلبات
│   │   ├── test_client.py          # اختبارات
│   │   └── Dockerfile
│   │
│   ├── storage/
│   │   ├── app/
│   │   │   └── faces/              # صور الوجوه
│   │   └── logs/                   # السجلات
│   │
│   ├── .env.example
│   ├── composer.json
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml               # تكوين Docker
├── README.md                        # وثائق المشروع
├── GETTING_STARTED.md               # البدء السريع
├── start.sh                         # سكريبت البدء
└── start.bat                        # سكريبت البدء (Windows)
```

---

## 🔄 تدفق البيانات

### 1. إضافة كاميرا جديدة

```
Frontend               Backend                   Database
   │                    │                          │
   ├─ POST /cameras ──────────────────────────────│
   │                    │ Store Camera             │
   │                    ├─ Validate ──────────────│
   │                    ├─ Save ──────────────────┤
   │                    │                    ✓ Saved
   │◄──────── Response ◄─┤
   │ (Camera ID)         │
```

### 2. التعرف على الوجوه والكشف

```
Camera Stream      Backend              Python Service      Database
   │               │                          │                 │
   ├─ Stream ─────────────────────────────────│
   │               ├─ Receive Frame           │
   │               ├─ POST /recognize ────────┤
   │               │                          │
   │               │                   Processing Face
   │               │                   Encoding vs DB
   │               │
   │               │◄─── Results (Person ID / Unknown)
   │               │
   │               ├─ Create Detection ──────────────┤
   │               │                             Save ✓
   │               │
   │               ├─ Create Alert (if needed) ─────│
   │               │                             Save ✓
   │               │
   │◄────── Notify (Push/WebSocket)
   │ New Alert!
```

### 3. عملية الإشعارات

```
Detection Event    Backend                Frontend
       │           │                        │
       ├─ Alert Created                    │
       │           │                        │
       │           ├─ WebSocket Event ─────┤
       │           │                   ✓ Received
       │           │                        │
       │           │                   ├─ Show Toast
       │           │                   ├─ Update List
       │           │                   └─ Sound/Notification
```

---

## 🔌 نقاط التكامل الرئيسية

### Frontend ↔ Backend

**Base URL**: `http://localhost:8000/api`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {token} (اختياري حالياً)
```

**Response Format**:
```json
{
  "success": true,
  "data": { ... },
  "message": "رسالة النجاح"
}
```

### Backend ↔ Python Service

**Base URL**: `http://localhost:5000/api`

**Request Format**:
```json
{
  "image_path": "path/to/image.jpg",
  "camera_id": 1
}
```

**Response Format**:
```json
{
  "success": true,
  "faces": [...],
  "confidence": 0.95
}
```

---

## 🗄️ نموذج قاعدة البيانات

### العلاقات

```
Cameras (1) ──────── (M) Detections
   │                      │
   │                      └── Person (M)
   │
   └───── Alerts

Persons (1) ──────── (M) Faces
   │
   └────── Detections

Schedules ──────────── Settings
```

### أمثلة SQL

```sql
-- الكاميرات النشطة
SELECT * FROM cameras WHERE is_active = true;

-- الاكتشافات الأخيرة
SELECT * FROM detections 
ORDER BY timestamp DESC 
LIMIT 20;

-- التنبيهات غير المؤكدة
SELECT * FROM alerts 
WHERE is_acknowledged = false 
ORDER BY created_at DESC;

-- متوسط ثقة التعرف
SELECT AVG(confidence) FROM detections
WHERE detection_type = 'person';
```

---

## 🔐 الأمان والحماية

### التشفير
- كلمات المرور مشفرة هاش (bcrypt)
- JWT للـ API (في الإصدارات المستقبلية)

### CORS
```php
// مسموح من Frontend فقط
ALLOWED_ORIGINS = ['http://localhost:5173']
```

### Rate Limiting
- 60 طلب/دقيقة لكل IP

### Validation
```php
// validation تلقائي في Controllers
'name' => 'required|string|max:255'
'email' => 'email|unique:persons'
'confidence' => 'numeric|between:0,1'
```

---

## 📊 Logging و Monitoring

### Backend Logs
```
backend/storage/logs/laravel-YYYY-MM-DD.log
```

### Python Service Logs
```
عبر stdout/stderr
```

### مثال Log Entry
```
[2026-02-17 14:30:15] local.INFO: Camera #1 detected person #3 with confidence 0.95
[2026-02-17 14:30:16] local.WARNING: Unknown person detected on Camera #2
[2026-02-17 14:30:17] local.ERROR: Failed to connect to Python service
```

---

## ⚙️ الأداء والتحسينات

### Database Indexing
```sql
CREATE INDEX idx_detection_timestamp 
ON detections(timestamp);

CREATE INDEX idx_alert_created_at 
ON alerts(created_at);

CREATE INDEX idx_camera_id 
ON detections(camera_id);
```

### Caching
```php
// Redis في المستقبل
Cache::remember('cameras', 60, function() {
    return Camera::all();
});
```

### Pagination
```
GET /api/detections?page=1&per_page=20
```

---

## 🚀 Deployment

### على الخادم

```bash
# باستخدام Docker
docker-compose -f docker-compose.prod.yml up -d

# أو يدويا:
# 1. تثبيت المتطلبات
# 2. تشغيل Migrations
# 3. تعيين Permissions
# 4. تشغيل خدمة Python
# 5. استخدام Nginx/Apache reversed proxy
```

---

## 📱 API Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "كاميرا المداخل",
    "ip_address": "192.168.1.100"
  },
  "message": "تم جلب البيانات بنجاح"
}
```

### Error Response
```json
{
  "success": false,
  "error": "رسالة الخطأ",
  "message": "فشل في عملية معينة"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "data": [...],
    "current_page": 1,
    "total": 100,
    "per_page": 20
  }
}
```

---

## 🔗 روابط الوثائق

- [Backend README](backend/README.md) - وثائق Backend
- [Frontend Services](frontend/src/services/) - خدمات Frontend
- [Usage Examples](backend/USAGE_EXAMPLES.md) - أمثلة العملية
- [Getting Started](GETTING_STARTED.md) - البدء السريع
