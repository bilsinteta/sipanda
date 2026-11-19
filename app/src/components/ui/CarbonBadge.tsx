import React from 'react';

interface CarbonBadgeProps {
  gramsCO2?: number;
  cleanerThanPercent?: number;
  interactive?: boolean;
}

export const CarbonBadge: React.FC<CarbonBadgeProps> = ({
  gramsCO2 = 0.02,
  cleanerThanPercent = 98,
  interactive = true,
}) => {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-xs text-zinc-700 dark:text-zinc-300">
      <span className="inline-flex items-center justify-center font-mono font-bold text-[10px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800">
        A+
      </span>
      <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
        {gramsCO2}g CO₂/visit
      </span>
      <span className="text-zinc-300 dark:text-zinc-700">·</span>
      <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
        Lebih bersih dari {cleanerThanPercent}% web
      </span>
      {interactive && (
        <a
          href="https://www.websitecarbon.com/website/sipanda-filkom-vercel-app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ml-0.5"
          title="Lihat sertifikasi terverifikasi di Website Carbon"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
};
