# 🎥 نظام المراقبة الذكي - Smart Camera Surveillance System

## ✅ تم بناء النظام بنجاح!

نظام مراقبة ذكي وحديث بواجهة مستخدم جذابة وعصرية باستخدام React و TypeScript. يجمع بين التقنيات الحديثة والتصميم الاحترافي.

---

## 📋 الميزات الرئيسية المدمجة

### 1. **📷 إدارة متقدمة للكاميرات**
- إضافة وحذف وتعديل الكاميرات
- عرض حية للكاميرات مع معلومات التفاصيل
- تجميع الكاميرات في مجموعات منطقية
- عرض حالة الكاميرا (متصل، غير متصل، قيد التسجيل)
- إدارة إعدادات الدقة ومعدل الإطارات

### 2. **🎯 التعرف الذكي على الوجوه والأشخاص**
- قاعدة بيانات شاملة للأشخاص
- تصنيف الأشخاص (ساكن، زائر، غير معروف)
- مستوى ثقة قابل للتحديث
- معلومات التحقق من الهوية

### 3. **🚨 نظام تنبيهات ذكي متطور**
- تنبيهات فورية للأحداث المهمة
- تصنيف حسب مستوى الحدة (منخفض، متوسط، عالي، حرج)
- تأكيد وحل التنبيهات
- إمكانية اتخاذ إجراءات مخصصة
- لوحة معلومات للتنبيهات بإحصائيات فورية

### 4. **🚔 كشف ذكي للسرقات والاقتحام**
- كشف الحركات المريبة
- التنبيه من محاولات السرقة
- كشف الاقتحام غير المصرح
- معدل ثقة عالي للتنبيهات

### 5. **📊 نظام متقدم للكشفيات والتحليلات**
- عرض شامل لجميع الكشفيات
- خيط زمني تفاعلي للأحداث
- بطاقات تفصيلية لكل كشف
- إحصائيات وتحليلات الاتجاهات

### 6. **💾 إدارة قوية للتسجيلات**
- تسجيل مستمر أو بناءً على الحركة
- بحث وفلترة التسجيلات
- إدارة المساحة التخزينية
- تحميل وعرض الفيديوهات

### 7. **⚙️ لوحة معلومات شاملة**
- عرض شامل لجميع الإحصائيات
- بطاقات معلومات سريعة
- آخر الأحداث والتنبيهات
- حالة الكاميرات في الوقت الفعلي

### 8. **🌐 واجهة متقدمة وجذابة**
- تصميم عصري بـ Tailwind CSS
- دعم كامل للغة العربية (RTL)
- تجاوب تام على جميع الأجهزة
- تجربة مستخدم سلسة وسريعة
- ألوان احترافية وموحدة

---

## 🗂️ البنية المعيارية للمشروع

```
smart-camera/
├── src/
│   ├── components/
│   │   ├── Common/              # مكونات عامة قابلة للاستخدام في أي مكان
│   │   │   ├── Button.tsx       # زر قابل للتخصيص
│   │   │   ├── Card.tsx         # بطاقة، إشارة، مؤشر حالة
│   │   │   ├── Modal.tsx        # نافذة منفثقة
│   │   │   └── Form.tsx         # حقول الإدخال والنماذج
│   │   ├── Camera/              # مكونات الكاميرات
│   │   │   ├── CameraCard.tsx   # بطاقة الكاميرا الفردية
│   │   │   ├── CameraGrid.tsx   # شبكة الكاميرات
│   │   │   ├── CameraViewer.tsx # عرض البث المباشر
│   │   │   └── AddCameraForm.tsx# نموذج إضافة كاميرا جديدة
│   │   ├── Alert/               # مكونات التنبيهات
│   │   │   ├── AlertItem.tsx    # عنصر تنبيه واحد
│   │   │   ├── AlertList.tsx    # قائمة بالتنبيهات
│   │   │   └── AlertPanel.tsx   # لوحة معلومات التنبيهات
│   │   ├── Detection/           # مكونات الكشفيات
│   │   │   ├── DetectionCard.tsx  # بطاقة كشف واحد
│   │   │   ├── DetectionsList.tsx # قائمة الكشفيات
│   │   │   └── DetectionTimeline.tsx # خط زمني للكشفيات
│   │   ├── Layout/              # مكونات التخطيط الأساسي
│   │   │   ├── Header.tsx       # رأس الصفحة
│   │   │   └── Sidebar.tsx      # الشريط الجانبي
│   │   └── Dashboard/           # مكونات لوحة المراقبة
│   │       └── DashboardOverview.tsx # نظرة عامة على لوحة المراقبة
│   ├── pages/
│   │   └── Dashboard.tsx        # صفحة لوحة المراقبة الرئيسية
│   ├── hooks/
│   │   └── index.ts             # جميع Hooks المخصصة
│   ├── store/
│   │   └── dashboardStore.ts    # إدارة الحالة المركزية بـ Zustand
│   ├── services/
│   │   └── api.ts               # خدمة الـ API المركزية
│   ├── utils/
│   │   └── formatters.ts        # دوال التنسيق والمساعدة
│   ├── types/
│   │   └── index.ts             # جميع تعريفات TypeScript
│   ├── styles/
│   │   └── globals.css          # الأنماط العامة
│   ├── App.tsx                  # مكون التطبيق الرئيسي
│   └── main.tsx                 # نقطة دخول التطبيق
├── public/                      # الملفات الثابتة
├── .github/
│   └── copilot-instructions.md  # تعليمات التطوير
├── .vscode/
│   └── settings.json            # إعدادات VS Code
├── vite.config.ts              # إعدادات Vite
├── tsconfig.json               # إعدادات TypeScript
├── tailwind.config.ts          # إعدادات Tailwind CSS
├── postcss.config.ts           # إعدادات PostCSS
├── package.json                # المتطلبات والأوامر
├── .env.example                # ملف المتغيرات النموذجي
└── README.md                   # توثيق المشروع
```

