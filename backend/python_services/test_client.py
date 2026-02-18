"""
اختبار شامل لخدمة الذكاء الاصطناعي
Comprehensive Test Suite for AI Service
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

class TestAIService:
    def __init__(self):
        self.session = requests.Session()
        self.base_url = BASE_URL
        
    def test_health(self):
        """اختبار صحة الخدمة"""
        print("\n📋 اختبار صحة الخدمة...")
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                print("✅ الخدمة تعمل بنجاح!")
                print(f"   Response: {response.json()}")
                return True
            else:
                print(f"❌ خطأ: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ خطأ في الاتصال: {e}")
            return False
    
    def test_statistics(self):
        """اختبار الإحصائيات"""
        print("\n📊 جاري اختبار الإحصائيات...")
        try:
            response = self.session.get(f"{self.base_url}/statistics")
            if response.status_code == 200:
                stats = response.json()
                print("✅ الإحصائيات:")
                print(f"   - الأشخاص المعروفون: {stats.get('known_persons', 0)}")
                print(f"   - عدد الترميزات: {stats.get('total_encodings', 0)}")
                print(f"   - عتبة الثقة: {stats.get('face_threshold', 0)}")
                return True
            else:
                print(f"❌ خطأ: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ خطأ: {e}")
            return False
    
    def test_motion_detection(self):
        """اختبار كشف الحركة"""
        print("\n🎬 جاري اختبار كشف الحركة...")
        try:
            # في بيئة الاختبار، ستحتاج إلى صورة حقيقية
            data = {
                "image_path": "test_image.jpg"
            }
            response = self.session.post(
                f"{self.base_url}/motion-detect",
                json=data
            )
            print(f"📌 النتيجة: {response.json()}")
            return True
        except Exception as e:
            print(f"⚠️  ملاحظة: {e}")
            return False
    
    def test_add_person(self):
        """اختبار إضافة شخص"""
        print("\n👤 جاري اختبار إضافة شخص...")
        try:
            # في بيئة الاختبار الحقيقية، ستحتاج إلى صور فعلية
            files = []  # يجب إضافة ملفات صور هنا
            data = {
                'person_id': '1',
                'person_name': 'test_person'
            }
            
            if files:
                response = self.session.post(
                    f"{self.base_url}/add-person",
                    files=files,
                    data=data
                )
                print(f"✅ النتيجة: {response.json()}")
                return True
            else:
                print("⚠️  لم تتم إضافة أي صور للاختبار")
                return False
        except Exception as e:
            print(f"⚠️  {e}")
            return False

def run_all_tests():
    """تشغيل جميع الاختبارات"""
    print("=" * 50)
    print("🧪 اختبار خدمة الذكاء الاصطناعي")
    print("=" * 50)
    
    tester = TestAIService()
    
    # تشغيل الاختبارات
    results = {
        'Health Check': tester.test_health(),
        'Statistics': tester.test_statistics(),
        'Motion Detection': tester.test_motion_detection(),
        'Add Person': tester.test_add_person()
    }
    
    # الملخص
    print("\n" + "=" * 50)
    print("📝 ملخص النتائج:")
    print("=" * 50)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test, result in results.items():
        status = "✅" if result else "⚠️"
        print(f"{status} {test}")
    
    print(f"\nالنتيجة النهائية: {passed}/{total} اختبارات نجحت")
    print("=" * 50)

if __name__ == "__main__":
    run_all_tests()
