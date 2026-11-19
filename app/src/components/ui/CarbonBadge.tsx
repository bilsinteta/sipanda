import React from 'react';

interface CarbonBadgeProps {
  gramsCO2?: number;
  cleanerThanPercent?: number;
  interactive?: boolean;
}

export const CarbonBadge: React.FC<CarbonBadgeProps> = ({
  gramsCO2 = 0.08,
  cleanerThanPercent = 91,
  interactive = true,
}) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-xs">
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-semibold text-emerald-800 dark:text-emerald-300">
        🌱 {gramsCO2}g CO₂/kunjungan
      </span>
      <span className="text-slate-400 dark:text-slate-500">|</span>
      <span className="text-emerald-700 dark:text-emerald-400">
        Lebih bersih dari {cleanerThanPercent}% web
      </span>
      {interactive && (
        <a
          href="https://www.websitecarbon.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-800 dark:text-emerald-300 hover:underline font-medium text-[11px] ml-1"
          title="Uji langsung di Website Carbon Calculator"
        >
          [Uji Web ↗]
        </a>
      )}
    </div>
  );
};

