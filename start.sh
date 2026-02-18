#!/bin/bash

# سكريبت بدء التطبيق

echo "🚀 جاري بدء نظام الكاميرات الذكية..."

# التحقق من وجود Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker غير مثبت. يرجى تثبيت Docker أولاً"
    exit 1
fi

# بدء الخدمات
echo "📦 جاري تشغيل الخدمات..."
docker-compose up -d

# انتظر لحظة للخدمات
sleep 10

# فحص الخدمات
echo "✅ جاري فحص الخدمات..."

# فحص Backend
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Backend: يعمل على http://localhost:8000"
else
    echo "❌ Backend: غير متوفر"
fi

# فحص Python Service
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Python Service: يعمل على http://localhost:5000"
else
    echo "❌ Python Service: غير متوفر"
fi

# فحص Frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend: يعمل على http://localhost:5173"
else
    echo "❌ Frontend: غير متوفر (قد تحتاج لتشغيل npm run dev في مجلد frontend)"
fi

echo ""
echo "🎉 تم البدء! الروابط المتاحة:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000/api"
echo "   Python Service: http://localhost:5000/api"
