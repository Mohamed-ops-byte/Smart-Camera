@echo off
REM سكريبت بدء التطبيق على Windows

echo 🚀 جاري بدء نظام الكاميرات الذكية...

REM التحقق من وجود Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker غير مثبت. يرجى تثبيت Docker أولاً
    exit /b 1
)

REM بدء الخدمات
echo 📦 جاري تشغيل الخدمات...
docker-compose up -d

REM انتظر لحظة للخدمات
timeout /t 10 /nobreak

echo ✅ جاري فحص الخدمات...

echo.
echo 🎉 تم البدء! الروابط المتاحة:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8000/api
echo    Python Service: http://localhost:5000/api
echo.
echo لإيقاف الخدمات: docker-compose down