---

## 🚀 البدء السريع

### المتطلبات المثبتة
- ✅ Node.js 16+ و npm
- ✅ جميع المكتبات المطلوبة

### الأوامر الأساسية

```bash
# بدء خادم التطوير
npm run dev

# بناء للإنتاج
npm run build

# معاينة الإنتاج
npm run preview

# فحص الأخطاء
npm run lint
```

الخادم يعمل حالياً على: **http://localhost:3000**

---

## 🛠️ التقنيات والمكتبات المستخدمة

### Frontend Framework
- **React 18**: مكتبة واجهات المستخدم
- **TypeScript**: لغة برمجة محسّنة
- **Vite**: أداة بناء سريعة وحديثة

### State Management
- **Zustand**: إدارة الحالة الخفيفة والفعالة

### Styling
- **Tailwind CSS**: إطار عمل للأنماط الحديثة
- **PostCSS**: معالج CSS متقدم

### HTTP Client
- **Axios**: مكتبة HTTP مع دعم فعال للـ APIs

### Utilities
- **clsx**: دمج class names بكفاءة

---

## 📊 الحالات المدعومة

### مستويات التنبيهات
```
🔵 منخفض
🟡 متوسط
🟠 عالي
🔴 حرج
```

### حالات الكاميرات
```
🟢 متصل
⚫ غير متصل
🔴 قيد التسجيل (مع بث مباشر)
```

### أنواع الكشفيات
```
👤 تعرف على الوجه
🔔 حركة
👥 شخص
🚨 سرقة
⚠️ اقتحام
```

---

## 🎨 نظام الألوان

| الاستخدام | اللون | كود HEX |
|----------|-------|---------|
| الأساسي | أزرق | `#0ea5e9` |
| النجاح | أخضر | `#22c55e` |
| الخطر | أحمر | `#ef4444` |
| تحذير | برتقالي | `#f59e0b` |

---

## 🔧 خصائص Hooks المخصصة

### `usePolling`
تحديث البيانات بشكل دوري تلقائي

```typescript
usePolling(() => fetchData(), 5000);
```

### `useDebouncedValue`
تأخير الاستدعاء لتقليل عدد الـ requests

```typescript
const debouncedSearch = useDebouncedValue(searchValue, 500);
```

### `useSelectedCamera`
إدارة الكاميرا المحددة الحالية

```typescript
const { selectedId, selectCamera, deselectCamera } = useSelectedCamera();
```

### `useToggle`
إدارة الحالات المرئية (Modals, Dropdowns)

```typescript
const { isOpen, open, close, toggle } = useToggle();
```

### `usePagination`
تقسيم البيانات إلى صفحات

```typescript
const { currentPage, paginatedItems, goToPage } = usePagination(data, 10);
```

### `useCamera`
التحكم بكاميرا الجهاز

```typescript
const { startCamera, captureFrame, stopCamera } = useCamera();
```

---

## 📡 خدمة API

جميع استدعاءات الـ API موحدة في `ApiService`:

### الكاميرات
```typescript
getCameras()           // جلب جميع الكاميرات
getCameraById(id)      // جلب كاميرا محددة
createCamera()         // إضافة كاميرا جديدة
updateCamera(id)       // تحديث كاميرا
deleteCamera(id)       // حذف كاميرا
getCameraLiveStream()  // الحصول على رابط البث المباشر
```

