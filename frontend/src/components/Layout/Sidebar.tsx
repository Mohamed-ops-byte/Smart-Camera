import React from 'react';
import clsx from 'clsx';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItem,
  onItemClick,
  isOpen = true,
  onClose,
  onSettingsClick,
  onLogoutClick,
}) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen w-64 bg-white dark:bg-dark-800 border-l border-gray-200 dark:border-dark-700 shadow-lg z-40 transform transition-transform duration-200 lg:translate-x-0 flex flex-col',
          !isOpen && '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎥</div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">Smart Camera</h1>
              <p className="text-xs text-gray-500 dark:text-dark-400">نظام المراقبة الذكي</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onItemClick?.(item.id);
                onClose?.();
              }}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                activeItem === item.id
                  ? 'bg-gradient-primary text-white font-semibold shadow-lg shadow-blue-500/50'
                  : 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-right">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-dark-700 p-4 space-y-2">
          <button
            onClick={() => {
              onSettingsClick?.();
              onClose?.();
            }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 text-sm transition-colors"
          >
            <span>⚙️</span>
            <span className="flex-1 text-right">الإعدادات</span>
          </button>
          <button
            onClick={onLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700 text-sm transition-colors"
          >
            <span>🚪</span>
            <span className="flex-1 text-right">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
