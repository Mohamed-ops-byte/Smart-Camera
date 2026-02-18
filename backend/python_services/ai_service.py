"""
نظام الكاميرات الذكي - خدمة الذكاء الاصطناعي
AI Service for Smart Camera System
"""

import os
import sys
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import logging

# إعداد المكتبات
try:
    import face_recognition
except ImportError:
    print("تثبيت face_recognition...")
    os.system('pip install face-recognition')
    import face_recognition

app = Flask(__name__)
CORS(app)

# إعداد السجلات
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# مسارات
FACES_ENCODING_PATH = 'models/faces_encodings.pkl'
MODEL_PATH = 'models/'

# متغيرات عامة
known_face_encodings = []
known_face_names = []
face_confidence_threshold = 0.6

def load_known_faces():
    """تحميل ترميزات الوجوه المعروفة من الملف"""
    global known_face_encodings, known_face_names
    try:
        if os.path.exists(FACES_ENCODING_PATH):
            with open(FACES_ENCODING_PATH, 'rb') as f:
                data = pickle.load(f)
                known_face_encodings = data['encodings']
                known_face_names = data['names']
                logger.info(f"تم تحميل {len(known_face_encodings)} ترميز وجه")
    except Exception as e:
        logger.error(f"خطأ في تحميل الوجوه: {e}")

def save_known_faces():
    """حفظ ترميزات الوجوه المعروفة"""
    try:
        os.makedirs(MODEL_PATH, exist_ok=True)
        with open(FACES_ENCODING_PATH, 'wb') as f:
            pickle.dump({
                'encodings': known_face_encodings,
                'names': known_face_names
            }, f)
    except Exception as e:
        logger.error(f"خطأ في حفظ الوجوه: {e}")

@app.route('/api/health', methods=['GET'])
def health():
    """فحص صحة الخدمة"""
    return jsonify({'status': 'healthy', 'service': 'AI Service'}), 200

@app.route('/api/recognize', methods=['POST'])
def recognize_faces():
    """
    التعرف على الوجوه في الصورة
    """
    try:
        data = request.json
        image_path = data.get('image_path')
        camera_id = data.get('camera_id')

        if not os.path.exists(image_path):
            return jsonify({'success': False, 'error': 'صورة غير موجودة'}), 400

        # تحميل الصورة
        image = cv2.imread(image_path)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # اكتشاف الوجوه
        face_locations = face_recognition.face_locations(rgb_image)
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

        faces = []
        for face_encoding, face_location in zip(face_encodings, face_locations):
            # مقارنة مع الوجوه المعروفة
            matches = face_recognition.compare_faces(
                known_face_encodings,
                face_encoding,
                tolerance=1 - face_confidence_threshold
            )
            name = "Unknown"
            confidence = 0
            person_id = None

            face_distances = face_recognition.face_distance(
                known_face_encodings,
                face_encoding
            )

            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]
                    confidence = 1 - face_distances[best_match_index]
                    # استخراج person_id من الاسم (person_[id])
                    if name.startswith('person_'):
                        person_id = int(name.split('_')[1])

            faces.append({
                'name': name,
                'confidence': float(confidence),
                'person_id': person_id,
                'location': list(face_location)
            })

        return jsonify({
            'success': True,
            'camera_id': camera_id,
            'faces_count': len(faces),
            'faces': faces
        }), 200

    except Exception as e:
        logger.error(f"خطأ في التعرف على الوجوه: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/motion-detect', methods=['POST'])
def detect_motion():
    """
    كشف الحركة في الصورة
    """
    try:
        data = request.json
        image_path = data.get('image_path')

        if not os.path.exists(image_path):
            return jsonify({'detected': False, 'error': 'صورة غير موجودة'}), 400

        # في التطبيق الفعلي، سيتم مقارنة الإطار مع الإطار السابق
        # هنا نستخدم طريقة بسيطة للكشف عن الحركة
        image = cv2.imread(image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # حساب التباين كمؤشر على الحركة
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        variance = laplacian.var()

        # إذا كان التباين عالياً، يشير إلى حركة
        motion_detected = variance > 100

        return jsonify({
            'detected': motion_detected,
            'variance': float(variance),
            'threshold': 100
        }), 200

    except Exception as e:
        logger.error(f"خطأ في كشف الحركة: {e}")
        return jsonify({'detected': False, 'error': str(e)}), 500

@app.route('/api/theft-detect', methods=['POST'])
def detect_theft():
    """
    كشف السرقة (بناءً على الأشخاص غير المعروفين والحركة المريبة)
    """
    try:
        data = request.json
        image_path = data.get('image_path')

        if not os.path.exists(image_path):
            return jsonify({'detected': False, 'error': 'صورة غير موجودة'}), 400

        # تحميل الصورة
        image = cv2.imread(image_path)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # اكتشاف الوجوه
        face_locations = face_recognition.face_locations(rgb_image)
        face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

        unknown_faces = 0
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(
                known_face_encodings,
                face_encoding,
                tolerance=1 - face_confidence_threshold
            )

            if not any(matches):
                unknown_faces += 1

        # إذا كان هناك أشخاص غير معروفين مع حركة مريبة
        theft_detected = unknown_faces > 0

        return jsonify({
            'detected': theft_detected,
            'unknown_faces': unknown_faces,
            'risk_level': 'high' if theft_detected else 'low'
        }), 200

    except Exception as e:
        logger.error(f"خطأ في كشف السرقة: {e}")
        return jsonify({'detected': False, 'error': str(e)}), 500

@app.route('/api/add-person', methods=['POST'])
def add_person():
    """
    إضافة شخص جديد مع صور الوجه
    """
    try:
        person_id = request.form.get('person_id')
        person_name = request.form.get('person_name', f'person_{person_id}')

        if 'images' not in request.files:
            return jsonify({'success': False, 'error': 'لا توجد صور'}), 400

        files = request.files.getlist('images')
        encodings = []

        for file in files:
            if file and file.filename.endswith(('.jpg', '.jpeg', '.png')):
                # حفظ مؤقتاً
                temp_path = f'temp_{file.filename}'
                file.save(temp_path)

                try:
                    image = cv2.imread(temp_path)
                    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

                    face_locations = face_recognition.face_locations(rgb_image)
                    face_encodings = face_recognition.face_encodings(rgb_image, face_locations)

                    if face_encodings:
                        encodings.append(face_encodings[0])
                finally:
                    os.remove(temp_path)

        if encodings:
            # حساب متوسط الترميزات
            avg_encoding = np.mean(encodings, axis=0)
            known_face_encodings.append(avg_encoding)
            known_face_names.append(person_name)
            save_known_faces()

            return jsonify({
                'success': True,
                'message': f'تمت إضافة {person_name} بنجاح',
                'encodings_count': len(encodings)
            }), 201

        return jsonify({
            'success': False,
            'error': 'لم يتم اكتشاف وجوه في الصور'
        }), 400

    except Exception as e:
        logger.error(f"خطأ في إضافة شخص: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def statistics():
    """إحصائيات النظام"""
    return jsonify({
        'known_persons': len(set(known_face_names)),
        'total_encodings': len(known_face_encodings),
        'face_threshold': face_confidence_threshold
    }), 200

if __name__ == '__main__':
    # تحميل الوجوه المعروفة
    load_known_faces()
    
    # تشغيل التطبيق
    app.run(host='0.0.0.0', port=5000, debug=True)