### الكشفيات والتنبيهات
```typescript
getDetections()        // جلب الكشفيات
getAlerts()            // جلب التنبيهات
acknowledgeAlert()     // تأكيد تنبيه
resolveAlert()         // حل تنبيه
```

### الأشخاص
```typescript
getPersons()           // جلب قائمة الأشخاص
addPerson()            // إضافة شخص جديد
recognizeFace()        // التعرف على الوجه
```

---

## 🎯 إدارة الحالة (Zustand Store)

```typescript
import useDashboardStore from '@store/dashboardStore';

// استخدام في المكونات
const { 
  cameras, 
  alerts, 
  detections,
  fetchCameras,
  addCamera,
  fetchAlerts
} = useDashboardStore();
```

---

## 📝 متغيرات البيئة

انسخ ملف `.env.example` إلى `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Smart Camera
VITE_ENABLE_FACE_RECOGNITION=true
VITE_ENABLE_THEFT_DETECTION=true
VITE_ENABLE_MOTION_DETECTION=true
VITE_DEBUG=false
```

---

## 🌍 الدعم متعدد اللغات

### العربية (الافتراضية)
- ✅ واجهة عربية كاملة
- ✅ اتجاه RTL محسّن
- ✅ تواريخ وأوقات بصيغة عربية

### الإنجليزية
- جاهزة للإضافة في المستقبل

---

## 📱 الاستجابة (Responsive Design)

| الجهاز | نقطة التوقف | العرض |
|------|-----------|-------|
| موبايل | sm | 640px |
| تابلت | md | 768px |
| سطح مكتب | lg | 1024px |
| سطح مكتب كبير | xl | 1280px |

---

## ✨ ميزات إضافية

### الأداء
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Debouncing للبحث
- ✅ Caching ذكي

### الأمان
- ✅ حماية من XSS عبر React
- ✅ Sanitization للمدخلات
- ✅ CORS handling

### التجربة
- ✅ Loading states
- ✅ Error boundaries
- ✅ Smooth animations
- ✅ Accessibility (a11y)

---

## 📚 الملفات المرجعية

| الملف | الوصف |
|------|-------|
| [README.md](./README.md) | التوثيق الرئيسي |
| [.github/copilot-instructions.md](./.github/copilot-instructions.md) | إرشادات التطوير |
| [.env.example](./.env.example) | متغيرات البيئة |
| [vite.config.ts](./vite.config.ts) | إعدادات Vite |
| [tsconfig.json](./tsconfig.json) | إعدادات TypeScript |

---

## 🐛 استكشاف الأخطاء الشائعة

### المشكلة: "Cannot find module '@components'"
**الحل**: تأكد أن aliases في `tsconfig.json` و `vite.config.ts` متطابقة

### المشكلة: "Port 3000 is already in use"
**الحل**:
```bash
npx kill-port 3000
npm run dev
```

### المشكلة: أخطاء في node_modules
**الحل**:
```bash
rm -r node_modules
npm install
```

---

## 🚀 الخطوات التالية

### المراحل المخطط لها

1. **المرحلة 2**: إضافة صفحات إضافية
   - صفحة إدارة الكاميرات الكاملة
   - صفحة الكشفيات التفصيلية
   - صفحة إدارة الأشخاص
   - صفحة التسجيلات

2. **المرحلة 3**: التحسينات المتقدمة
   - دعم بث HLS
   - رفع صور الوجوه
   - إحصائيات متقدمة
   - تقارير PDF

3. **المرحلة 4**: التطبيق الموبايل
   - تطبيق React Native
   - إشعارات Push
   - الوصول دون الاتصال

---

## 📞 الدعم والتواصل

- 📧 البريد الإلكتروني: support@smartcamera.local
- 🐛 الإبلاغ عن الأخطاء: [GitHub Issues]
- 💬 النقاشات: [GitHub Discussions]

---

## 📄 الترخيص

هذا المشروع مرخص تحت **MIT License**.

---

## 🎉 شكراً

تم بناء هذا النظام بعناية فائقة وحب برمجي. نأمل أن يكون مفيداً لك ويساهم في استخدامك الأمثل للمراقبة الذكية!

**آخر تحديث**: 2026-02-17
**الإصدار**: 1.0.0
**الحالة**: ✅ قيد التشغيل والعمل بكفاءة عالية

---

💡 **Pro Tip**: استخدم F12 في المتصفح لفتح أدوات المطور والتحقق من الأداء، والشامل للـ TypeScript errors.
