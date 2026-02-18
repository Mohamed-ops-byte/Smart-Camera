import React, { useState } from 'react';
import { DashboardOverview, Header, Sidebar } from '@components/index';
import { mockCameras, mockAlerts, mockDetections } from '@utils/mockData';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // استخدام البيانات الوهمية بدلاً من الـ API
  const [cameras] = useState(mockCameras);
  const [alerts] = useState(mockAlerts);
  const [detections] = useState(mockDetections);
  const [isLoading] = useState(false);

  const [activeSection, setActiveSection] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'لوحة المراقبة', href: '#', icon: '📊' },
    { id: 'cameras', label: 'الكاميرات', href: '#', icon: '📷', badge: cameras.length },
    { id: 'detections', label: 'الكشفيات', href: '#', icon: '📸', badge: detections.length },
    { id: 'alerts', label: 'التنبيهات', href: '#', icon: '🔔', badge: alerts.filter((a) => !a.acknowledged).length },
    { id: 'persons', label: 'الأشخاص', href: '#', icon: '👥' },
    { id: 'recordings', label: 'التسجيلات', href: '#', icon: '🎬' },
  ];

  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        items={navItems}
        activeItem={activeSection}
        onItemClick={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSettingsClick={() => setActiveSection('settings')}
        onLogoutClick={() => alert('تسجيل الخروج')}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <Header
          title={navItems.find((n) => n.id === activeSection)?.label || 'لوحة المراقبة'}
          unreadAlerts={unreadAlerts}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeSection === 'overview' && (
            <DashboardOverview
              cameras={cameras}
              alerts={alerts}
              detections={detections}
              isLoading={isLoading}
              onNavigateToSection={setActiveSection}
            />
          )}

          {activeSection === 'cameras' && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">📷 صفحة الكاميرات قرب الانتهاء</p>
            </div>
          )}

          {activeSection === 'detections' && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">📸 صفحة الكشفيات قرب الانتهاء</p>
            </div>
          )}

          {activeSection === 'alerts' && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">🔔 صفحة التنبيهات قرب الانتهاء</p>
            </div>
          )}

          {activeSection === 'persons' && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">👥 صفحة الأشخاص قرب الانتهاء</p>
            </div>
          )}

          {activeSection === 'recordings' && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">🎬 صفحة التسجيلات قرب الانتهاء</p>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">⚙️ الإعدادات</h2>
                
                {/* System Settings */}
                <div className="border-b border-gray-200 dark:border-dark-700 pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">إعدادات النظام</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-gray-700 dark:text-gray-300">تفعيل إشعارات البريد الإلكتروني</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-gray-700 dark:text-gray-300">حفظ التسجيلات تلقائياً</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-gray-700 dark:text-gray-300">وضع الوضع الآمن</span>
                    </label>
                  </div>
                </div>
                
                {/* Privacy Settings */}
                <div className="border-b border-gray-200 dark:border-dark-700 pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">إعدادات الخصوصية</h3>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-gray-700 dark:text-gray-300 mb-2 block text-sm">مدة الاحتفاظ بالتسجيلات</span>
                      <select className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white">
                        <option>7 أيام</option>
                        <option selected>30 يوماً</option>
                        <option>90 يوماً</option>
                        <option>سنة واحدة</option>
                      </select>
                    </label>
                  </div>
                </div>
                
                {/* Danger Zone */}
                <div className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">منطقة الخطورة</h3>
                  <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    حذف جميع البيانات
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
