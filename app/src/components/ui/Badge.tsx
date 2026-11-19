import React from 'react';
import { ApplicationStatus } from '@/lib/types';

interface BadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<
    ApplicationStatus,
    { label: string; bg: string; text: string; dot: string }
  > = {
    draft: {
      label: 'Draft',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      dot: 'bg-slate-400',
    },
    submitted: {
      label: 'Diajukan',
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500',
    },
    revision_needed: {
      label: 'Perlu Revisi',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-800 dark:text-amber-300',
      dot: 'bg-amber-500',
    },
    verified: {
      label: 'Terverifikasi',
      bg: 'bg-teal-50 dark:bg-teal-950/60',
      text: 'text-teal-700 dark:text-teal-300',
      dot: 'bg-teal-500',
    },
    approved: {
      label: 'Disetujui',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
    },
    rejected: {
      label: 'Ditolak',
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-300',
      dot: 'bg-rose-500',
    },
    completed: {
      label: 'LPJ Selesai',
      bg: 'bg-purple-50 dark:bg-purple-950/60',
      text: 'text-purple-700 dark:text-purple-300',
      dot: 'bg-purple-500',
    },
  };

  const config = configs[status] || configs.draft;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.bg} ${config.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
