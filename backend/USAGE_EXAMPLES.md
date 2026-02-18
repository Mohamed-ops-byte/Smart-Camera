/**
 * مثال على استخدام API Client في Frontend
 * Example Frontend Usage
 */

import ApiService from '@/services/api';

// مثال 1: جلب الكاميرات وعرضها
export async function loadAllCameras() {
  try {
    const cameras = await ApiService.getCameras();
    console.log('الكاميرات:', cameras);
    return cameras;
  } catch (error) {
    console.error('خطأ في جلب الكاميرات:', error);
  }
}

// مثال 2: إضافة كاميرا جديدة
export async function addNewCamera() {
  try {
    const newCamera = await ApiService.createCamera({
      name: 'كاميرا جديدة',
      ip_address: '192.168.1.50',
      port: 8080,
      stream_url: 'http://192.168.1.50:8080/stream',
      location: 'الموقع الجديد'
    });
    console.log('تم إضافة الكاميرا:', newCamera);
    return newCamera;
  } catch (error) {
    console.error('خطأ في إضافة الكاميرا:', error);
  }
}

// مثال 3: إضافة شخص جديد
export async function addNewPerson() {
  try {
    const newPerson = await ApiService.createPerson({
      name: 'محمد علي',
      email: 'mohammed@example.com',
      phone: '0501234567',
      is_trusted: true,
      notes: 'صديق العائلة'
    });
    console.log('تم إضافة الشخص:', newPerson);
    return newPerson;
  } catch (error) {
    console.error('خطأ في إضافة الشخص:', error);
  }
}

// مثال 4: إضافة صورة وجه
export async function addFaceImage(personId: number, imageFile: File) {
  try {
    const result = await ApiService.addFaceImage(personId, imageFile);
    console.log('تم إضافة صورة الوجه:', result);
    return result;
  } catch (error) {
    console.error('خطأ في إضافة صورة الوجه:', error);
  }
}

// مثال 5: جلب التنبيهات
export async function getAlerts() {
  try {
    const alerts = await ApiService.getAlerts({
      severity: 'high'
    });
    console.log('التنبيهات:', alerts);
    return alerts;
  } catch (error) {
    console.error('خطأ في جلب التنبيهات:', error);
  }
}

// مثال 6: تأكيد التنبيه
export async function acknowledgeAlert(alertId: number) {
  try {
    const confirmed = await ApiService.acknowledgeAlert(alertId);
    console.log('تم تأكيد التنبيه:', confirmed);
    return confirmed;
  } catch (error) {
    console.error('خطأ في تأكيد التنبيه:', error);
  }
}

// مثال 7: جلب الاكتشافات
export async function getDetections() {
  try {
    const detections = await ApiService.getDetections({
      camera_id: 1,
      type: 'person'
    });
    console.log('الاكتشافات:', detections);
    return detections;
  } catch (error) {
    console.error('خطأ في جلب الاكتشافات:', error);
  }
}

// مثال 8: إنشاء جدول جديد
export async function createSchedule() {
  try {
    const schedule = await ApiService.createSchedule({
      name: 'جدول الليل',
      type: 'motion_detection',
      start_time: '22:00',
      end_time: '06:00',
      is_active: true,
      settings: { sensitivity: 0.7 }
    });
    console.log('تم إنشاء الجدول:', schedule);
    return schedule;
  } catch (error) {
    console.error('خطأ في إنشاء الجدول:', error);
  }
}

// مثال 9: تحديث الإعدادات
export async function updateSettings() {
  try {
    await ApiService.updateSettings({
      face_detection_enabled: true,
      face_recognition_threshold: 0.65,
      motion_detection_enabled: true,
      theft_detection_enabled: true
    });
    console.log('تم تحديث الإعدادات');
  } catch (error) {
    console.error('خطأ في تحديث الإعدادات:', error);
  }
}

// مثال 10: استخدام الخدمة في Component React
export function ExampleComponent() {
  const [cameras, setCameras] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadAllCameras().then((data) => {
      setCameras(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div>
      <h1>الكاميرات ({cameras.length})</h1>
      <ul>
        {cameras.map((camera: any) => (
          <li key={camera.id}>{camera.name}</li>
        ))}
      </ul>
    </div>
  );
}
