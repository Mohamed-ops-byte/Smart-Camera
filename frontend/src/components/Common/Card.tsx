import React from 'react';
import clsx from 'clsx';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ className, children, onClick }) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-dark-800 rounded-lg shadow-md dark:shadow-lg dark:shadow-dark-950 p-4 border border-gray-200 dark:border-dark-700 hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', className, children }) => {
  const variantClasses = {
    primary: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    info: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200',
  };

  return (
    <span className={clsx('px-2.5 py-0.5 text-xs font-semibold rounded-full', variantClasses[variant], className)}>
      {children}
    </span>
  );
};

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'recording' | 'alert';
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    recording: 'bg-red-500 animate-pulse',
    alert: 'bg-yellow-500 animate-pulse',
  };

  const statusLabels = {
    online: 'متصل',
    offline: 'غير متصل',
    recording: 'قيد التسجيل',
    alert: 'تنبيه',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={clsx('w-3 h-3 rounded-full', statusClasses[status])} />
      <span className="text-sm font-medium text-gray-700 dark:text-dark-300">{label || statusLabels[status]}</span>
    </div>
  );
};

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={clsx('bg-gray-200 rounded animate-pulse', className)} />
      ))}
    </>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-6xl">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
