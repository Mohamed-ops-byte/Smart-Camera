// تنسيق الوقت والتاريخ
export const formatDate = (date: Date | string, locale = 'ar-EG'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

export const formatTime = (date: Date | string, locale = 'ar-EG'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString(locale);
};

export const formatDateTime = (date: Date | string, locale = 'ar-EG'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(locale);
};

export const formatTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals: Record<string, number> = {
    سنة: 31536000,
    شهر: 2592000,
    أسبوع: 604800,
    يوم: 86400,
    ساعة: 3600,
    دقيقة: 60,
    ثانية: 1,
  };

  for (const [key, interval] of Object.entries(intervals)) {
    const count = Math.floor(seconds / interval);
    if (count >= 1) {
      return `منذ ${count} ${key}`;
    }
  }
  return 'للتو';
};

// تنسيق أحجام الملفات
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// تنسيق مستوى التقة
export const formatConfidence = (confidence: number): string => {
  return (confidence * 100).toFixed(1) + '%';
};

// التحقق من صحة البريد الإلكتروني
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// التحقق من صحة رقم الهاتف
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?(\d{1,4})\)?[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
  return phoneRegex.test(phone);
};

// الحصول على لون بناءً على نسبة الثقة
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.9) return 'bg-green-500';
  if (confidence >= 0.7) return 'bg-yellow-500';
  if (confidence >= 0.5) return 'bg-orange-500';
  return 'bg-red-500';
};

// الحصول على لون بناءً على مستوى التنبيه
export const getAlertSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical'): string => {
  switch (severity) {
    case 'low':
      return 'bg-blue-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-orange-500';
    case 'critical':
      return 'bg-red-500';
  }
};

// الحصول على نص وصفي للنوع الكشف
export const getDetectionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    face: 'تعرف على الوجه',
    motion: 'حركة',
    person: 'شخص',
    theft: 'سرقة',
    intrusion: 'اقتحام',
  };
  return labels[type] || type;
};

// الحصول على نص وصفي لنوع التنبيه
export const getAlertTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    intrusion: 'اقتحام',
    theft: 'سرقة',
    motion: 'حركة',
    offline: 'غير متصل',
    'unknown-person': 'شخص غير معروف',
    custom: 'مخصص',
  };
  return labels[type] || type;
};

// الحصول على نص وصفي لحالة الكاميرا
export const getCameraStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    online: 'متصل',
    offline: 'غير متصل',
    recording: 'قيد التسجيل',
  };
  return labels[status] || status;
};

// توليد بيانات وهمية للاختبار
export const generateMockData = () => {
  return {
    cameras: Array.from({ length: 8 }, (_, i) => ({
      id: `cam-${i}`,
      name: `كاميرا ${i + 1}`,
      location: ['الباب الأمامي', 'غرفة المعيشة', 'المطبخ', 'الممر', 'الحديقة', 'الشرفة', 'غرفة النوم', 'السلم'][i],
      status: (['online', 'offline', 'recording'] as const)[i % 3],
      resolutionWidth: 1920,
      resolutionHeight: 1080,
      frameRate: 30,
      recordingEnabled: true,
      createdAt: new Date(),
    })),
  };
};
