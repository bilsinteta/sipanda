import React from 'react';

interface SipandaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const SipandaLogo: React.FC<SipandaLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0 shadow-xs transition-transform`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
        >
          {/* Minimalist stylized Panda + Leaf Emblem */}
          {/* Ears */}
          <circle cx="9" cy="9" r="3.2" className="fill-emerald-500" />
          <circle cx="23" cy="9" r="3.2" className="fill-emerald-500" />
          {/* Head */}
          <circle
            cx="16"
            cy="18"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.2"
            className="text-zinc-100 dark:text-zinc-900"
          />
          {/* Eyes */}
          <ellipse
            cx="12"
            cy="16"
            rx="2"
            ry="2.5"
            className="fill-zinc-100 dark:fill-zinc-900"
          />
          <ellipse
            cx="20"
            cy="16"
            rx="2"
            ry="2.5"
            className="fill-zinc-100 dark:fill-zinc-900"
          />
          {/* Eco leaf fold */}
          <path
            d="M16 19c0 2.2 1.6 3.8 3.8 3.8 0-2.2-1.6-3.8-3.8-3.8z"
            className="fill-emerald-500"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-bold tracking-tight text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
            SIPANDA
          </span>
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            FILKOM UB
          </span>
        </div>
      )}
    </div>
  );
};
