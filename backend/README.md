# 🎥 Smart Camera Backend API

نظام ذكي للكاميرات مع التعرف على الأشخاص والسرقة والحركة

## 🎯 الميزات

- 👤 **التعرف على الأشخاص**: إضافة ومقارنة بيانات الوجوه
- 🚨 **كشف السرقة**: تنبيهات فورية
- 📹 **كشف الحركة**: تفعيل ذكي
- ⏰ **الجدولة**: تحديد الأوقات
- 📊 **لوحة التحكم**: إدارة كاملة

## 🚀 التثبيت

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## 📚 هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/API/
│   ├── Models/
│   ├── Services/
├── database/
│   ├── migrations/
├── routes/
├── python_services/
│   ├── ai_service.py
│   ├── face_recognition.py
│   ├── motion_detection.py
```

## 🔌 API Endpoints

### Cameras
- `GET /api/cameras`
- `POST /api/cameras`
- `PUT /api/cameras/{id}`
- `DELETE /api/cameras/{id}`

### Persons
- `GET /api/persons`
- `POST /api/persons`
- `POST /api/persons/{id}/faces`

### Alerts
- `GET /api/alerts`
- `POST /api/alerts/{id}/acknowledge`

### Settings
- `GET /api/settings`
- `PUT /api/settings`
