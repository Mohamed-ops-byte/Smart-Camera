import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface PricingPlan {
  id: number;
  name: string;
  slug: string;
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

interface PricingTableProps {
  onSelectPlan?: (plan: PricingPlan) => void;
  billingCycle?: 'monthly' | 'yearly';
}

export const PricingTable: React.FC<PricingTableProps> = ({
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

  const getDisplayPrice = (plan: PricingPlan) => {
    if (cycle === 'yearly' && plan.yearly_price) {
      return `$${plan.yearly_price.toFixed(2)}/سنة`;
    }
    return `$${plan.monthly_price.toFixed(2)}/شهر`;
  };

  const features = [
    { key: 'max_cameras', label: 'عدد الكاميرات' },
    { key: 'storage_gb', label: 'التخزين السحابي' },
    { key: 'retention_days', label: 'مدة الاحتفاظ بالسجلات' },
    { key: 'max_users', label: 'عدد المستخدمين' },
    { key: 'has_theft_detection', label: 'كشف السرقة' },
    { key: 'has_advanced_scheduling', label: 'جدولة متقدمة' },
    { key: 'has_api_access', label: 'وصول API' },
    { key: 'has_backup', label: 'نسخ احتياطي تلقائي' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* خيار الفترة الزمنية */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${cycle === 'monthly' ? 'text-gray-900' : 'text-gray-600'}`}>
          شهري
        </span>
        <button
          onClick={() => setCycle(cycle === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            cycle === 'yearly' ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              cycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${cycle === 'yearly' ? 'text-gray-900' : 'text-gray-600'}`}>
          سنوي
          {cycle === 'yearly' && (
            <span className="ml-2 inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
              توفير 15-20%
            </span>
          )}
        </span>
      </div>

      {/* جدول المقارنة */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-right py-4 px-4 font-semibold text-gray-900 w-32">الميزة</th>
              {plans.map((plan) => (
                <th key={plan.id} className="text-center py-4 px-4">
                  <div className="font-bold text-gray-900">{plan.name}</div>
                  <div className="text-lg font-bold text-blue-600 mt-2">
                    {getDisplayPrice(plan)}
                  </div>
                  <button
                    onClick={() => onSelectPlan?.(plan)}
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-semibold"
                  >
                    اختيار الخطة
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.key} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-700 text-right">
                  {feature.label}
                </td>
                {plans.map((plan) => {
                  const value = (plan as any)[feature.key];
                  const isBoolean = typeof value === 'boolean';

                  return (
                    <td key={`${plan.id}-${feature.key}`} className="text-center py-4 px-4">
                      {isBoolean ? (
                        value ? (
                          <CheckCircle className="inline w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="inline w-5 h-5 text-gray-300" />
                        )
                      ) : (
                        <span className="font-medium text-gray-900">
                          {feature.key === 'storage_gb' ? `${value} GB` : value}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingTable;
