import React, { useEffect } from 'react';
import { Badge } from '@components/Common';
import useThemeStore from '@store/themeStore';

interface HeaderProps {
  title: string;
  unreadAlerts?: number;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, unreadAlerts = 0, onMenuToggle }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg lg:hidden transition-colors"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{title}</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Alerts Badge */}
          {unreadAlerts > 0 && (
            <div className="relative">
              <button className="text-2xl hover:text-blue-600 transition-colors relative">
                🔔
                <span className="absolute top-0 right-0 animate-pulse">
                  <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                </span>
              </button>
              <Badge variant="danger" className="absolute -top-2 -right-2 animate-bounce">
                {unreadAlerts}
              </Badge>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-all duration-300 text-xl"
            title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-lg">
              ك
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-dark-300">المراقب</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
