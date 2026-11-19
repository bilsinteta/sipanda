import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
}) => {
  return (
    <div
      className={`bg-white dark:bg-zinc-900/70 border border-zinc-200/90 dark:border-zinc-800 rounded-xl overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3">
          <div>
            {title && (
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-3.5 sm:p-5">{children}</div>
    </div>
  );
};
