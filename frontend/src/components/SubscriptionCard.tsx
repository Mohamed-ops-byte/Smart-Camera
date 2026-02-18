import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';

interface SubscriptionInfo {
  id: number;
  status: string;
  billing_cycle: string;
  current_price: number;
  current_period_end: string;
  plan: {
    id: number;
    name: string;
    max_cameras: number;
    storage_gb: number;
    max_users: number;
  };
}

interface UsageData {
  cameras: {
    current: number;
    limit: number;
    percentage: number;
  };
  storage: {
    current: number;
    limit: number;
    percentage: number;
  };
  users: {
    current: number;
    limit: number;
    percentage: number;
  };
}

interface SubscriptionCardProps {
  onUpgrade?: () => void;
  onDowngrade?: () => void;
  onCancel?: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  onUpgrade,
  onDowngrade,
  onCancel,
}) => {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscriptions/current', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setSubscription(data.data.subscription);
        setUsage(data.data.usage);
      }
    } catch (error) {
      console.error('خطأ في تحميل الاشتراك:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { color: string; label: string } } = {
      active: { color: 'bg-green-100 text-green-800', label: 'نشط' },
      canceled: { color: 'bg-red-100 text-red-800', label: 'ملغى' },
      expired: { color: 'bg-gray-100 text-gray-800', label: 'منتهى الصلاحية' },
    };

    const { color, label } = statusMap[status] || {
      color: 'bg-gray-100 text-gray-800',
      label: status,
    };

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
        {label}
      </span>
    );
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const renderUsageBar = (label: string, current: number, limit: number, unit: string = '') => {
    const percentage = (current / limit) * 100;
    const isWarning = percentage >= 80;

    return (
      <div key={label} className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-sm font-semibold ${isWarning ? 'text-red-600' : 'text-gray-600'}`}>
            {current}/{limit} {unit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor(percentage)}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-500">{percentage.toFixed(1)}% مستخدم</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">لا يوجد اشتراك نشط</h3>
            <p className="text-yellow-800 text-sm mt-1">
              اختر خطة تسعير لبدء استخدام جميع الميزات
            </p>
          </div>
        </div>
      </div>
    );
  }

  const expiryDate = new Date(subscription.current_period_end);
  const daysRemaining = Math.ceil(
    (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* معلومات الخطة */}
      <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-500">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{subscription.plan.name}</h2>
            <p className="text-gray-600 text-lg mt-2">
              ${subscription.current_price.toFixed(2)}/{subscription.billing_cycle === 'monthly' ? 'شهر' : 'سنة'}
            </p>
          </div>
          <div className="text-right">
            {getStatusBadge(subscription.status)}
            <p className="text-sm text-gray-600 mt-3">
              أيام المتبقية: <span className="font-bold">{daysRemaining}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ينجهي في: {expiryDate.toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onUpgrade}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            ترقية الخطة
          </button>
          {subscription.plan.name !== 'Free' && (
            <button
              onClick={onDowngrade}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              تنزيل الخطة
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium ml-auto"
          >
            إلغاء الاشتراك
          </button>
        </div>
      </div>

      {/* استخدام الموارد */}
      {usage && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-900">استخدام الموارد</h3>
          </div>

          <div className="space-y-6">
            {renderUsageBar(
              'الكاميرات',
              usage.cameras.current,
              usage.cameras.limit,
              'كاميرا'
            )}
            {renderUsageBar(
              'التخزين السحابي',
              usage.storage.current,
              usage.storage.limit,
              'GB'
            )}
            {renderUsageBar(
              'المستخدمين',
              usage.users.current,
              usage.users.limit,
              'مستخدم'
            )}
          </div>

          {/* تنبيهات الاستخدام الكامل */}
          {(usage.cameras.percentage >= 90 ||
            usage.storage.percentage >= 90 ||
            usage.users.percentage >= 90) && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">
                    اقتراب من الحد الأقصى
                  </p>
                  <p className="text-red-800 text-sm mt-1">
                    لديك موارد محدودة. قد تحتاج إلى ترقية خطتك أو إضافة موارد إضافية.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* الفواتير والدفعات */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">معلومات الدفع</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">السعر الشهري:</span>
            <span className="font-semibold text-gray-900">
              ${subscription.current_price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-600">دورة الدفع:</span>
            <span className="font-semibold text-gray-900">
              {subscription.billing_cycle === 'monthly' ? 'شهري' : 'سنوي'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
