import React, { useEffect, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface PricingPlan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  monthly_price: number;
  yearly_price: number | null;
  max_cameras: number;
  storage_gb: number;
  retention_days: number;
  max_users: number;
  has_theft_detection: boolean;
  has_advanced_scheduling: boolean;
  has_api_access: boolean;
  has_backup: boolean;
  has_advanced_reports: boolean;
  support_level: string;
}

interface PricingCardsProps {
  onSelectPlan?: (plan: PricingPlan) => void;
  billingCycle?: 'monthly' | 'yearly';
}

export const PricingCards: React.FC<PricingCardsProps> = ({
  onSelectPlan,
  billingCycle = 'monthly',
}) => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>(billingCycle);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/pricing-plans');
      const data = await response.json();
      setPlans(data.data.plans);
    } catch (error) {
      console.error('خطأ في تحميل الخطط:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (plan: PricingPlan) => {
    if (cycle === 'yearly' && plan.yearly_price) {
      return plan.yearly_price;
    }
    return plan.monthly_price;
  };

  const getSavings = (plan: PricingPlan) => {
    if (cycle === 'yearly' && plan.yearly_price) {
      const monthlyTotal = plan.monthly_price * 12;
      const savings = monthlyTotal - plan.yearly_price;
      const percent = ((savings / monthlyTotal) * 100).toFixed(0);
      return { amount: savings, percent };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* خيار الفترة الزمنية */}
      <div className="flex items-center justify-center gap-6">
        <span className={`text-lg font-medium ${cycle === 'monthly' ? 'text-gray-900' : 'text-gray-600'}`}>
          دفع شهري
        </span>
        <button
          onClick={() => setCycle(cycle === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative inline-flex h-10 w-18 items-center rounded-full transition-colors ${
            cycle === 'yearly' ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform shadow-md ${
              cycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-lg font-medium ${cycle === 'yearly' ? 'text-gray-900' : 'text-gray-600'}`}>
          دفع سنوي
        </span>
      </div>

      {/* البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => {
          const price = getPrice(plan);
          const savings = getSavings(plan);
          const isPopular = plan.name === 'Pro';

          return (
            <div
              key={plan.id}
              className={`relative rounded-lg transition-all duration-300 ${
                isPopular
                  ? 'ring-2 ring-blue-500 shadow-xl scale-105'
                  : 'border-2 border-gray-200 hover:border-blue-300 shadow-lg'
              } bg-white overflow-hidden hover:shadow-2xl`}
            >
              {isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-bold">
                  الخطة المشهورة
                </div>
              )}

              <div className={`p-8 ${isPopular ? 'pt-16' : ''}`}>
                {/* الاسم */}
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>

                {/* السعر */}
                <div className="mt-6 mb-2">
                  <span className="text-5xl font-extrabold text-gray-900">
                    ${price.toFixed(2)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{cycle === 'monthly' ? 'شهر' : 'سنة'}
                  </span>
                </div>

                {/* التوفير */}
                {savings && (
                  <p className="text-green-600 text-sm font-semibold mb-6">
                    توفير ${savings.amount.toFixed(2)} ({savings.percent}%)
                  </p>
                )}

                {/* الوصف */}
                {plan.description && (
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                )}

                {/* زر الاختيار */}
                <button
                  onClick={() => onSelectPlan?.(plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mb-8 ${
                    isPopular
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  اختيار {plan.name}
                </button>

                {/* قائمة الميزات */}
                <div className="space-y-4 border-t pt-8 border-gray-200">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{plan.max_cameras} كاميرات</p>
                      <p className="text-sm text-gray-600">عدد الكاميرات المدعومة</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{plan.storage_gb} GB تخزين</p>
                      <p className="text-sm text-gray-600">تخزين سحابي</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{plan.retention_days} يوم</p>
                      <p className="text-sm text-gray-600">الاحتفاظ بسجلات الأحداث</p>
                    </div>
                  </div>

                  {plan.has_theft_detection && (
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">كشف السرقة</p>
                        <p className="text-sm text-gray-600">اكتشاف تهديدات امنية</p>
                      </div>
                    </div>
                  )}

                  {plan.has_advanced_scheduling && (
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">جدولة متقدمة</p>
                        <p className="text-sm text-gray-600">برمجة مرنة للكاميرات</p>
                      </div>
                    </div>
                  )}

                  {plan.has_api_access && (
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">وصول API</p>
                        <p className="text-sm text-gray-600">دمج مع التطبيقات الخارجية</p>
                      </div>
                    </div>
                  )}

                  {plan.has_backup && (
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">نسخ احتياطي تلقائي</p>
                        <p className="text-sm text-gray-600">حماية البيانات</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        دعم: {plan.support_level === '24x7' ? '24/7' : plan.support_level}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ملاحظة العمل بدون اشتراك */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <p className="text-blue-900 font-semibold">
          💡 جميع الخطط تشمل: التعرف الذكي على الوجوه، كشف الحركة، لوحة تحكم كاملة، وتنبيهات فورية
        </p>
      </div>
    </div>
  );
};

export default PricingCards;
