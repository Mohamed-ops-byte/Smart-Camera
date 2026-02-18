"""
مثال على الاستخدام والاختبار
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_health():
    """اختبار صحة الخدمة"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health Status:", response.json())

def test_statistics():
    """الحصول على الإحصائيات"""
    response = requests.get(f"{BASE_URL}/statistics")
    print("Statistics:", response.json())

def test_recognize_face():
    """اختبار التعرف على الوجوه"""
    data = {
        "image_path": "path/to/image.jpg",
        "camera_id": 1
    }
    response = requests.post(f"{BASE_URL}/recognize", json=data)
    print("Face Recognition:", response.json())

def test_motion_detection():
    """اختبار كشف الحركة"""
    data = {
        "image_path": "path/to/image.jpg"
    }
    response = requests.post(f"{BASE_URL}/motion-detect", json=data)
    print("Motion Detection:", response.json())

def test_theft_detection():
    """اختبار كشف السرقة"""
    data = {
        "image_path": "path/to/image.jpg"
    }
    response = requests.post(f"{BASE_URL}/theft-detect", json=data)
    print("Theft Detection:", response.json())

if __name__ == "__main__":
    print("=== اختبار خدمة الذكاء الاصطناعي ===\n")
    
    test_health()
    test_statistics()
    # اختبر الوظائف الأخرى حسب الحاجة
