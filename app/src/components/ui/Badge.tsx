import React from 'react';
import { ApplicationStatus } from '@/lib/types';

interface BadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<
    ApplicationStatus,
    { label: string; bg: string; text: string; dot: string; border: string }
  > = {
    draft: {
      label: 'Draft',
      bg: 'bg-zinc-100 dark:bg-zinc-800',
      text: 'text-zinc-700 dark:text-zinc-300',
      dot: 'bg-zinc-400',
      border: 'border-zinc-200 dark:border-zinc-700',
    },
    submitted: {
      label: 'Diajukan',
      bg: 'bg-blue-50/60 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500',
      border: 'border-blue-200/80 dark:border-blue-800/60',
    },
    revision_needed: {
      label: 'Perlu Revisi',
      bg: 'bg-amber-50/60 dark:bg-amber-950/40',
      text: 'text-amber-800 dark:text-amber-300',
      dot: 'bg-amber-500',
      border: 'border-amber-200/80 dark:border-amber-800/60',
    },
    verified: {
      label: 'Terverifikasi',
      bg: 'bg-teal-50/60 dark:bg-teal-950/40',
      text: 'text-teal-700 dark:text-teal-300',
      dot: 'bg-teal-500',
      border: 'border-teal-200/80 dark:border-teal-800/60',
    },
    approved: {
      label: 'Disetujui',
      bg: 'bg-emerald-50/60 dark:bg-emerald-950/40',
      text: 'text-emerald-800 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200/80 dark:border-emerald-800/60',
    },
    rejected: {
      label: 'Ditolak',
      bg: 'bg-rose-50/60 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      dot: 'bg-rose-500',
      border: 'border-rose-200/80 dark:border-rose-800/60',
    },
    completed: {
      label: 'LPJ Selesai',
      bg: 'bg-zinc-100 dark:bg-zinc-800/80',
      text: 'text-zinc-800 dark:text-zinc-200',
      dot: 'bg-zinc-600 dark:bg-zinc-400',
      border: 'border-zinc-300 dark:border-zinc-700',
    },
  };

  const config = configs[status] || configs.draft;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
