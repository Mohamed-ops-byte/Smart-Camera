"""
ملف التكوين الرئيسي

يمكن تشغيل الخدمة باستخدام:
    python ai_service.py
    
أو باستخدام Gunicorn للإنتاج:
    gunicorn -w 4 -b 0.0.0.0:5000 ai_service:app
"""

# إعدادات الخدمة
SERVICE_HOST = '0.0.0.0'
SERVICE_PORT = 5000
DEBUG = True

# إعدادات التعرف على الوجوه
FACE_CONFIDENCE_THRESHOLD = 0.6  # 60%
MAX_FACES_PER_IMAGE = 10

# إعدادات كشف الحركة
MOTION_VARIANCE_THRESHOLD = 100

# إعدادات كشف السرقة
THEFT_RISK_FACTORS = {
    'unknown_faces': 1,
    'high_motion': 1,
    'unusual_time': 1
}

# مسارات
MODELS_PATH = 'models/'
FACES_ENCODING_FILE = 'models/faces_encodings.pkl'
TEMP_UPLOADS_PATH = 'temp_uploads/'
